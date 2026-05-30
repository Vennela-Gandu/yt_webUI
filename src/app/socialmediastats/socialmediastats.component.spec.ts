import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialmediastatsComponent } from './socialmediastats.component';

describe('SocialmediastatsComponent', () => {
  let component: SocialmediastatsComponent;
  let fixture: ComponentFixture<SocialmediastatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialmediastatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialmediastatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
