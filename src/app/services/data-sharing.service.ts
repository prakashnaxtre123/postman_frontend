import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  constructor() { }
  private message = new BehaviorSubject('');
  message$ = this.message.asObservable();

  updateMessage(msg:any){
    this.message.next(msg)
  }
}
