import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitoranalysisComponent } from './competitoranalysis.component';

describe('CompetitoranalysisComponent', () => {
  let component: CompetitoranalysisComponent;
  let fixture: ComponentFixture<CompetitoranalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitoranalysisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitoranalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
