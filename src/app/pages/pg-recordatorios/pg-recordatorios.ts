import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface PostureConfig {
  interval: number; // minutos
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  days: number[]; // 0..6
  enableSound: boolean;
}

@Component({
  selector: 'app-pg-recordatorios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pg-recordatorios.html',
  styleUrls: ['./pg-recordatorios.css'], // opcional, si quieres css separado
})
export class PgRecordatoriosComponent implements OnInit, OnDestroy {
  // datos bindables del formulario
  interval = 30;
  startTime = '08:00';
  endTime = '22:00';
  selectedDays: number[] = []; // se enlaza con [ngValue] en el template
  enableSound = false;

  // UI
  logLines: string[] = [];
  postureTips: string[] = [
    'Alinea tus orejas con tus hombros; evita encorvar el cuello.',
    'Pies apoyados en el suelo; rodillas en 90°.',
    'Pantalla a la altura de los ojos para evitar inclinar el cuello.',
    'Usa un soporte lumbar o una toalla enrollada para mantener la curvatura natural.',
    'Toma un descanso corto: 1–2 min de estiramiento cada 30–45 min.',
    'Ajusta la iluminación para evitar forzar la vista.',
    'Si estudias mucho, alterna posiciones (sentado/de pie) cada cierto tiempo.',
  ];
  tipsToShow: string[] = [];

  // scheduler
  private scheduler: any = null;
  private lastTipIndex = -1;

  // persistence key
  private readonly STORAGE_KEY = 'studycare_posture_config';
  constructor(private router: Router) {}
  // UX flags
  saving = false;
  running = false;

  ngOnInit(): void {
    this.tipsToShow = [...this.postureTips];
    const cfg = this.loadConfig();
    if (cfg) {
      // rellenar formulario desde config
      this.interval = cfg.interval ?? this.interval;
      this.startTime = cfg.startTime ?? this.startTime;
      this.endTime = cfg.endTime ?? this.endTime;
      this.selectedDays = Array.isArray(cfg.days) ? cfg.days : [];
      this.enableSound = !!cfg.enableSound;
      this.log('Configuración cargada desde localStorage.');
      // si ya hay permiso, arrancar scheduler automáticamente
      if (Notification && Notification.permission === 'granted') {
        this.startScheduler(cfg);
      } else {
        this.log('No se inició scheduler automáticamente: permisos de notificación no concedidos.');
      }
    } else {
      this.log('Sin configuración previa.');
    }
  }

  ngOnDestroy(): void {
    this.stopScheduler();
  }

  // ----------------------------
  // Utilidades / persistencia
  // ----------------------------
  private log(message: string) {
    const time = new Date().toLocaleString();
    this.logLines.unshift(`${time} — ${message}`);
    // limitar tamaño del log para no ocupar memoria infinita
    if (this.logLines.length > 200) this.logLines.length = 200;
  }

