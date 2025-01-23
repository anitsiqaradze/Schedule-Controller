import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import { Job } from 'src/app/interfaces/job';
import { scheduled } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}

  currentWeek: Date[] = []; // Array to store dates for the current week
  currentDate: Date = new Date(); // Current date reference
  weekOffset: number = 0; // Offset to calculate weeks
  monthYear: string = ''; // Display the month and year
  jobs: Job[] = []; // Placeholder for jobs array
  Schedules: any[] = [];

  // cvladi romelic amowmebs adminia tu ara shesuli
  // romwashlis funqciam workeristvis ar imushaos
  loggedInAsAdmin: boolean;

  ngOnInit(): void {
    this.isAdmin();
    this.fetchJobs();
    console.log('fetch dashboard');
    this.fetchDashboard();
    console.log('generate weeks');
    this.generateWeek();
    console.log(this.Schedules);
  }

  generateWeek(): void {
    console.log('current date reference', this.currentDate);
    // clear previous week
    this.currentWeek = [];
    // start of week is current date for now
    const startOfWeek = new Date(this.currentDate);

    // to get date of this week's day sunday
    // first substract this days number to current day
    // for example sunday is zero and etc then +  multiply of offset  and 7 so we get month last day
    // of week we move to week we want
    // thats how we move between weeks and get startOfWeek date     //

    startOfWeek.setDate(
      this.currentDate.getDate() -
        this.currentDate.getDay() +
        this.weekOffset * 7
    );

    // Set the month and year display
    this.monthYear = `${startOfWeek.toLocaleString('default', {
      month: 'long',
    })} ${startOfWeek.getFullYear()}`;

    // Generate dates for the current week
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      this.currentWeek.push(day);
    }
  }

  prevWeek(): void {
    this.weekOffset--;
    this.generateWeek();
    this.computeWeekSchedules();
  }

  nextWeek(): void {
    this.weekOffset++;
    this.generateWeek();
    this.computeWeekSchedules();
  }

  getShiftType(startTime: string): 'morning' | 'evening' {
    const hour = new Date(startTime).getHours();

    return hour >= 8 && hour < 16 ? 'morning' : 'evening';
  }

  fetchJobs(): void {
    this.userService.getJobOptions().subscribe(
      (res) => {
        console.log(res);
        res.forEach((job) => this.jobs.push(job));
      },
      (error) => console.log('error fetching job options', error)
    );
  }

  fetchDashboard(): void {
    this.userService.dashboard().subscribe(
      (res: any[]) => {
        console.log('response', res);
        this.Schedules = res
          .filter((item) => item.isApproved)
          .map((item) => {
            const shiftType = this.getShiftType(item.startTime);
            return { ...item, shiftType };
          });
        console.log('approved scheudles with shiftType', this.Schedules);
        //this.getSchedule();
        this.computeWeekSchedules();
      },
      (error) => console.log(error)
    );
  }

  weekSchedules: { [jobId: number]: { [date: string]: any } } = {};

  computeWeekSchedules(): void {
    this.weekSchedules = {};

    this.jobs.forEach((job) => {
      this.weekSchedules[job.id] = {};

      this.currentWeek.forEach((date) => {
        const dateString = date.toISOString().slice(0, 10);
        let scheduleDate = '';
        //console.log(dateString);
        const schedule = this.Schedules.find(
          (schedule) =>
            schedule.jobId === job.id &&
            new Date(schedule.startTime).toISOString().slice(0, 10) ==
              dateString
        );
        if (schedule) {
          scheduleDate = new Date(schedule.startTime)
            .toISOString()
            .slice(0, 10);
          this.weekSchedules[job.id][scheduleDate] = schedule;
        }
      });
    });

    console.log('week schedules ', this.weekSchedules); // Debugging output
  }

  deleteSchedule(scheduleId: number): void {
    if (this.loggedInAsAdmin) {
      this.adminService.deleteSchedule(scheduleId).subscribe({
        next: () => {
          // Remove the schedule from the Schedules array
          this.Schedules = this.Schedules.filter((s) => s.id !== scheduleId);
          //this.fetchDashboard();
          // Recompute weekSchedules after deletion
          this.computeWeekSchedules();
          console.log('schedule deleted successfully');
        },
        error: (error) => console.log('error deleting schedule', error),
      });
    } else return;
  }

  isAdmin(): void {
    const jwtToken = localStorage.getItem('token');
    const decoded = this.userService.decodeToken(jwtToken);
    const role =
      decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    this.loggedInAsAdmin = role === '1' ? true : false;
  }
}

/*
//*1. Start of the Week Calculation
 Why do we calculate the start of the week?
 In most calendar systems, a week is a set of 7 consecutive days starting from a specific day (commonly Sunday or Monday). In this case, we want to calculate which date is the start of the current week, so we can display the whole week with the correct day labels.
 How is the start of the week calculated?
 The currentDate (the date when the user opens the calendar) is used to calculate the start of the week. We subtract the day of the week (currentDate.getDay()) from the current date to get the Sunday of the current week (this assumes that weeks start on Sunday).

typescript
Copy code
const startOfWeek = new Date(this.currentDate);
startOfWeek.setDate(
  this.currentDate.getDate() - this.currentDate.getDay() + this.weekOffset * 7
);
Here's a breakdown:

currentDate.getDay() returns the day of the week as a number (Sunday = 0, Monday = 1, ..., Saturday = 6).
this.currentDate.getDate() gives the day of the month.
By subtracting getDay() from the getDate(), we set the date back to Sunday of the current week.
this.weekOffset * 7 adds or subtracts weeks from the current week. For example, if weekOffset is 1, it will move to the next week; if weekOffset is -1, it will move to the previous week.


1. this.currentDate is the reference point (today’s date).
2. this.currentDate.getDay() gives the index of the day in the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday).
3. Subtracting this.currentDate.getDay() sets the date back to the Sunday of the current week.
4. Adding this.weekOffset * 7 shifts the week forward or backward based on the offset (e.g., -1 for the previous week, +1 for the next week).

*/
