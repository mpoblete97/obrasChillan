import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordEncargadoComponent } from './dashbord-encargado.component';

describe('DashbordEncargadoComponent', () => {
  let component: DashbordEncargadoComponent;
  let fixture: ComponentFixture<DashbordEncargadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashbordEncargadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashbordEncargadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