  private saveConfigObj(cfg: PostureConfig) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cfg));
      this.log('Configuración guardada.');
    } catch (e) {
      this.log('Error guardando configuración en localStorage.');
    }
  }

  private loadConfig(): PostureConfig | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as PostureConfig;
      return parsed;
    } catch {
      return null;
    }
  }

  // ----------------------------
  // Notificaciones & Service Worker
  // ----------------------------
  async requestPermissionsAndRegisterSW(): Promise<boolean> {
    if (!('Notification' in window)) {
      this.log('Este navegador no soporta notificaciones.');
      return false;
    }

    let perm = Notification.permission;
    if (perm !== 'granted') {
      perm = await Notification.requestPermission();
    }

    if (perm !== 'granted') {
      this.log('Permiso de notificaciones denegado o pendiente.');
      return false;
    }

    this.log('Permiso de notificaciones concedido.');

    if ('serviceWorker' in navigator) {
      try {
        // intenta registrar sw.js en la raíz del proyecto (si existe)
        const reg = await (navigator as any).serviceWorker.register('/sw.js').catch(() => null);
        if (reg) this.log('Service Worker registrado: ' + (reg.scope ?? 'scope desconocido'));
        else this.log('No se registró Service Worker (archivo no encontrado o ya registrado).');
      } catch (err: any) {
        this.log('Error registrando Service Worker: ' + (err?.message ?? err));
      }
    } else {
      this.log('Service Worker no soportado en este navegador.');
    }

    return true;
  }

  // reproduce un beep corto usando WebAudio (funciona sin archivos externos)
  private playBeep() {
    try {
      const ctx = new (window as any).AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        try {
          ctx.close();
        } catch {}
      }, 160);
    } catch {
      // silencioso si falla
    }
  }

  // ----------------------------
  // Scheduler
  // ----------------------------
  async onSaveAndStart() {
    this.saving = true;
    const granted = await this.requestPermissionsAndRegisterSW();
    const cfg: PostureConfig = {
      interval: Math.max(1, Math.floor(Number(this.interval))),
      startTime: this.startTime,
      endTime: this.endTime,
      days: Array.isArray(this.selectedDays) ? this.selectedDays : [],
      enableSound: !!this.enableSound,
    };
    this.saveConfigObj(cfg);
    if (granted) {
      this.startScheduler(cfg);
    } else {
      this.log('No se inició scheduler porque no hay permisos.');
    }
    this.saving = false;
  }

  startScheduler(cfg: PostureConfig) {
    // detener si ya existe
    this.stopScheduler();
    const minutes = Math.max(1, Number(cfg.interval));
    this.log(
      `Scheduler iniciado: cada ${minutes} min entre ${cfg.startTime} y ${cfg.endTime} en días ${
        cfg.days.join(',') || '—'
      }`
    );
    const tick = async () => {
      if (this.isWithinSchedule(cfg.startTime, cfg.endTime, cfg.days)) {
        const tip = this.getNextTip();
        await this.showLocalNotification('Postura — StudyCare', tip, cfg.enableSound);
        this.log('Notificación enviada: ' + tip);
      } else {
        this.log('Fuera del horario/día configurado. No se envía recordatorio.');
      }
    };
    // ejecutar inmediatamente y después en intervalos
    tick();
    this.scheduler = setInterval(tick, minutes * 60 * 1000);
    this.running = true;
  }

  stopScheduler() {
    if (this.scheduler) {
      clearInterval(this.scheduler);
      this.scheduler = null;
      this.log('Scheduler detenido.');
      this.running = false;
    }
  }

  async testNotification() {
    const granted = await this.requestPermissionsAndRegisterSW();
    if (!granted) return;
    const tip = this.getNextTip();
    await this.showLocalNotification('Prueba — Postura', tip, this.enableSound);
    this.log('Notificación de prueba enviada.');
  }

  private getNextTip() {
    let idx = Math.floor(Math.random() * this.postureTips.length);
    if (idx === this.lastTipIndex) idx = (idx + 1) % this.postureTips.length;
    this.lastTipIndex = idx;
    return this.postureTips[idx];
  }

  private isWithinSchedule(startTime: string, endTime: string, activeDays: number[]): boolean {
    const now = new Date();
    const today = now.getDay(); // 0 dom ... 6 sab
    if (!Array.isArray(activeDays) || activeDays.length === 0) return false;
    if (!activeDays.includes(today)) return false;

    const [sh, sm] = startTime.split(':').map((s) => Number(s));
    const [eh, em] = endTime.split(':').map((s) => Number(s));
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    const nowMins = now.getHours() * 60 + now.getMinutes();

    if (startMins <= endMins) {
      return nowMins >= startMins && nowMins <= endMins;
    } else {
      // horario que cruza medianoche
      return nowMins >= startMins || nowMins <= endMins;
    }
  }

  private async showLocalNotification(title: string, body: string, sound: boolean) {
    if (!('Notification' in window)) {
      this.log('Notifications API no soportada.');
      return;
    }
    if (Notification.permission !== 'granted') {
      this.log('Permiso de notificaciones no concedido.');
      return;
    }

    if (sound) this.playBeep();

    try {
      const n = new Notification(title, {
        body,
        // icon puedes apuntarlo a /assets/.. si quieres
      });
      n.onclick = () => {
        window.focus();
        this.log('Usuario hizo click en la notificación.');
      };
    } catch (e) {
      this.log('Error mostrando notificación: ' + ((e as any)?.message ?? e));
    }
  }

  navItems = [
    { path: '/inicio', label: 'Inicio', icon: '🏠' },
    { path: '/estados-animo', label: 'Ánimo', icon: '😊' },
    { path: '/asignaturas', label: 'Asignaturas', icon: '📘' },
    { path: '/recursos', label: 'Recursos', icon: '📚' },
    { path: '/recordatorios', label: 'Recordatorios', icon: '⏰' },
  ];
  isActive(path: string): boolean {
    return this.router.url === path;
  }

  // ----------------------------
  // Métodos llamados desde el template
  // ----------------------------
  onSaveClick() {
    this.onSaveAndStart();
  }

  onStopClick() {
    this.stopScheduler();
  }

  onTestClick() {
    this.testNotification();
  }

  // helper to show tips on the UI card (no relación con notifications)
  shuffleTips() {
    // muestra 3 tips aleatorios sin repetir
    const copy = [...this.postureTips];
    const out: string[] = [];
    while (out.length < 3 && copy.length) {
      const i = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(i, 1)[0]);
    }
    this.tipsToShow = out;
  }
}
