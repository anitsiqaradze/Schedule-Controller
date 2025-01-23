import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkerService {
  private apiUrl = 'https://localhost:44330/api/Worker/';

  constructor(private http: HttpClient) {}

  ScheduleRequest(schedule: {
    startTime: string;
    endTime: string;
    userId: number;
  }): Observable<any> {
    //const headers = new HttpHeaders({ 'content-Type': 'application/json' });
    return this.http.post(`${this.apiUrl}add-schedule-request`, schedule);
  }
}
