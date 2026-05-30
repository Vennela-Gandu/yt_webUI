import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentideasComponent } from './contentideas.component';

describe('ContentideasComponent', () => {
  let component: ContentideasComponent;
  let fixture: ComponentFixture<ContentideasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContentideasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentideasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
