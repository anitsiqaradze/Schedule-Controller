import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { workerGuard } from './guards/worker.guard';
import { WorkerComponent } from './worker/worker/worker.component';
import { AdminComponent } from './admin/admin/admin.component';
import { adminGuard } from './guards/admin.guard';
import { LoginComponent } from './auth/login/login.component';
import { registerLocaleData } from '@angular/common';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { UsersTableComponent } from './admin/users-table/users-table.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule), // მოდული შეილება რამდენიმე რამეს აექსპორტებდეს ამიტომ არის საჭირო m.AuthModule თუმცა ამ შემთხვევაში მოდულები მხოლოდ მოდულს აექსპორტებს და ეს არაფერს აკეთებს ისე დავუწერე
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'worker',
    loadChildren: () =>
      import('./worker/worker.module').then((m) => m.WorkerModule),
  },

  {
    path: 'worker/worker',
    component: WorkerComponent,
    canActivate: [workerGuard],
  },
  { path: 'admin/admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  /*When a user navigates to the root of the application (e.g., http://example.com/), this route will redirect them to the 'auth/login' path, displaying the login page.*/
  //{ path: '', redirectTo: './auth/login', pathMatch: 'full' }, //default route
  //lazy loaded routes
  /* The AuthModule is loaded dynamically using an import statement when the user navigates to the /auth route. */
  {
    path: '',
    redirectTo: '/auth/login',

    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
