import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtseoComponent } from './ytseo.component';

describe('YtseoComponent', () => {
  let component: YtseoComponent;
  let fixture: ComponentFixture<YtseoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YtseoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YtseoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
