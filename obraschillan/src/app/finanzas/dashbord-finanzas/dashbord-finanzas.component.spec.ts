import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordFinanzasComponent } from './dashbord-finanzas.component';

describe('DashbordFinanzasComponent', () => {
  let component: DashbordFinanzasComponent;
  let fixture: ComponentFixture<DashbordFinanzasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbordFinanzasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordFinanzasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
