import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordCiudadanoComponent } from './dashbord-ciudadano.component';

describe('DashbordCiudadanoComponent', () => {
  let component: DashbordCiudadanoComponent;
  let fixture: ComponentFixture<DashbordCiudadanoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbordCiudadanoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordCiudadanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
