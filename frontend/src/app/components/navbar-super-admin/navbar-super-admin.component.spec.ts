import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarSuperAdminComponent } from './navbar-super-admin.component';

describe('NavbarSuperAdminComponent', () => {
  let component: NavbarSuperAdminComponent;
  let fixture: ComponentFixture<NavbarSuperAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarSuperAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
