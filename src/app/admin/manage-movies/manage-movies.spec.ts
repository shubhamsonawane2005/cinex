import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMoviesComponent } from './manage-movies';

describe('ManageMovies', () => {
  let component: ManageMoviesComponent;
  let fixture: ComponentFixture<ManageMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMoviesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
