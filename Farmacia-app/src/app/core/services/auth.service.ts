import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = '/api/auth';
  private userRole = new BehaviorSubject<string | null>(null);
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  private checkToken() {
    if (this.hasToken()) {
      const token = this.getToken()!;
      this.decodeToken(token);
      this.loggedIn.next(true);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.decodeToken(response.token);
        this.loggedIn.next(true);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.userRole.next(null);
    this.loggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeToken(token: string) {
    try {
      const decodedToken: any = jwtDecode(token);
      this.userRole.next(decodedToken.rol); // Asegúrate que el claim se llame 'rol'
    } catch (error) {
      console.error('Error decoding token', error);
      this.userRole.next(null);
    }
  }

  getRole(): Observable<string | null> {
    return this.userRole.asObservable();
  }
}
