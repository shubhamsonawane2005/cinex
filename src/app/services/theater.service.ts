import { Injectable } from '@angular/core';
interface ScheduledMovie {
  title: string;
  image: string;
  times: { time: string; bookedCount: number; totalSeats: number }[];
}

interface Theater {
  id: number;
  name: string;
  location: string;
  facilities: string;
  movies: ScheduledMovie[];
}
@Injectable({ providedIn: 'root' })
export class TheaterService {
  private theaters: Theater[] = [
    {
      id: 1,
      name: 'PVR: Rahul Raj Mall',
      location: 'Piplod, Surat',
      facilities: 'Dolby Atmos, Recliners',
      movies: [],
    },
    {
      id: 2,
      name: 'INOX: VR Mall',
      location: 'Dumas Rd, Surat',
      facilities: 'IMAX, Laser',
      movies: [],
    },
    {
      id: 3,
      name: 'Cinépolis: Imperial Square',
      location: 'Adajan, Surat',
      facilities: '4DX, Coffee Shop',
      movies: [],
    },
    {
      id: 4,
      name: 'Rajhans Multiplex',
      location: 'Pal, Surat',
      facilities: 'Budget Friendly',
      movies: [],
    }
  ];
  constructor() {}

  getTheaters() : Theater[]{
    return this.theaters;
  }

//   deleteTheater(id: number) {
//     this.theaters = this.theaters.filter(t => t.id !== id);
//   }
}
