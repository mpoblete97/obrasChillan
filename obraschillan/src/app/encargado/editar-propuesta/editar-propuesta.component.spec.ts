import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPropuestaComponent } from './editar-propuesta.component';

describe('EditarPropuestaComponent', () => {
  let component: EditarPropuestaComponent;
  let fixture: ComponentFixture<EditarPropuestaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPropuestaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPropuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
