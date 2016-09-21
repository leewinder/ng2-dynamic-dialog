// Imports
import { Component } from '@angular/core';

import { DialogComponent } from '../dialog/dialog.component';

//
// Dialog background component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-background',

    templateUrl: 'background.component.html',
    styleUrls: ['background.component.css'],
})
export class BackgroundComponent {

    // Dialog being rendered over this background
    constructor (private modalDialog: DialogComponent) {

    }
}
