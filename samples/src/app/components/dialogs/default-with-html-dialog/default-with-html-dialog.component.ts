import { Component, ViewChild } from '@angular/core';

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';

@Component({

    moduleId: module.id,
    selector: 'default-with-html-dialog',

    templateUrl: 'default-with-html-dialog.component.html',
    styleUrls: ['default-with-html-dialog.component.css'],
})
export class DefaultWithHtmlDialogComponent {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;

    // Shows the dialog
    show() {

        let dialogContent = new Ng2DynamicDialogContent();

        dialogContent.title = 'Default Style Dialog';
        dialogContent.unsafeHtmlContent = `<center>A dialog using out-of-the-box styles.<br><br>
        The content is specified using 'Ng2DynamicDialogContent'.<br><br>

        By default there is no exit button, and the user needs to click outside the dialog to close it.<br><br><br>

        Note that raw HTML will be sanitized by default.</center>`;

        dialogContent.width = 450;
        dialogContent.height = 220;

        this.modalDialog.show(dialogContent);
    }
}
