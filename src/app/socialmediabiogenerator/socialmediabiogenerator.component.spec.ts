import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmediabiogeneratorComponent } from './socialmediabiogenerator.component';

describe('SocialmediabiogeneratorComponent', () => {
  let component: SocialmediabiogeneratorComponent;
  let fixture: ComponentFixture<SocialmediabiogeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialmediabiogeneratorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialmediabiogeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
