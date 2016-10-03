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
        dialogStyle.background['opacity'] = 0;

        // Dialog style
        dialogStyle.dialog['font-family'] = 'Raleway';
        dialogStyle.dialog['font-size.px'] = 14;

        (<any>dialogStyle.dialog)['line-height.%'] = 150;

        dialogStyle.dialog['color'] = '#999999';

        dialogStyle.dialog['border-radius.px'] = 0;
        dialogStyle.dialog['border-width.px'] = 0;

        (<any>dialogStyle.dialog)['box-shadow'] = '0px 0px 18px 3px rgba(120,120,120,1)';

        // Button style
        dialogStyle.button.general.idle['background-color'] = '#FFFFFF';
        dialogStyle.button.general.idle['color'] = '#000000';

        (<any>dialogStyle.button.general.idle)['font-weight'] = 'bold';

        dialogStyle.button.general.idle['border-width.px'] = 0;
        dialogStyle.button.general.idle['border-radius.px'] = 0;

        dialogStyle.button.general.idle['font-family'] = dialogStyle.dialog['font-family'];
        dialogStyle.button.general.idle['font-size.px'] = dialogStyle.dialog['font-size.px'] = 14;

        dialogStyle.button.general.hover['background-color'] = '#DDDDDD';

        // Title style
        dialogStyle.title['font-family'] = dialogStyle.dialog['font-family'];
        (<any>dialogStyle.title)['font-weight'] = 'bold';
        dialogStyle.title['font-size.px'] = 20;

        (<any>dialogStyle.title)['text-align'] = 'left';
        (<any>dialogStyle.title)['top.px'] = -5;

        // Cancel button styles
        dialogStyle.cancelButton['source'] = 'assets/close.png';
        dialogStyle.lockedIcon['source'] = 'assets/locked-icon.gif';

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
