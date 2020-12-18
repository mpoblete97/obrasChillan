import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarReporteComponent } from './ingresar-reporte.component';

describe('IngresarReporteComponent', () => {
  let component: IngresarReporteComponent;
  let fixture: ComponentFixture<IngresarReporteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresarReporteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarReporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
