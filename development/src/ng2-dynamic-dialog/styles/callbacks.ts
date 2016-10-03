
//
// Callback return options
//
export enum CallbackResult {
    CallSubsequent,     // Calls any subsequent callbacks as a result of this one
    None,               // No specific result, nothing needs to be done
}

//
// Dialog callbacks for event responses
//
export class Callbacks {

    // Owner of these callbacks
    owner: any = null;

    // Button clicked callbacks
    onButton1Clicked: (nextOwner: any) => CallbackResult = null;
    onButton2Clicked: (nextOwner: any) => CallbackResult = null;
    onButton3Clicked: (nextOwner: any) => CallbackResult = null;

    onButtonExitClicked: (nextOwner: any) => CallbackResult = null;

    // Button hover callbacks
    onButtonEnter: (nextOwner: any) => CallbackResult = null;
    onButtonExit: (nextOwner: any) => CallbackResult = null;

    // Event callbacks
    onDialogOpening: (nextOwner: any) => CallbackResult = null;
    onDialogOpened: (nextOwner: any) => CallbackResult = null;

    onDialogClosing: (nextOwner: any) => CallbackResult = null;
    onDialogClosed: (nextOwner: any) => CallbackResult = null;

    // Transition callbacks
    onTransitionDimensions: (nextOwner: any) => CallbackResult = null;

    onTransitionContentHide: (nextOwner: any) => CallbackResult = null;
    onTransitionContentShow: (nextOwner: any) => CallbackResult = null;

    // Lock states
    onContentLocking: (nextOwner: any) => CallbackResult = null;
    onContentLocked: (nextOwner: any) => CallbackResult = null;

    onContentUnlocking: (nextOwner: any) => CallbackResult = null;
    onContentUnlocked: (nextOwner: any) => CallbackResult = null;
}
