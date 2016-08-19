import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2DynamicDialogBackgroundComponent } from '../background/background.component';
import { Ng2DynamicDialogComponent } from '../dialog/dialog.component';

import { Ng2DynamicDialogWrapperComponent } from '../wrapper/wrapper.component';

// Ng2 Dialog Module
@NgModule({
    imports: [
        CommonModule,
    ],

    declarations: [
        Ng2DynamicDialogBackgroundComponent,
        Ng2DynamicDialogComponent,

        Ng2DynamicDialogWrapperComponent,
    ],

    exports: [
        Ng2DynamicDialogComponent,
    ],

    providers: [],
})
export class Ng2DynamicDialogModule { }
