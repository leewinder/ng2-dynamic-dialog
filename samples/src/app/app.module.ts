import { NgModule }      from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './components/app/app.component';
import { MainPageComponent }  from './components/main-page/main-page.component';

import { CustomComponentDialogComponent } from './components/dialogs/custom-component-dialog/custom-component-dialog.component';
import { DefaultWithHtmlDialogComponent } from './components/dialogs/default-with-html-dialog/default-with-html-dialog.component';
import { StyledWithHtmlDialogComponent } from './components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component';
import { LockedComponentDialogComponent } from './components/dialogs/locked-component-dialog/locked-component-dialog.component';

import { LogInComponent } from './components/dialogs/custom-component-dialog/content/login/login.component';
import { SignUpComponent } from './components/dialogs/custom-component-dialog/content/signup/signup.component';
import { LockedContentComponent } from './components/dialogs/locked-component-dialog/locked-content/locked-content.component';

import { UserDetailsService } from './components/dialogs/custom-component-dialog/content/user-details/user-details.service';

import { Ng2DynamicDialogModule }  from 'ng2-dynamic-dialog';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        Ng2DynamicDialogModule,
    ],

    declarations: [
        AppComponent,
        MainPageComponent,

        CustomComponentDialogComponent,
        DefaultWithHtmlDialogComponent,
        StyledWithHtmlDialogComponent,
        LockedComponentDialogComponent,

        SignUpComponent,
        LogInComponent,
        LockedContentComponent,
    ],

    bootstrap: [
        AppComponent,
    ],

    providers: [
        UserDetailsService,
    ],

    entryComponents: [
        SignUpComponent,
        LogInComponent,
        LockedContentComponent,
    ],
})
export class AppModule { }
