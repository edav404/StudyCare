import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgEstadosAnimo } from './pg-estados-animo';

describe('PgEstadosAnimo', () => {
  let component: PgEstadosAnimo;
  let fixture: ComponentFixture<PgEstadosAnimo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgEstadosAnimo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgEstadosAnimo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
