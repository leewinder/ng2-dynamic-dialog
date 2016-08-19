import { NgModule }      from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './components/app/app.component';
import { MainPageComponent }  from './components/main-page/main-page.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [AppComponent, MainPageComponent],
    bootstrap: [AppComponent],
    providers: [],
})
export class AppModule { }
