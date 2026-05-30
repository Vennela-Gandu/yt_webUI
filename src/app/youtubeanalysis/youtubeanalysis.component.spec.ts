import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubeanalysisComponent } from './youtubeanalysis.component';

describe('YoutubeanalysisComponent', () => {
  let component: YoutubeanalysisComponent;
  let fixture: ComponentFixture<YoutubeanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubeanalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YoutubeanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
