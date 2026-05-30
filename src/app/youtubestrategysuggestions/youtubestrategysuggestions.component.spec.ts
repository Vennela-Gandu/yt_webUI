import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubestrategysuggestionsComponent } from './youtubestrategysuggestions.component';

describe('YoutubestrategysuggestionsComponent', () => {
  let component: YoutubestrategysuggestionsComponent;
  let fixture: ComponentFixture<YoutubestrategysuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubestrategysuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubestrategysuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
