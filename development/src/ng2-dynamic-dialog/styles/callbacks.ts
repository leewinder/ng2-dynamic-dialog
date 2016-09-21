
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

    // Button clicked callbacks
    onButton1Clicked: () => CallbackResult = null;
    onButton2Clicked: () => CallbackResult = null;
    onButton3Clicked: () => CallbackResult = null;

    onButtonExitClicked: () => CallbackResult = null;

    // Button hover callbacks
    onButtonEnter: () => CallbackResult = null;
    onButtonExit: () => CallbackResult = null;

    // Event callbacks
    onDialogOpening: () => CallbackResult = null;
    onDialogOpened: () => CallbackResult = null;

    onDialogClosing: () => CallbackResult = null;
    onDialogClosed: () => CallbackResult = null;

    // Transition callbacks
    onTransitionDimensions: () => CallbackResult = null;

    onTransitionContentHide: () => CallbackResult = null;
    onTransitionContentShow: () => CallbackResult = null;
}
