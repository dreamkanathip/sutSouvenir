import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSidenavComponent } from './user-sidenav.component';

describe('UserSidenavComponent', () => {
  let component: UserSidenavComponent;
  let fixture: ComponentFixture<UserSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
