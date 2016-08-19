import { Component } from '@angular/core';

import { MainPageComponent } from '../main-page/main-page.component';

@Component({

    moduleId: module.id,
    selector: 'ng2-dynammic-dialog-samples-app',

    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],

    directives: [MainPageComponent],
})
export class AppComponent { }
