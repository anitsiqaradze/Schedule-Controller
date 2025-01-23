import { Component, OnInit } from '@angular/core';
import { scheduled } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  constructor(
    private userService: UserService,
    private adminService: AdminService
  ) {}
  Schedules: any[] = [];
  isModalVisible = false;

  showModal() {
    this.isModalVisible = true;
  }

  hideModal() {
    this.isModalVisible = false;
  }

  fetchDashboard(): void {
    this.userService.dashboard().subscribe(
      (res: any[]) => {
        console.log(res);
        this.Schedules = res
          .filter((item) => !item.isApproved)
          .map((item) => {
            const shiftType = this.getShiftType(item.startTime);
            return { ...item, shiftType };
          });

        console.log(this.Schedules);
      },
      (error) => console.log(error)
    );
  }
  getShiftType(startTime: string): 'morning' | 'evening' {
    const hour = new Date(startTime).getHours();
    return hour >= 8 && hour < 16 ? 'morning' : 'evening';
  }

  approveScheduleRequest(scheduleId: number): void {
    this.adminService.approveSchedule(scheduleId).subscribe({
      next: () => {
        console.log('schedule approved');
        this.Schedules = this.Schedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
      },
      error: (error) => console.log('error approving schedule request ', error),
    });
  }

  declineScheduleRequest(scheduleId: number): void {
    this.adminService.deleteSchedule(scheduleId).subscribe({
      next: () => {
        // Filter out the declined schedule
        console.log('schedule delclined');
        this.Schedules = this.Schedules.filter(
          (schedule) => schedule.id !== scheduleId
        );
        console.log('Schedule declined and removed from the list.');
      },
      error: (error) => {
        console.error('Error declining schedule:', error);
      },
    });
  }

  ngOnInit() {
    console.log('admin initialized');
    this.fetchDashboard();
  }
}
