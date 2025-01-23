import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginFrom!: FormGroup;
  error_message: string = '';

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  createForm() {
    this.loginFrom = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  Login() {
    if (this.loginFrom.valid) {
      const userData = this.loginFrom.value;
      this.userService.loginUser(userData).subscribe({
        next: (response: any) => {
          const jwtToken = response;
          //localStorage.setItem('token', jwtToken);
          console.log(response);

          const decoded = this.userService.decodeToken(jwtToken);
          const role =
            decoded?.[
              'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
            ];

          if (role === '1') {
            this.router.navigate(['./admin/admin']);
          } else if (role === '2') {
            this.router.navigate(['./worker/worker']);
          } else {
            // alert('login failed check your credentials');
            this.error_message = 'login failed check your credentials';
          }
          console.log('login as ', role);
        },
        error: (error) => {
          if (error.status === 404) {
            this.error_message = 'user does not doesnt exist';
          } else if (error.status === 500) {
            this.error_message = 'wrong password';
          } else console.log('login failed ', error);
        },
      });
    }
  }

  goToRegister() {
    this.router.navigate(['./auth/register']);
  }

  ngOnInit() {
    /*
     is logged in observable s gadavcem false rom
     winaze tu logoutis gareshe gavtishe mashin damaxsovrebuli token washalos
     da log out button agar gamoitanos login componentis viewstan ertad
    */
    this.checkLogin();
    this.createForm();
  }

  checkLogin() {
    if (this.userService.checkToken()) {
      this.userService.isLoggedInSubject.next(false);
      localStorage.removeItem('token');
    }
  }
}
