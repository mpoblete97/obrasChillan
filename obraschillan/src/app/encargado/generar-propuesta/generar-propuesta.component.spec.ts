import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPropuestaComponent } from './generar-propuesta.component';

describe('GenerarPropuestaComponent', () => {
  let component: GenerarPropuestaComponent;
  let fixture: ComponentFixture<GenerarPropuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerarPropuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarPropuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
