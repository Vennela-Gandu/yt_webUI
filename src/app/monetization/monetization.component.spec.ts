import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonetizationComponent } from './monetization.component';

describe('MonetizationComponent', () => {
  let component: MonetizationComponent;
  let fixture: ComponentFixture<MonetizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonetizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonetizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
