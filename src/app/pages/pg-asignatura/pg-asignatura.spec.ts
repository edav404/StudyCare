import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgAsignatura } from './pg-asignatura';

describe('PgAsignatura', () => {
  let component: PgAsignatura;
  let fixture: ComponentFixture<PgAsignatura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgAsignatura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgAsignatura);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
