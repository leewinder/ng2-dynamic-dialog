/* tslint:disable:no-unused-variable */

import { Component } from '@angular/core';

import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbackResult } from 'ng2-dynamic-dialog';

@Component({

    moduleId: module.id,
    selector: 'locked-content',

    templateUrl: 'locked-content.component.html',
    styleUrls: ['locked-content.component.css'],
})
export class LockedContentComponent {

    // Properties from the dialog
    private email: string = null;
    private password: string = null;

    private secondsToUnlock: number = 0;
    private setIntervalHandle: any = null;

    private enableEmailEntry: boolean = true;
    private enablePasswordEntry: boolean = true;

    private dialogComponent: Ng2DynamicDialogComponent;

    //
    // Returns the callbacks to control this component
    //
    private getDialogComponentCallbacks(): Ng2DynamicDialogCallbacks {

        // Set up the callbacks on this dialog
        let componentCallbacks = new Ng2DynamicDialogCallbacks();

        componentCallbacks.onButton1Clicked = () => this.onLockSelected();
        componentCallbacks.onButton2Clicked = (nextOwner: any) => this.onCloseSelected(nextOwner);

        componentCallbacks.onContentLocking = () => this.onContentLocking();
        componentCallbacks.onContentLocked = () => this.onContentLocked();

        componentCallbacks.onContentUnlocked = () => this.onContentUnlocked();

        return componentCallbacks;

    }

    //
    // Stores the dialog component so we can control it
    //
    private setDialogComponent(dialogComponent: Ng2DynamicDialogComponent) {
        this.dialogComponent = dialogComponent;
    }

    //
    // Called when the log in button is pressed
    //
    private onLockSelected(): Ng2DynamicDialogCallbackResult {

        // Lock it and start the timer
        this.dialogComponent.lock(false);
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the user decide to sign up
    //
    private onCloseSelected(nextOwner: any): Ng2DynamicDialogCallbackResult {

        this.dialogComponent.close();
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when we start locking
    //
    private onContentLocking(): Ng2DynamicDialogCallbackResult {

        // Disable the entry forms
        this.enableEmailEntry = false;
        this.enablePasswordEntry = false;

        // Done
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the dialog is fully locked
    //
    private onContentLocked(): Ng2DynamicDialogCallbackResult {

        this.secondsToUnlock = 3;
        this.setIntervalHandle = setInterval(() => {
            this.secondsToUnlock -= 1;
            if (this.secondsToUnlock === 0) {

                // Done
                this.dialogComponent.unlock(false);
                clearInterval(this.setIntervalHandle);
            }
        }, 1000);

        // Done
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when we we're unlocked
    //
    private onContentUnlocked(): Ng2DynamicDialogCallbackResult {

        // Enable the entry forms
        this.enableEmailEntry = true;
        this.enablePasswordEntry = true;

        // Done
        return Ng2DynamicDialogCallbackResult.None;
    }
}
