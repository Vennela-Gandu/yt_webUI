import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitoranalysislinkedinComponent } from './competitoranalysislinkedin.component';

describe('CompetitoranalysislinkedinComponent', () => {
  let component: CompetitoranalysislinkedinComponent;
  let fixture: ComponentFixture<CompetitoranalysislinkedinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetitoranalysislinkedinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitoranalysislinkedinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
