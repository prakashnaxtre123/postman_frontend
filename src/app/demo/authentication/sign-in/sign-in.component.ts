// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {
  loginForm: FormGroup
  constructor(private fb:FormBuilder, private authService:AuthService,private router:Router, private message:NzMessageService){
    this.loginForm = this.fb.group({
      email:['',[Validators.required]],
      password:['',[Validators.required]]
    })
  }
  submitLoginForm(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched()
    }else{
      const obj = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      }
      this.authService.login(obj).subscribe({
        next:(res:any) => {
          console.log(res)
          if(res.success == true){
            localStorage.setItem("postman_user_details", JSON.stringify(res.data))
            this.router.navigate(['requests'])
          }
        },
        error:(err) => {
          //console.log(err.error.message);
          this.message.error(err.error.message)
        }
      })
    }
  }
}
