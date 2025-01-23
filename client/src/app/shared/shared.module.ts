import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addDays, startOfWeek, endOfWeek, format } from 'date-fns';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, FullCalendarModule, FormsModule],
  exports: [DashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this line
})
export class SharedModule {}
