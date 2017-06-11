import { Component, ViewChild } from '@angular/core';

import { CustomComponentDialogComponent } from '../dialogs/custom-component-dialog/custom-component-dialog.component';
import { DefaultWithHtmlDialogComponent } from '../dialogs/default-with-html-dialog/default-with-html-dialog.component';
import { StyledWithHtmlDialogComponent } from '../dialogs/styled-with-html-dialog/styled-with-html-dialog.component';
import { LockedComponentDialogComponent } from '../dialogs/locked-component-dialog/locked-component-dialog.component';

@Component({

    moduleId: __filename,
    selector: 'main-page',

    templateUrl: 'main-page.component.html',
    styleUrls: ['main-page.component.css'],
})
export class MainPageComponent {

    // Child nodes
    @ViewChild(CustomComponentDialogComponent) private customComponentDialog: CustomComponentDialogComponent;
    @ViewChild(DefaultWithHtmlDialogComponent) private defaultWithHtmlDialog: DefaultWithHtmlDialogComponent;
    @ViewChild(StyledWithHtmlDialogComponent) private styledWithHtmlDialog: StyledWithHtmlDialogComponent;
    @ViewChild(LockedComponentDialogComponent) private lockableDialog: LockedComponentDialogComponent;

    //
    // Called when the user requests the default dialog
    //
    requested_default_dialog() {
        this.defaultWithHtmlDialog.show();
    }

    //
    // Called when the custom style dialog is requested
    //
    requested_styled_dialog() {
        this.styledWithHtmlDialog.show();
    }

    //
    // Called when the user requests the component dialog
    //
    requested_component_dialog() {
        this.customComponentDialog.requestUserSignIn();
    }

    //
    // Called when the user requests the lockable dialog
    //
    requested_lockable_dialog() {
        this.lockableDialog.show();
    }
}
