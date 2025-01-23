import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerComponent } from './worker/worker.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WorkerComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
})
export class WorkerModule {}
