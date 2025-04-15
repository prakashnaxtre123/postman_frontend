import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ENDPOINTS } from '../@core/API-ENDPOINTS';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {
  private parsedUserDetails: any;
  private headers: any

  constructor(private http: HttpClient) {
  }
  private getHeaders(): HttpHeaders {
    const userDetails: any = localStorage.getItem('postman_user_details');
    const parsedUserDetails = JSON.parse(userDetails);
    return new HttpHeaders({
      'Authorization': `Bearer ${parsedUserDetails?.token}`
    });
  }

  getTeams() {
    const userDetails: any = localStorage.getItem('postman_user_details');
    const parsedUserDetails = JSON.parse(userDetails);
    return this.http.get(
      `${environment.apiUrl + ENDPOINTS.getTeams}/${parsedUserDetails.user._id}`,
      { headers: this.getHeaders() }
    );
  }
  getTeamDetails(teamId:any){
    return this.http.get(`${environment.apiUrl + ENDPOINTS.teamDetails}/${teamId} `,{ headers: this.getHeaders() })
  }
  createDocument(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createDocument}`,data,{ headers: this.getHeaders() })
  }
  updateDocument(paramId:any,data:any){
    return this.http.put(`${environment.apiUrl + ENDPOINTS.createDocument}/${paramId}`,data,{ headers: this.getHeaders() })
  }
  createWorkspace(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createWorkspace}`,data,{ headers: this.getHeaders() })
  }
  createTeam(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createTeam}`,data,{ headers: this.getHeaders() })
  }
  deleteDocument(id:any){
    return this.http.delete(`${environment.apiUrl + ENDPOINTS.deleteDocument}/${id}`,{ headers: this.getHeaders() })
  }
}
