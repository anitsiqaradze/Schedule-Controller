import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Job } from 'src/app/interfaces/job';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: false,
})
export class RegisterComponent {
  registrationForm!: FormGroup;
  jobOptions: Job[] = [];
  passwordMismatchErr = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  createForm(): void {
    this.registrationForm = this.fb.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        jobId: [null, Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  fetchJobOptions(): void {
    this.userService.getJobOptions().subscribe({
      next: (response) => {
        console.log('job options', response);
        this.jobOptions = response;
      },
      error: (error) => {
        console.log('error fetching job options ', error);
      },
    });
  }

  Register(): void {
    if (this.registrationForm.valid) {
      const { confirmPassword, jobId, ...userData } =
        this.registrationForm.value;

      const job = jobId as Job;

      this.userService.registerUser({ ...userData, jobId: job.id }).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          this.router.navigate(['./auth/login']);
          this.registrationForm.reset();
          this.passwordMismatchErr = '';
        },
        error: (error) => {
          // if (error.status === 500) {
          //   this.error_message = 'username is already in use';
          // }
          console.error('Registration failed:', error);
        },
      });
    } else {
      console.error('Form is invalid:', this.registrationForm.errors);
      if (this.registrationForm.errors?.['passwordMismatch']) {
        this.passwordMismatchErr = 'Passwords do not match';
        console.log(this.passwordMismatchErr);
      }
    }
  }

  goToLogin() {
    this.router.navigate(['./auth/login']);
  }

  ngOnInit() {
    this.fetchJobOptions();
    this.createForm();
  }

  // custom validator for confirming password

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (confirmPassword.length > 1 && password !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
