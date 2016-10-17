import { Component, ViewChild, OnInit } from '@angular/core';

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';

import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogStyle } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';

import { LockedContentComponent } from './locked-content/locked-content.component';

@Component({

    moduleId: module.id,
    selector: 'locked-component-dialog',

    templateUrl: 'locked-component-dialog.component.html',
    styleUrls: ['locked-component-dialog.component.css'],
})
export class LockedComponentDialogComponent implements OnInit {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;

    // Initialisation
    ngOnInit() {

        this.setDialogStyles();
        this.setDialogCallbacks();
    }

    // Shows the dialog
    show() {

        // Set the content
        let dialogContent = new Ng2DynamicDialogContent();

        // Show our dialog
        dialogContent.title = 'Locking Dialogs Manually';

        dialogContent.button1 = 'Lock Me';
        dialogContent.button2 = 'Close Me';

        dialogContent.height = 410;
        dialogContent.width = 430;

        dialogContent.componentContent = LockedContentComponent;

        this.modalDialog.show(dialogContent);
    }

    //
    // Sets the style of the dialog
    //
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        // Background style - we don't want one
        dialogStyle.background = 'ng2-dynamic-dialog-samples-locked-component-background';
        dialogStyle.dialog = 'ng2-dynamic-dialog-samples-locked-component-dialog';
        dialogStyle.title = 'ng2-dynamic-dialog-samples-locked-component-title';

        dialogStyle.buttonClose.image = 'assets/close.png';
        dialogStyle.iconLocked.image = 'assets/locked-icon.gif';

        dialogStyle.button.general.idle = 'ng2-dynamic-dialog-samples-locked-component-button';
        dialogStyle.button.general.hover = 'ng2-dynamic-dialog-samples-locked-component-button:hover';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }

    //
    // Sets the callbacks for this dialog
    //
    private setDialogCallbacks() {

        // We're not setting any callbacks, just showing how an owner can be passed to a component callback
        let dialogCallbacks: Ng2DynamicDialogCallbacks = new Ng2DynamicDialogCallbacks();
        dialogCallbacks.owner = this;

        // Set the callbacks
        this.modalDialog.setCallbacks(dialogCallbacks);

    }
}
