
//
// Dialog callbacks for event responses
//
export class Ng2DynamicDialogCallbacks {

    // Button clicked callbacks
    onButton1Clicked: () => void = null;
    onButton2Clicked: () => void = null;
    onButton3Clicked: () => void = null;

    onButtonExitClicked: () => void = null;

    // Button hover callbacks
    onButtonEnter: () => void = null;
    onButtonExit: () => void = null;

    // Event callbacks
    onDialogOpening: () => void = null;
    onDialogOpened: () => void = null;

    onDialogClosing: () => void = null;
    onDialogClosed: () => void = null;

    // Transition callbacks
    onTransitionDimensions: () => void = null;

    onTransitionContentHide: () => void = null;
    onTransitionContentShow: () => void = null;
}
