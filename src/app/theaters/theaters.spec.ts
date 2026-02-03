import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Theaters } from './theaters';

describe('Theaters', () => {
  let component: Theaters;
  let fixture: ComponentFixture<Theaters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Theaters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Theaters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
