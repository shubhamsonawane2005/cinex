import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTheaters } from './manage-theaters';

describe('ManageTheaters', () => {
  let component: ManageTheaters;
  let fixture: ComponentFixture<ManageTheaters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTheaters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTheaters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
