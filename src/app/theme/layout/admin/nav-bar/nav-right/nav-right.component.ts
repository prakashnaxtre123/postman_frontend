// Angular Import
import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

// bootstrap
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss'],
  providers: [NgbDropdownConfig],
  animations: [
    trigger('slideInOutLeft', [
      transition(':enter', [style({ transform: 'translateX(100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('slideInOutRight', [
      transition(':enter', [style({ transform: 'translateX(-100%)' }), animate('300ms ease-in', style({ transform: 'translateX(0%)' }))]),
      transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))])
    ])
  ]
})
export class NavRightComponent implements OnInit{
  // public props
  visibleUserList: boolean;
  chatMessage: boolean;
  friendId!: number;
  parsedUserDetails: any;
  collaborators:any;
  flag = false;
  emailId: any;
  loading = false;

  // constructor
  constructor( private router:Router,private dataShare: DataSharingService, private httpRequest: HttpRequestService, private message:NzMessageService) {
    this.visibleUserList = false;
    this.chatMessage = false;

  }

  ngOnInit(): void {
    const userDetails: any = localStorage.getItem('postman_user_details');
    this.parsedUserDetails = JSON.parse(userDetails);
    this.dataShare.message2$.subscribe({
      next: (data:any) => {
       this.collaborators = data;
      },
      error: (err) => {
        console.log(err.error.message)
      }
    })
  }

  // public method
  onChatToggle(friendID: number) {
    this.friendId = friendID;
    this.chatMessage = !this.chatMessage;
  }
  logout(){
    localStorage.removeItem("postman_user_details")
    this.router.navigate(['auth/signin'])
  }
  addCollaborator(){
    this.loading = true
    let email = this.emailId;
    let teamId = this.collaborators._id
    let obj = {email,teamId};
    this.httpRequest.assignUserToTeam(obj).subscribe({
      next:(res:any) => {
        this.message.success(res.message);
        this.dataShare.updateMessage1("update")
        this.flag = false;
        this.emailId = undefined
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.message.error(err.error.message)
      }
    })
  }
  collaboratorView(){
    this.flag = !this.flag
  }
  unAssignedUser(user:any){
    user.loading = true
    let teamId = this.collaborators._id
    let userId = user._id
    let obj = {userId,teamId}
    this.httpRequest.unAssignUserToTeam(obj).subscribe({
      next: (res:any) => {
        this.dataShare.updateMessage1("update")
        this.message.success(res.message)
        user.loading = false
      },
      error:(err) => {
        user.loading = false
        this.message.error(err.error.message)
      }
    })
  }
}
