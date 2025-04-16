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

  private message1 = new BehaviorSubject('');
  message1$ = this.message1.asObservable();

  updateMessage1(msg:any){
    this.message1.next(msg)
  }

  private message2 = new BehaviorSubject(null);
  message2$ = this.message2.asObservable();

  updateMessage2(msg:any){
    this.message2.next(msg)
  }
}
