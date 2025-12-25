import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly LOGIN_URL = 'mockup/login.json';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    return this.http
      .get<{ username: string; password: string }>(this.LOGIN_URL)
      .pipe(
        map(data => data.username === username && data.password === password)
      );
  }
  
}
