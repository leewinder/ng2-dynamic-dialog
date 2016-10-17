// Imports
import { Component, Input } from '@angular/core';

import { DisplayController } from '../controllers/display-controller/display-controller';

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

    /* tslint:disable:no-unused-variable */
    @Input() private displayController: DisplayController;
    /* tslint:enable:no-unused-variable */
}
