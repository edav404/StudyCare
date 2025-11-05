import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

type Mode = 'study' | 'rest';

interface PomodoroState {
  mode: Mode;
  remaining: number; // seconds
  isRunning: boolean;
  endTime?: number | null; // ms timestamp
  cyclesCompleted: number;
}

const STORAGE_KEY = 'studycare_pomodoro_v1';

@Component({
  selector: 'app-pg-pomodoro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pg-pomodoro.component.html',
  styleUrls: ['./pg-pomodoro.component.css']
})
export class PgPomodoroComponent implements OnInit, OnDestroy {
  // default durations (seconds)
  readonly STUDY_DEFAULT = 25 * 60;
  readonly REST_DEFAULT = 5 * 60;

  // state
  mode: Mode = 'study';
  remaining = this.STUDY_DEFAULT;
  isRunning = false;
  endTime: number | null = null;
  cyclesCompleted = 0;

  private timerId: any = null;

  // UI helpers
  get minutes() {
    return Math.floor(this.remaining / 60).toString().padStart(2, '0');
  }

  get seconds() {
    return (this.remaining % 60).toString().padStart(2, '0');
  }

  get modeLabel() {
    return this.mode === 'study' ? 'Enfocado' : 'Descanso';
  }

  get modeColor() {
    return this.mode === 'study' ? '#3b82f6' : '#10b981';
  }

  get totalForMode() {
    return this.mode === 'study' ? this.STUDY_DEFAULT : this.REST_DEFAULT;
  }

  get progressPct() {
    const total = this.totalForMode;
    return Math.min(100, Math.round(((total - this.remaining) / total) * 100));
  }

  ngOnInit(): void {
    this.loadState();
    // if running, ensure timer updates according to endTime
    if (this.isRunning) {
      this.startTicker();
    }
  }

  ngOnDestroy(): void {
    this.clearTicker();
  }

  private loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s: PomodoroState = JSON.parse(raw);
      this.mode = s.mode ?? 'study';
      this.remaining = typeof s.remaining === 'number' ? s.remaining : this.totalForMode;
      this.isRunning = !!s.isRunning;
      this.endTime = s.endTime ?? null;
      this.cyclesCompleted = s.cyclesCompleted ?? 0;

      // If running and endTime exists, compute remaining by timestamp
      if (this.isRunning && this.endTime) {
        const rem = Math.max(0, Math.round((this.endTime - Date.now()) / 1000));
        this.remaining = rem;
        if (this.remaining <= 0) {
          // completed while away
          this.onCycleComplete();
        }
      }
    } catch (e) {
      console.error('Error loading pomodoro state', e);
    }
  }

  private saveState() {
    const state: PomodoroState = {
      mode: this.mode,
      remaining: this.remaining,
      isRunning: this.isRunning,
      endTime: this.endTime,
      cyclesCompleted: this.cyclesCompleted
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving pomodoro state', e);
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.endTime = Date.now() + this.remaining * 1000;
    this.saveState();
    this.startTicker();
  }

  pause() {
    if (!this.isRunning) return;
    this.isRunning = false;
    if (this.endTime) {
      this.remaining = Math.max(0, Math.round((this.endTime - Date.now()) / 1000));
    }
    this.endTime = null;
    this.saveState();
    this.clearTicker();
  }

  reset() {
    this.isRunning = false;
    this.endTime = null;
    this.remaining = this.totalForMode;
    this.saveState();
    this.clearTicker();
  }

  /**
   * Toggle entre modo estudio y modo descanso. Mantiene el temporizador en pausa
   * para que el usuario inicie manualmente el siguiente ciclo.
   */
  toggleMode() {
    if (this.mode === 'study') {
      this.mode = 'rest';
      this.remaining = this.REST_DEFAULT;
    } else {
      this.mode = 'study';
      this.remaining = this.STUDY_DEFAULT;
    }
    this.isRunning = false;
    this.endTime = null;
    this.saveState();
    this.clearTicker();
  }

  private startTicker() {
    this.clearTicker();
    this.timerId = setInterval(() => this.tick(), 500);
  }

  private clearTicker() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  private tick() {
    if (!this.isRunning) return;
    if (!this.endTime) return;
    const rem = Math.max(0, Math.round((this.endTime - Date.now()) / 1000));
    this.remaining = rem;
    if (this.remaining <= 0) {
      this.onCycleComplete();
    }
    this.saveState();
  }

  private onCycleComplete() {
    // play sound / visual
    this.playBeep();
    // if study completed, count a cycle
    if (this.mode === 'study') {
      this.cyclesCompleted++;
    }

    // swap modes and auto-start next
    this.mode = this.mode === 'study' ? 'rest' : 'study';
    this.remaining = this.totalForMode;
    // auto start next cycle
    this.isRunning = true;
    this.endTime = Date.now() + this.remaining * 1000;
    this.saveState();
    this.startTicker();
  }

  // small beep using WebAudio if available, fallback to short alert
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
      setTimeout(() => { o.stop(); ctx.close(); }, 250);
    } catch (e) {
      // ignore
    }
  }
}
