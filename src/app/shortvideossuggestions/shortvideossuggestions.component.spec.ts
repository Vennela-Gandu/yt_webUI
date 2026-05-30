import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortvideossuggestionsComponent } from './shortvideossuggestions.component';

describe('ShortvideossuggestionsComponent', () => {
  let component: ShortvideossuggestionsComponent;
  let fixture: ComponentFixture<ShortvideossuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortvideossuggestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortvideossuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
