import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { s } from '@fullcalendar/core/internal-common';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
})
export class JobsComponent {
  newJobForm!: FormGroup;
  error_message: string = '';
  jobs: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private adminServide: AdminService
  ) {}
  createForm() {
    this.newJobForm = this.formBuilder.group({
      jobTitle: ['', [Validators.required]],
    });
  }

  fetchJobs(): void {
    this.userService.jobs().subscribe({
      next: (response) => {
        this.jobs = response;
        //  console.log(this.jobs);
      },
      error: (error) => {
        console.log('error fetching jobs ', error);
      },
    });
  }

  addJob(): void {
    if (this.newJobForm.valid) {
      const newJobTitle =
        this.newJobForm.value.jobTitle.charAt(0).toUpperCase() +
        this.newJobForm.value.jobTitle.slice(1);
      this.adminServide.addJob(newJobTitle).subscribe({
        next: () => {
          this.newJobForm.reset();
          this.error_message = '';
          this.fetchJobs();
        },
        error: (error) => {
          console.log('error adding new job ', error),
            (this.error_message =
              error.error || 'An unexpected error occurred');
        },
      });
    }
  }

  deleteJob(jobId: number): void {
    this.adminServide.deleteJob(jobId).subscribe({
      next: () => {
        // let job = this.jobs.find((index) => job.id == jobId);
        this.jobs = this.jobs.filter((job) => job.id !== jobId);
      },
      error: (error) => {
        console.log('error deletig job ', error);
      },
    });
  }

  ngOnInit() {
    this.fetchJobs();
    this.createForm();
  }
}
