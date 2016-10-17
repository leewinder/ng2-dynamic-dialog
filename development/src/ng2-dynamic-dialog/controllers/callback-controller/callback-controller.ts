// Imports
import { Callbacks } from '../../styles/callbacks';
import { CallbackResult } from '../../styles/callbacks';

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

        let dialogMethods: ((nextOwner: any) => CallbackResult)[] = [
            this.dialogCallbacks.onButton1Clicked,
            this.dialogCallbacks.onButton2Clicked,
            this.dialogCallbacks.onButton3Clicked,
        ];
        let componentMethods: ((nextOwner: any) => CallbackResult)[] = [
            this.componentCallbacks.onButton1Clicked,
            this.componentCallbacks.onButton2Clicked,
            this.componentCallbacks.onButton3Clicked,
        ];

        // Call the function
        this.triggerCallback(this.dialogCallbacks.owner,
            dialogMethods[index],
            componentMethods[index]);
    }

    // Callback wrappers

    onButtonExitClicked() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onButtonExitClicked,
            this.componentCallbacks.onButtonExitClicked);
    }

    onButtonEnter() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onButtonEnter,
            this.componentCallbacks.onButtonEnter);
    }

    onButtonExit() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onButtonExit,
            this.componentCallbacks.onButtonExit);
    }

    onDialogOpening() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onDialogOpening,
            this.componentCallbacks.onDialogOpening);
    }

    onDialogOpened() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onDialogOpened,
            this.componentCallbacks.onDialogOpened);
    }

    onDialogClosing() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onDialogClosing,
            this.componentCallbacks.onDialogClosing);
    }

    onDialogClosed() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onDialogClosed,
            this.componentCallbacks.onDialogClosed);
    }

    onTransitionDimensions() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onTransitionDimensions,
            this.componentCallbacks.onTransitionDimensions);
    }

    onTransitionContentHide() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onTransitionContentHide,
            this.componentCallbacks.onTransitionContentHide);
    }

    onTransitionContentShow() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onTransitionContentShow,
            this.componentCallbacks.onTransitionContentShow);
    }

    onContentLock() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onContentLocking,
            this.componentCallbacks.onContentLocking);
    }

    onContentUnlock() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onContentUnlocking,
            this.componentCallbacks.onContentUnlocking);
    }

    onContentLocked() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onContentLocked,
            this.componentCallbacks.onContentLocked);
    }

    onContentUnlocked() {
        this.triggerCallback(this.dialogCallbacks.owner,
            this.dialogCallbacks.onContentUnlocked,
            this.componentCallbacks.onContentUnlocked);
    }

    //
    // Triigers the component and/or dialog callbacks
    //
    private triggerCallback(dialogCallbackOwner: any,
        dialogCallback: ((nextOwner: any) => CallbackResult),
        componentCallback: ((nextOwner: any) => CallbackResult)) {

        // Call the component callback which will indicate if we need to call the dialog
        let callDialogCallback: CallbackResult = CallbackResult.CallSubsequent;
        if (componentCallback !== null) {
            callDialogCallback = componentCallback(dialogCallbackOwner);
        }

        // Should we call the dialog level callback
        if (dialogCallback !== null && callDialogCallback === CallbackResult.CallSubsequent) {
            dialogCallback(null);
        }
    }

}
