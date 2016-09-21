import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackgroundComponent } from '../background/background.component';
import { DialogComponent } from '../dialog/dialog.component';

import { DynamicCreatorComponent } from '../dynamic-creator/dynamic-creator.component';

// Ng2 Dialog Module
@NgModule({
    imports: [
        CommonModule,
    ],

    declarations: [
        BackgroundComponent,
        DialogComponent,

        DynamicCreatorComponent,
    ],

    exports: [
        DialogComponent,
    ],

    providers: [],
})
export class DialogModule { }
