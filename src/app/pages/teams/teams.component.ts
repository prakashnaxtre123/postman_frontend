import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import RequestsComponent from '../requests/requests.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [SharedModule,NzMenuModule,NzIconModule,RequestsComponent,NzButtonModule,NzInputModule,NzDropDownModule,NzPopconfirmModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export default class TeamsComponent implements OnInit {
  workspaceList: any;
  documentDetails:any;
  workspaceName: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpRequest:HttpRequestService,
    private message: NzMessageService,
    private dataShare:DataSharingService){

  }
  ngOnInit(): void {
   this.activatedRoute.params.subscribe((param:any) => {
    this.getTeamDetailsByTeamId(param.id)
   })

   this.dataShare.message1$.subscribe((msg) => {
    if(msg == 'update'){
      this.activatedRoute.params.subscribe((param:any) => {
        this.getTeamDetailsByTeamId(param.id)
       })
    }
  })
  }


  getTeamDetailsByTeamId(teamId:any){
   this.httpRequest.getTeamDetails(teamId).subscribe({
    next: (res:any) => {
      this.dataShare.updateMessage2(res.data.team)
      this.workspaceList = res.data.workspaces;
    },
    error: (err) => {
      console.log(err)
    }
   })

  }

  showDocument(docs:any){
    this.documentDetails = docs
  }

  createDocument(title:any, workspaceId:''){
    let content = ''
    let obj = {title,workspaceId,content}
    this.httpRequest.createDocument(obj).subscribe({
      next:(res:any)=>{
        this.message.success(res.message)
        this.activatedRoute.params.subscribe((param:any) => {
          this.getTeamDetailsByTeamId(param.id)
         })
      },
      error:(err)=>{
        this.message.success(err.error.message)
      }
    })
  }

  createWorkspace(){
    let name = this.workspaceName
    let teamId: any
    this.activatedRoute.params.subscribe((param:any) => {
     teamId = param.id
     })
    let obj = {name,teamId}
    this.httpRequest.createWorkspace(obj).subscribe({
      next:(res:any)=> {
        this.message.success(res.message);
        this.workspaceName = undefined
        this.getTeamDetailsByTeamId(teamId)

      },
      error:(err) => {
        this.message.error(err.error.message)
      }
    })
  }

  deleteDocument(doc: any) {
    this.httpRequest.deleteDocument(doc._id).subscribe({
      next: (res:any) => {
        this.message.success(res.message);
        this.documentDetails = undefined
        this.dataShare.updateMessage1("update")
      },
      error: (err) => {
        this.message.error(err.error.message)
      }
    })
  }


}
