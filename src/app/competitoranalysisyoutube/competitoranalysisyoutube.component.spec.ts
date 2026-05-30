import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitoranalysisyoutubeComponent } from './competitoranalysisyoutube.component';

describe('CompetitoranalysisyoutubeComponent', () => {
  let component: CompetitoranalysisyoutubeComponent;
  let fixture: ComponentFixture<CompetitoranalysisyoutubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitoranalysisyoutubeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitoranalysisyoutubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
