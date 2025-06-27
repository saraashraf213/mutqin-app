import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RecordComponent } from './pages/record/record.component';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([
      { path: 'record', component: RecordComponent },
      { path: '', redirectTo: 'record', pathMatch: 'full' }
    ]),
    provideHttpClient()
  ]
};
