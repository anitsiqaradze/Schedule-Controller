import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { options } from '@fullcalendar/core/preact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'https://localhost:44330/api/Admin/';
  constructor(private http: HttpClient) {}

  approveSchedule(scheduleId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}approve-schedule-request?scheduleId=${scheduleId}`,
      {} // empty body, since the scheduleId is passed in the URL
    );
  }

  deleteSchedule(scheduleId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete-schedule/${scheduleId}`);
  }
  changeUserRole(userId: number, newRoleId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}change-user-role`, {
      userId,
      newRoleId,
    });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete-user/${userId}`);
  }
  // deleteSchedule(scheduleId: number): Observable<any> {
  //   return this.http.delete(`${this.apiUrl}delete-schedule`, scheduleId);
  // }

  addJob(title: string): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.post(`${this.apiUrl}add-new-job`, { title }, { headers });
  }

  deleteJob(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete-job/${id}`);
  }
}
