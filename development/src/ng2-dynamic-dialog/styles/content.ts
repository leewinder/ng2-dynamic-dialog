import { SafeHtml } from '@angular/platform-browser';

//
// Requested content for a dialog
//
export class Ng2DynamicDialogContent {

    // Common content
    title: string;

    button1: string;    // Left most button
    button2: string;    // Right most button

    button3: string;    // Single button, across the whole dialog

    // Dimensions
    width: number;
    height: number;

    // Custom HTML content
    safeHtmlContent: SafeHtml;
    unsafeHtmlContent: string;

    // Custom component content
    componentContent: any;
}
