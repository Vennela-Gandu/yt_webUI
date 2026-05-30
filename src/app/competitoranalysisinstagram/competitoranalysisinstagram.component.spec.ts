import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitoranalysisinstagramComponent } from './competitoranalysisinstagram.component';

describe('CompetitoranalysisinstagramComponent', () => {
  let component: CompetitoranalysisinstagramComponent;
  let fixture: ComponentFixture<CompetitoranalysisinstagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitoranalysisinstagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitoranalysisinstagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
