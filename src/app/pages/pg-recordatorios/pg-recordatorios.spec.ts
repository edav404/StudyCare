import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgRecordatorios } from './pg-recordatorios';

describe('PgRecordatorios', () => {
  let component: PgRecordatorios;
  let fixture: ComponentFixture<PgRecordatorios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgRecordatorios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgRecordatorios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
