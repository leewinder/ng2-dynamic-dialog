// Imports
import { Component } from '@angular/core';

import { Ng2DynamicDialogComponent } from '../dialog/dialog.component';

//
// Dialog background component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-background',

    templateUrl: 'background.component.html',
    styleUrls: ['background.component.css'],
})
export class Ng2DynamicDialogBackgroundComponent {

    // Dialog being rendered over this background
    modalDialog: Ng2DynamicDialogComponent;

}
