import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramcontentsuggestionsComponent } from './instagramcontentsuggestions.component';

describe('InstagramcontentsuggestionsComponent', () => {
  let component: InstagramcontentsuggestionsComponent;
  let fixture: ComponentFixture<InstagramcontentsuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramcontentsuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstagramcontentsuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
