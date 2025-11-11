import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app.config';
import { AppComponent } from './app.component';

// TODOS:
 //* Check why when i create our company section for any reasion the phrase does not appear

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
