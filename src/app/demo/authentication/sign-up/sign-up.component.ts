// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from 'src/app/services/auth.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent {
  registerForm: FormGroup;
  constructor(private fb:FormBuilder, private authService: AuthService,private router:Router, private message:NzMessageService){
    this.registerForm = this.fb.group({
      name:['',[Validators.required]],
      email:['',[Validators.required]],
      password:['',[Validators.required]],
    })
  }
  submitRegiser(){
   if(this.registerForm.invalid){
    this.message.error("Plese fii all the fields")
    this.registerForm.markAllAsTouched()
   }else{
    this.authService.register(this.registerForm.value).subscribe({
      next:(res:any) => {
        this.message.success(res.message);
        this.router.navigate(['auth/signin'])
      },
      error: (err) => {
        this.message.error(err.error.message)
      }
    })
   }
  }
}
