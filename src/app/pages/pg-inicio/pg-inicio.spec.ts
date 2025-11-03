import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgInicio } from './pg-inicio';

describe('PgInicio', () => {
  let component: PgInicio;
  let fixture: ComponentFixture<PgInicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgInicio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgInicio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
