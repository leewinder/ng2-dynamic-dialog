import { Component, ViewChild } from '@angular/core';

import { CustomComponentDialogComponent } from '../dialogs/custom-component-dialog/custom-component-dialog.component';

@Component({

    moduleId: module.id,
    selector: 'main-page',

    templateUrl: 'main-page.component.html',
    styleUrls: ['main-page.component.css'],

    directives: [CustomComponentDialogComponent],
})
export class MainPageComponent {

    // Child nodes
    @ViewChild(CustomComponentDialogComponent) private customComponentDialog: CustomComponentDialogComponent;

    //
    // Called when the user requests the component dialog
    //
    requested_component_dialog() {
        this.customComponentDialog.requestUserSignIn();
    }
}
