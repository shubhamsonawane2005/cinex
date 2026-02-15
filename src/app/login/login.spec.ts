// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Login } from './login';

// describe('Login', () => {
//   let component: Login;
//   let fixture: ComponentFixture<Login>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Login]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Login);
//     component = fixture.componentInstance;
//     await fixture.whenStable();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// 15 ko use kiya h maine

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login'; // Check karein agar class ka naam LoginComponent hai

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});