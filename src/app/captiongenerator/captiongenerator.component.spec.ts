import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptiongeneratorComponent } from './captiongenerator.component';

describe('CaptiongeneratorComponent', () => {
  let component: CaptiongeneratorComponent;
  let fixture: ComponentFixture<CaptiongeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptiongeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptiongeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
