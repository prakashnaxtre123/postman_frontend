import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataSharingService } from 'src/app/services/data-sharing.service';
import { HttpRequestService } from 'src/app/services/http-request.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';

interface Header {
  key: string;
  value: string;
}

interface FormDataItem {
  key: string;
  type: 'text' | 'file';
  value: string | File;
}
@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxJsonViewerModule,NzButtonModule,NzIconModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export default class RequestsComponent implements OnChanges {
  method = 'GET';
  url = '';
  headers: Header[] = [];
  requestBody = '';
  response: any = null;
  responseStatus = '';
  bodyType: 'raw' | 'form-data' = 'raw';
  formData: FormDataItem[] = [];
  titleEdit = false;

  teamEditFlag = true
  workspaceEditFlag = true

  @Input() curl: any
  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private httpRequest: HttpRequestService,
    private message:NzMessageService ,
    private dataShare:DataSharingService,
    private router: Router) {}

  ngOnInit() {
    if(this.router.url == '/requests'){
      this.dataShare.updateMessage2(null)
    }
    this.addHeader();
    this.addFormDataItem();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.titleEdit = false
    this.parseCurl(this.curl.content)
  }

  addHeader() {
    this.headers.push({ key: '', value: '' });
  }

  removeHeader(index: number) {
    this.headers.splice(index, 1);
  }

  addFormDataItem() {
    this.formData.push({ key: '', type: 'text', value: '' });
  }

  removeFormDataItem(index: number) {
    this.formData.splice(index, 1);
  }

  handleFileInput(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.formData[index].value = file;
    }
  }

  sendRequest() {
    const options: any = {
      headers: this.buildHeaders(),
      observe: 'response'
    };

    let body: any = null;

    if (this.method !== 'GET' && this.method !== 'HEAD' && this.method !== 'OPTIONS') {
      if (this.bodyType === 'raw' && this.requestBody) {
        try {
          body = JSON.parse(this.requestBody);
        } catch (e) {
          alert('Invalid JSON in request body');
          return;
        }
      } else if (this.bodyType === 'form-data') {
        const formData = new FormData();
        this.formData.forEach(item => {
          if (item.key) {
            formData.append(item.key, item.value);
          }
        });
        body = formData;

        options.headers = options.headers.delete('Content-Type');
      }
    }

    this.http.request(this.method.toLowerCase(), this.url, {
      ...options,
      body
    }).subscribe({
      next: (response: any) => {
        this.responseStatus = `${response.status} ${response.statusText}`;
        this.response = response.body;

      },
      error: (error) => {

        this.responseStatus = `${error.status} ${error.statusText}`;
        this.response = error.error;

      }
    });
  }

  generateCurl() {
    const method = this.method.toUpperCase();
    const url = this.url;
    const headersArray = this.headers.filter(h => h.key && h.value);

    let curl = `curl -X ${method} "${url}"`;

    // Add headers
    headersArray.forEach(header => {
      curl += ` \\\n  -H "${header.key}: ${header.value}"`;
    });

    // Add body if applicable
    if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
      if (this.bodyType === 'raw' && this.requestBody) {
        curl += ` \\\n  -d '${this.requestBody.replace(/'/g, `'"'"'`)}'`;
      } else if (this.bodyType === 'form-data') {
        this.formData.forEach(item => {
          if (item.key) {
            if (item.type === 'file' && item.value instanceof File) {
              curl += ` \\\n  -F "${item.key}=@${(item.value as File).name}"`;
            } else {
              curl += ` \\\n  -F "${item.key}=${item.value}"`;
            }
          }
        });
      }
    }
    return curl;
    //console.log('Generated CURL Command:\n' + curl);
  }

  parseCurl(curl: string) {
    this.response = null
    // Normalize curl string
    curl = curl.replace(/\\\n/g, ' ').replace(/\s+/g, ' ').trim();

    const methodMatch = curl.match(/-X (\w+)/);
    const urlMatch = curl.match(/"(https?:\/\/[^"]+)"/);
    const headerMatches = [...curl.matchAll(/-H\s+"([^:]+):\s*(.*?)"/g)];
    const dataMatch = curl.match(/-d\s+'([^']*)'/) || curl.match(/--data(?:-raw|-binary)?\s+'([^']*)'/);
    const formDataMatches = [...curl.matchAll(/-F\s+"([^=]+)=@?([^"]+)"/g)];

    const method = methodMatch ? methodMatch[1] : 'GET';
    const url = urlMatch ? urlMatch[1] : '';
    const headers = headerMatches.map(match => ({
      key: match[1],
      value: match[2]
    }));

    let requestBody = '';
    let bodyType: 'raw' | 'form-data' = 'raw';
    let formData: FormDataItem[] = [];

    if (dataMatch) {
      requestBody = dataMatch[1];
      bodyType = 'raw';
    } else if (formDataMatches.length > 0) {
      bodyType = 'form-data';
      formData = formDataMatches.map(match => ({
        key: match[1],
        type: match[2].startsWith('@') ? 'file' : 'text',
        value: match[2]
      }));
    }

    // Assign to component state
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.bodyType = bodyType;
    this.requestBody = requestBody;
    this.formData = formData.length ? formData : [{ key: '', type: 'text', value: '' }];
  }




  private buildHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    this.headers.forEach(header => {
      if (header.key && header.value) {
        headers = headers.append(header.key, header.value);
      }
    });
    return headers;
  }

  saveDocument(){
    this.titleEdit = false;
    let content = this.generateCurl();
    let title = this.curl.title;
    //let workspcaeId = this.curl.workspace
    let obj = {content, title};
    this.httpRequest.updateDocument(this.curl._id,obj).subscribe({
      next:(res:any) => {
        this.message.success(res.message)
        this.dataShare.updateMessage1("update")
      },
      error:(err) => {
        this.message.error(err.error.message)
      }
    })
  }

  changeEditFlag(){
    this.titleEdit = true
  }


  editTeam() {
   this.teamEditFlag = false;
  }

  saveTeam() {
    this.teamEditFlag = true;
  }

  deleteTeam() {
    console.log('Delete Team clicked');
  }

  editWorkspace() {
    this.workspaceEditFlag = false
  }

  saveWorkspace() {
    this.workspaceEditFlag = true
  }

  deleteWorkspace() {
    console.log('Delete Workspace clicked');
  }

}
