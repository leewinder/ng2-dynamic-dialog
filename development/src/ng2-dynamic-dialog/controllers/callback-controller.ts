// Imports
import { Callbacks } from '../styles/callbacks';
import { CallbackResult } from '../styles/callbacks';

//
// Controls the management of callbacks
//
export class CallbackController {

    private dialogCallbacks: Callbacks = new Callbacks();
    private componentCallbacks: Callbacks = new Callbacks();

    //
    // Sets the dialog level callbacks
    //
    setCallbacks(dialogCallbacks: Callbacks) {

        // If we've had nothing passed through, reset
        if (dialogCallbacks === null) {
            this.dialogCallbacks = new Callbacks();
        } else {
            this.dialogCallbacks = dialogCallbacks;
        }
    }

    //
    // Sets the component level callbacks
    //
    setComponentCallbacks(componentCallbacks: Callbacks) {

        // If we've had nothing passed through, reset
        if (componentCallbacks === null) {
            this.componentCallbacks = new Callbacks();
        } else {
            this.componentCallbacks = componentCallbacks;
        }
    }

    //
    // Called when a button is clicked
    //
    onButtonClicked(index: number) {

        let dialogMethods: (() => CallbackResult)[] = [
            this.dialogCallbacks.onButton1Clicked,
            this.dialogCallbacks.onButton2Clicked,
            this.dialogCallbacks.onButton3Clicked,
        ];
        let componentMethods: (() => CallbackResult)[] = [
            this.componentCallbacks.onButton1Clicked,
            this.componentCallbacks.onButton2Clicked,
            this.componentCallbacks.onButton3Clicked,
        ];

        // Call the function
        this.triggerCallback(dialogMethods[index], componentMethods[index]);
    }

    // Callback wrappers

    onButtonExitClicked() {
        this.triggerCallback(this.dialogCallbacks.onButtonExitClicked, this.componentCallbacks.onButtonExitClicked);
    }

    onButtonEnter() {
        this.triggerCallback(this.dialogCallbacks.onButtonEnter, this.componentCallbacks.onButtonEnter);
    }

    onButtonExit() {
        this.triggerCallback(this.dialogCallbacks.onButtonExit, this.componentCallbacks.onButtonExit);
    }

    onDialogOpening() {
        this.triggerCallback(this.dialogCallbacks.onDialogOpening, this.componentCallbacks.onDialogOpening);
    }

    onDialogOpened() {
        this.triggerCallback(this.dialogCallbacks.onDialogOpened, this.componentCallbacks.onDialogOpened);
    }

    onDialogClosing() {
        this.triggerCallback(this.dialogCallbacks.onDialogClosing, this.componentCallbacks.onDialogClosing);
    }

    onDialogClosed() {
        this.triggerCallback(this.dialogCallbacks.onDialogClosed, this.componentCallbacks.onDialogClosed);
    }

    onTransitionDimensions() {
        this.triggerCallback(this.dialogCallbacks.onTransitionDimensions, this.componentCallbacks.onTransitionDimensions);
    }

    onTransitionContentHide() {
        this.triggerCallback(this.dialogCallbacks.onTransitionContentHide, this.componentCallbacks.onTransitionContentHide);
    }

    onTransitionContentShow() {
        this.triggerCallback(this.dialogCallbacks.onTransitionContentShow, this.componentCallbacks.onTransitionContentShow);
    }

    //
    // Triigers the component and/or dialog callbacks
    //
    private triggerCallback(dialogCallback: (() => CallbackResult), componentCallback: (() => CallbackResult)) {

        // Call the component callback which will indicate if we need to call the dialog
        let callDialogCallback: CallbackResult = CallbackResult.CallSubsequent;
        if (componentCallback !== null) {
            callDialogCallback = componentCallback();
        }

        // Should we call the dialog level callback
        if (dialogCallback !== null && callDialogCallback === CallbackResult.CallSubsequent) {
            dialogCallback();
        }
    }

}
