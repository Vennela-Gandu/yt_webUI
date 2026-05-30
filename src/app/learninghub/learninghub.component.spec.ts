import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearninghubComponent } from './learninghub.component';

describe('LearninghubComponent', () => {
  let component: LearninghubComponent;
  let fixture: ComponentFixture<LearninghubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearninghubComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearninghubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
