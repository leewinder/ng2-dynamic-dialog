import { Component, ViewChild, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogStyle } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogBehaviour } from 'ng2-dynamic-dialog';

@Component({

    moduleId: module.id,
    selector: 'styled-with-html-dialog',

    templateUrl: 'styled-with-html-dialog.component.html',
    styleUrls: ['styled-with-html-dialog.component.css'],
})
export class StyledWithHtmlDialogComponent implements OnInit {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;

    private defaultHtmlContent: string = `<center><br>Dialog with a custom style specified using 'Ng2DynamicDialogStyle'.<br><br>

        A simple callback is also used for the buttons below to alter the contents on the fly.  This is
        provided using 'Ng2DynamicDialogCallbacks'.<br><br><br><br>

        The ability to close the dialog by clicking outside the dialog has also been disabled
        using 'Ng2DynamicDialogBehaviour'</center>`;

    private switchedToHtmlContent: string = `<center><br>Dynamic content presented simply by showing the
        dialog again with different content.<br><br>

        This content also uses a different button layout to specify the size and
        location of the buttons available.<br><br>

        This is all done with 'Ng2DynamicDialogStyle'`;

    // Constructor
    constructor(private _sanitizer: DomSanitizer) {

    }

    // Initialisation
    ngOnInit() {

        this.setDialogStyles();
        this.setDialogCallbacks();
        this.setDialogBehaviour();
    }

    // Shows the dialog
    show() {

        // Show the default content when we show
        this.showDefaultDialogContent();
    }

    //
    // Shows the default dialog content
    //
    private showDefaultDialogContent() {

        let dialogContent = new Ng2DynamicDialogContent();

        dialogContent.height = 300;
        dialogContent.width = 450;

        dialogContent.title = 'Custom Style Dialog';
        dialogContent.button3 = 'Show More Content';

        dialogContent.safeHtmlContent = this._sanitizer.bypassSecurityTrustHtml(this.defaultHtmlContent);

        this.modalDialog.show(dialogContent);
    }

    //
    // Shows the default dialog content
    //
    private showSwitchedDialogContent() {

        let dialogContent = new Ng2DynamicDialogContent();

        dialogContent.height = 230;
        dialogContent.width = 450;

        dialogContent.title = 'Custom Style Dialog';
        dialogContent.button2 = 'Cancel';

        dialogContent.safeHtmlContent = this._sanitizer.bypassSecurityTrustHtml(this.switchedToHtmlContent);

        this.modalDialog.show(dialogContent);
    }

    //
    // Sets the style of the dialog
    //
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        // Dialog style
        dialogStyle.dialogBorderColor = '#44086C';

        dialogStyle.dialogFontFamily = 'Architects Daughter, cursive';
        dialogStyle.dialogFontSize = '14';

        dialogStyle.dialogBorderRadius = 20;

        // Button style
        dialogStyle.buttonBackgroundColor = '#611F8E';
        dialogStyle.buttonBorderColor = '#44086C';
        dialogStyle.buttonHoverColor = dialogStyle.buttonBorderColor;

        dialogStyle.buttonBorderRadius = 10;

        dialogStyle.buttonFontFamily = dialogStyle.dialogFontFamily;
        dialogStyle.buttonFontSize = dialogStyle.dialogFontSize;

        dialogStyle.buttonFontColor = '#ffffff';

        // Title style
        dialogStyle.titleFontFamily = dialogStyle.dialogFontFamily;

        // Other buttons
        dialogStyle.closeButtonImage = 'assets/close.png';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }

    //
    // Sets the callbacks of the dialog
    //
    private setDialogCallbacks() {

        // Initialise the style of the dialog
        let dialogCallbacks = new Ng2DynamicDialogCallbacks();

        dialogCallbacks.onButton2Clicked = () => this.onButton2Selected();
        dialogCallbacks.onButton3Clicked = () => this.onButton3Selected();

        this.modalDialog.setCallbacks(dialogCallbacks);
    }

    //
    // Sets the behaviour of this dialog
    //
    private setDialogBehaviour() {

        // Initialise the behaviour of the dialog
        let dialogBehaviour = new Ng2DynamicDialogBehaviour();
        dialogBehaviour.exitOnOffDialogClick = false;

        this.modalDialog.setBehaviour(dialogBehaviour);
    }

    //
    // Called when the button 2 is called
    //
    private onButton2Selected() {
        // Go back to the default content
        this.showDefaultDialogContent();
    }

    //
    // Called when the button 3 is called
    //
    private onButton3Selected() {
        // Go to the switched content
        this.showSwitchedDialogContent();
    }
}
