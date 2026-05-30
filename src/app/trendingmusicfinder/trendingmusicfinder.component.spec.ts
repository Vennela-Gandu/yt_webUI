import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrendingmusicfinderComponent } from './trendingmusicfinder.component';

describe('TrendingmusicfinderComponent', () => {
  let component: TrendingmusicfinderComponent;
  let fixture: ComponentFixture<TrendingmusicfinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrendingmusicfinderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrendingmusicfinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
