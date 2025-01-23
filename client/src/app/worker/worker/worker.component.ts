import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { WorkerService } from 'src/app/services/worker.service';

@Component({
  selector: 'app-worker',
  templateUrl: './worker.component.html',
  styleUrls: ['./worker.component.css'],
})
export class WorkerComponent implements OnInit {
  scheduleForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private workerService: WorkerService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.scheduleForm = this.formBuilder.group({
      shiftType: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  sendShiftRequest(): void {
    if (!this.scheduleForm.valid) {
      // console.log('schedule request form is invalid');
      // console.log(this.scheduleForm.value);
      return;
    }

    // Get the token and decode it
    const token = localStorage.getItem('token');
    const decodedToken = this.userService.decodeToken(token);
    const userId =
      decodedToken?.[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ];

    if (!userId) {
      console.log('User ID not found in token');
      return;
    }

    // Get form values
    const { shiftType, date } = this.scheduleForm.value;

    // Set start and end times based on shift type
    const startTime =
      shiftType === 'Morning'
        ? `${date}T08:00:00.000Z`
        : `${date}T16:00:00.000Z`;
    const endTime =
      shiftType === 'Evening'
        ? `${date}T22:00:00.000Z`
        : `${date}T16:00:00.000Z`;

    // Send the request
    this.workerService

      .ScheduleRequest({ startTime, endTime, userId })
      .subscribe({
        next: (response) =>
          //console.log('Schedule requested successfully', response),
          this.scheduleForm.reset(),
        error: (error) =>
          console.error('Error sending schedule request', error),
      });
  }
}
