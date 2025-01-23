import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { UsersTableComponent } from './users-table/users-table.component';
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { adminGuard } from '../guards/admin.guard';
import { JobsComponent } from './jobs/jobs.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AdminComponent, UsersTableComponent, JobsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    RouterModule.forChild([
      {
        path: '',
        component: AdminComponent,
        children: [
          // { path: 'dashboard', component: DashboardComponent },

          { path: 'admin/users-table', component: UsersTableComponent },
          { path: 'admin/jobs', component: JobsComponent },
        ],
      },
    ]),
  ],
})
export class AdminModule {}
