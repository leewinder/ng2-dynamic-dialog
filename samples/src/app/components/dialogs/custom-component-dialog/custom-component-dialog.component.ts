import { Component, ViewChild, OnInit } from '@angular/core';

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';

import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogStyle } from 'ng2-dynamic-dialog';

import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbackResult } from 'ng2-dynamic-dialog';

import { UserDetailsService } from './content/user-details/user-details.service';

import { LogInComponent } from './content/login/login.component';
import { SignUpComponent } from './content/signup/signup.component';

@Component({

    moduleId: module.id,
    selector: 'custom-component-dialog',

    templateUrl: 'custom-component-dialog.component.html',
    styleUrls: ['custom-component-dialog.component.css'],
})
export class CustomComponentDialogComponent implements OnInit {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;

    // Constructor
    constructor(private userDetails: UserDetailsService) {
    }

    // Initialisation
    ngOnInit() {

        this.setDialogStyles();
        this.setDialogCallbacks();
    }

    // Shows the sign in dialog
    requestUserSignIn() {

        // Clear our user details as we're starting again
        this.userDetails.clear();

        // Set the content
        let dialogContent = new Ng2DynamicDialogContent();

        // Show our dialog
        dialogContent.title = 'Log In or Sign Up';

        // We need to use both buttons for this dialog
        dialogContent.button1 = 'Log In';
        dialogContent.button2 = 'Sign Up';

        // Set the dimensions to adequatly cover the components render area
        dialogContent.height = 320;
        dialogContent.width = 300;

        // Pass through the type of component you wish to be rendered inside the dialog
        dialogContent.componentContent = LogInComponent;

        this.modalDialog.show(dialogContent);
    }

    //
    // Called when the user selects to sign up
    //
    private onSignUpSelected() {

        // Set the content
        let dialogContent = new Ng2DynamicDialogContent();

        // Show our dialog
        dialogContent.title = 'Sign Up for an Account';
        dialogContent.button3 = 'Sign Up';

        dialogContent.height = 670;
        dialogContent.width = 430;

        dialogContent.componentContent = SignUpComponent;

        this.modalDialog.show(dialogContent);
    }

    //
    // Sets the style of the dialog
    //
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        dialogStyle.dialog = 'ng2-dynamic-dialog-samples-custom-component-dialog';
        dialogStyle.title = 'ng2-dynamic-dialog-samples-custom-component-title';

        dialogStyle.buttonClose.image = 'assets/close.png';

        dialogStyle.button.general.idle = 'ng2-dynamic-dialog-samples-custom-component-button';
        dialogStyle.button.general.hover = 'ng2-dynamic-dialog-samples-custom-component-button:hover';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }

    //
    // Sets the callbacks of the dialog
    //
    private setDialogCallbacks() {

        // Initialise the style of the dialog
        let dialogCallbacks = new Ng2DynamicDialogCallbacks();

        dialogCallbacks.onButton1Clicked = () => this.onLogInSelected();
        dialogCallbacks.onButton2Clicked = () => this.onSignInNeededSelected();
        dialogCallbacks.onButton3Clicked = () => this.onSignInSelcted();

        this.modalDialog.setCallbacks(dialogCallbacks);
    }

    //
    // Uses the user names email address to guess the users name
    //
    private guessUsernameFromEmail() {

        if (this.userDetails.email !== null) {

            // Split up the mail, assume a '.' in the user name is their first and last name
            let emailSplit: string[] = this.userDetails.email.split('@');
            if (emailSplit.length === 2) {
                let usernameSplit: string[] = emailSplit[0].split('.');
                if (usernameSplit.length === 2) {
                    this.userDetails.firstName = usernameSplit[0];
                    this.userDetails.lastName = usernameSplit[1];

                    // Uppercase the first letters
                    this.userDetails.firstName = this.userDetails.firstName[0].toUpperCase() + this.userDetails.firstName.substring(1);
                    this.userDetails.lastName = this.userDetails.lastName[0].toUpperCase() + this.userDetails.lastName.substring(1);
                }
            }

        }
    }

    //
    // Called when the log in button is pressed
    //
    private onLogInSelected(): Ng2DynamicDialogCallbackResult {

        this.modalDialog.close();
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the user decide to sign up
    //
    private onSignInNeededSelected(): Ng2DynamicDialogCallbackResult {

        // Before we go into the sign up dialog, can we help out the user and guess their name?
        this.guessUsernameFromEmail();

        // Get the login component so we can get the information the user has already inputed
        this.onSignUpSelected();

        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the needs to sign up
    //
    private onSignInSelcted(): Ng2DynamicDialogCallbackResult {

        this.modalDialog.close();
        return Ng2DynamicDialogCallbackResult.None;
    }
}
