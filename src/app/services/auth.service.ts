import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENDPOINTS } from '../@core/API-ENDPOINTS';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.login}`,data)
  }
  register(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.register}`,data)
  }
}
