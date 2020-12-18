import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTarjetaComponent } from './ver-tarjeta.component';

describe('VerTarjetaComponent', () => {
  let component: VerTarjetaComponent;
  let fixture: ComponentFixture<VerTarjetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerTarjetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
