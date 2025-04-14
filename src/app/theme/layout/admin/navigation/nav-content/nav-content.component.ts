// angular import
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Location, LocationStrategy } from '@angular/common';

// project import
import { environment } from 'src/environments/environment';
import { NavigationItem, NavigationItems } from '../navigation';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-nav-content',
  templateUrl: './nav-content.component.html',
  styleUrls: ['./nav-content.component.scss']
})
export class NavContentComponent implements OnInit {
  // version
  title = 'Demo application for version numbering';
  currentApplicationVersion = environment.appVersion;

  // public pops
  navigations!: NavigationItem[];
  wrapperWidth!: number;
  windowWidth: number;

  @Output() NavMobCollapse = new EventEmitter();
  // constructor
  constructor(
    private location: Location,
    private locationStrategy: LocationStrategy,
    private httpRequest: HttpRequestService,
    private dataShare: DataSharingService
  ) {
    this.windowWidth = window.innerWidth;
    //this.navigations = NavigationItems;
  }

  // life cycle event
  ngOnInit() {
    this.getAllTeams();
    this.dataShare.message$.subscribe((msg) => {
      if(msg == 'update'){
        this.getAllTeams()
      }
    })
    if (this.windowWidth < 992) {
      document.querySelector('.pcoded-navbar')?.classList.add('menupos-static');
    }
  }

  // public method

  navMob() {
    if (this.windowWidth < 992 && document.querySelector('app-navigation.pcoded-navbar')?.classList.contains('mob-open')) {
      this.NavMobCollapse.emit();
    }
  }

  fireOutClick() {
    let current_url = this.location.path();
    const baseHref = this.locationStrategy.getBaseHref();
    if (baseHref) {
      current_url = baseHref + this.location.path();
    }
    const link = "a.nav-link[ href='" + current_url + "' ]";
    const ele = document.querySelector(link);
    if (ele !== null && ele !== undefined) {
      const parent = ele.parentElement;
      const up_parent = parent?.parentElement?.parentElement;
      const last_parent = up_parent?.parentElement;
      if (parent?.classList.contains('pcoded-hasmenu')) {
        parent.classList.add('pcoded-trigger');
        parent.classList.add('active');
      } else if (up_parent?.classList.contains('pcoded-hasmenu')) {
        up_parent.classList.add('pcoded-trigger');
        up_parent.classList.add('active');
      } else if (last_parent?.classList.contains('pcoded-hasmenu')) {
        last_parent.classList.add('pcoded-trigger');
        last_parent.classList.add('active');
      }
    }
  }

   getAllTeams(){
    this.httpRequest.getTeams().subscribe({
      next:(res:any) => {
          let data = res.data.map((item:any,index:number) => {
            return{
              id: item._id,
              title: item.name,
              type: 'item',
              url: `/teams/${item._id}`,
              icon: 'feather icon-users'
            }
          })

          this.navigations =[
          {
            id: 'Teams',
            title: 'Teams',
            type: 'group',
            icon: 'icon-group',
            children: data
          }]
          console.log(data)
      },
      error:(err) => {

      }
    })
   }
}


/*
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/requests',
        icon: 'feather icon-home'
      }
    ]
  }, */
