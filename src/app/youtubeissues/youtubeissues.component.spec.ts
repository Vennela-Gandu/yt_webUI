import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeissuesComponent } from './youtubeissues.component';

describe('YoutubeissuesComponent', () => {
  let component: YoutubeissuesComponent;
  let fixture: ComponentFixture<YoutubeissuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubeissuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
