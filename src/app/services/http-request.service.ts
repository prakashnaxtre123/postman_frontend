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
    let userDetails:any = localStorage.getItem('postman_user_details');
    this.parsedUserDetails = JSON.parse(userDetails);
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.parsedUserDetails.token}`
    })
    console.log(this.parsedUserDetails)
  }

  getTeams(){
    return this.http.get(`${environment.apiUrl + ENDPOINTS.getTeams}/${this.parsedUserDetails.user._id} `,{ headers: this.headers })
  }
  getTeamDetails(teamId:any){
    return this.http.get(`${environment.apiUrl + ENDPOINTS.teamDetails}/${teamId} `,{ headers: this.headers })
  }
  createDocument(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createDocument}`,data,{ headers: this.headers })
  }
  updateDocument(paramId:any,data:any){
    return this.http.put(`${environment.apiUrl + ENDPOINTS.createDocument}/${paramId}`,data,{ headers: this.headers })
  }
  createWorkspace(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createWorkspace}`,data,{ headers: this.headers })
  }
  createTeam(data:any){
    return this.http.post(`${environment.apiUrl + ENDPOINTS.createTeam}`,data,{ headers: this.headers })
  }
}
