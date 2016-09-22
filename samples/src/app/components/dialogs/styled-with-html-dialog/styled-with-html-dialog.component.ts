import { Component, ViewChild, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogStyle } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogBehaviour } from 'ng2-dynamic-dialog';

import { Ng2DynamicDialogCallbackResult } from 'ng2-dynamic-dialog';

@Component({

    moduleId: module.id,
    selector: 'styled-with-html-dialog',

    templateUrl: 'styled-with-html-dialog.component.html',
    styleUrls: ['styled-with-html-dialog.component.css'],
})
export class StyledWithHtmlDialogComponent implements OnInit {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;

    private defaultHtmlContent: string = `<br>Material-like dialog with a highly customised style constructed using
        'Ng2DynamicDialogStyle'.<br><br>

        Callbacks are also used for the all three buttons to alter the contents on the fly.  This is
        provided by specifying dialog-level callbacks in 'Ng2DynamicDialogCallbacks'.<br><br>

        The ability to close the dialog by clicking outside the dialog has also been disabled
        using 'Ng2DynamicDialogBehaviour'`;

    private switchedToHtmlContent: string = `<br>Dynamic content is presented by showing the
        dialog again with different content.<br><br>

        This dialog also uses general and individual button layouts to specify the size,
        location and style of the buttons available.<br><br>

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

        dialogContent.height = 320;
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

        dialogContent.height = 270;
        dialogContent.width = 450;

        dialogContent.title = 'Custom Style Dialog';
        dialogContent.button2 = 'Go Back';
        dialogContent.button1 = 'Exit';

        dialogContent.safeHtmlContent = this._sanitizer.bypassSecurityTrustHtml(this.switchedToHtmlContent);

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

        // Move the first button to the right so they are bunched
        (<any>dialogStyle.button.individial[0].idle)['left.px'] = 250;

        (<any>dialogStyle.button.individial[0].idle)['width.px'] = 90;
        (<any>dialogStyle.button.individial[1].idle)['width.px'] = 90;

        // Title style
        dialogStyle.title['font-family'] = dialogStyle.dialog['font-family'];
        (<any>dialogStyle.title)['font-weight'] = 'bold';
        dialogStyle.title['font-size.px'] = 20;

        (<any>dialogStyle.title)['text-align'] = 'left';
        (<any>dialogStyle.title)['top.px'] = -5;

        // Cancel button style
        dialogStyle.cancelButton['source'] = 'assets/close.png';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }

    //
    // Sets the callbacks of the dialog
    //
    private setDialogCallbacks() {

        // Initialise the style of the dialog
        let dialogCallbacks = new Ng2DynamicDialogCallbacks();

        dialogCallbacks.onButton1Clicked = () => this.onButton1Selected();
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
    // Called when the button 1 is called
    //
    private onButton1Selected(): Ng2DynamicDialogCallbackResult {

        // Go back to the default content
        this.modalDialog.close();
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the button 2 is called
    //
    private onButton2Selected(): Ng2DynamicDialogCallbackResult {

        // Go back to the default content
        this.showDefaultDialogContent();
        return Ng2DynamicDialogCallbackResult.None;
    }

    //
    // Called when the button 3 is called
    //
    private onButton3Selected(): Ng2DynamicDialogCallbackResult {

        // Go to the switched content
        this.showSwitchedDialogContent();
        return Ng2DynamicDialogCallbackResult.None;
    }
}
