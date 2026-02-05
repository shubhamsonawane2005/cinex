import { TestBed } from '@angular/core/testing';

// import { Movie } from './movie';
import { ReleseMovie} from './relese.movie'

describe('Movie', () => {
  let service: ReleseMovie;

  beforeEach(() => {
    TestBed.configureTestingModule({
        providers: [ReleseMovie]
    });
    service = TestBed.inject(ReleseMovie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
