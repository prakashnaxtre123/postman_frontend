import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import RequestsComponent from '../requests/requests.component';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [SharedModule,NzMenuModule,NzIconModule,RequestsComponent,NzButtonModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.scss'
})
export default class TeamsComponent implements OnInit {
  workspaceList: any;
  documentDetails:any;

  constructor(private activatedRoute: ActivatedRoute, private httpRequest:HttpRequestService){

  }
  ngOnInit(): void {
   this.activatedRoute.params.subscribe((param:any) => {
    this.getTeamDetailsByTeamId(param.id)
   })
  }


  getTeamDetailsByTeamId(teamId:any){
    console.log(teamId)
   this.httpRequest.getTeamDetails(teamId).subscribe({
    next: (res:any) => {
      console.log(res);
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

}
