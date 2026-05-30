import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubecontentsuggestionsComponent } from './youtubecontentsuggestions.component';

describe('YoutubecontentsuggestionsComponent', () => {
  let component: YoutubecontentsuggestionsComponent;
  let fixture: ComponentFixture<YoutubecontentsuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubecontentsuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubecontentsuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
