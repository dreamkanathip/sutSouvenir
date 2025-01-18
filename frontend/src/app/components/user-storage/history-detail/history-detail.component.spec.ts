import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetailComponent } from './history-detail.component';

describe('HistoryDetailComponent', () => {
  let component: HistoryDetailComponent;
  let fixture: ComponentFixture<HistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HistoryDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
