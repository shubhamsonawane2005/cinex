import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasesComponent } from './releases';

describe('Releases', () => {
  let component: ReleasesComponent;
  let fixture: ComponentFixture<ReleasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
