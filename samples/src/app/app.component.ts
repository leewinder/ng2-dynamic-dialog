import { Component } from '@angular/core';
import { SamplesComponent } from '../samples/samples.component';

@Component({

    moduleId: module.id,
    selector: 'ng2-dynammic-dialog-samples-app',

    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],

    directives: [SamplesComponent],
})
export class AppComponent { }
