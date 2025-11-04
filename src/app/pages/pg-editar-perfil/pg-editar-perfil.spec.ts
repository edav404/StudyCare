import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgEditarPerfil } from './pg-editar-perfil';

describe('PgEditarPerfil', () => {
  let component: PgEditarPerfil;
  let fixture: ComponentFixture<PgEditarPerfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgEditarPerfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgEditarPerfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
