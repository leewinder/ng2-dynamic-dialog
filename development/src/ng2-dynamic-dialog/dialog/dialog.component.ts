// Imports
import { Component, OnInit } from '@angular/core';

import { Content } from '../styles/content';
import { Style } from '../styles/style';
import { Behaviour } from '../styles/behaviour';
import { Callbacks } from '../styles/callbacks';

import { DisplayController } from '../controllers/display-controller/display-controller';
import { CallbackController } from '../controllers/callback-controller/callback-controller';

//
// Main dialog component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-modal',

    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
})
export class DialogComponent implements OnInit {

    // Controllers
    private callbackController: CallbackController = new CallbackController();
    private displayController: DisplayController = new DisplayController();

    // Dialog wrapper callbacks
    private boundOnComponentCreated: Function;
    private boundOnComponentDestroyed: Function;

    //
    // Called to initialise the object
    //
    ngOnInit() {
        // Bind the callbacks we will pass to the component wrapper
        this.boundOnComponentCreated = this.onComponentCreated.bind(this);
        this.boundOnComponentDestroyed = this.onComponentDestroyed.bind(this);

        // Set our event callbacks
        this.displayController.setEventCallbacks(
            // Dialog display callbacks
            () => this.onDialogShown(),
            (offDialogClick: boolean) => this.onDialogClosed(offDialogClick),

            // Locking callbacks
            () => this.onContentLocked(),
            () => this.onContentUnlocked(),

            // Transition callbacks
            (transitionState: number) => this.onDialogTransition(transitionState),
            (transitionState: number) => this.onContentTransition(transitionState)
        );
    }

    //
    // Sets the style of the dialog
    //
    setStyle(dialogStyle: Style) {
        this.displayController.setStyle(dialogStyle);
    }

    //
    // Sets the behaviour of this dialog
    //
    setBehaviour(dialogBehaviour: Behaviour) {
        this.displayController.setBehaviour(dialogBehaviour);
    }

    //
    // Sets the callbacks for this dialog
    //
    setCallbacks(callbacks: Callbacks) {
        this.callbackController.setCallbacks(callbacks);
    }

    //
    // Shows the dialog
    //
    show(content: Content) {
        this.displayController.show(content);
    }

    //
    // Closes the dialog
    //
    close() {
        this.displayController.close(false);
    }

    //
    // Locks the dialog to user interaction
    //
    lock(instant: boolean) {

        this.displayController.lock(this.displayController.lockState.LOCK, instant, () => {
            this.callbackController.onContentLock();
        });

    }

    //
    // Unlocks the dialog to user interaction
    //
    unlock(instant: boolean) {

        this.displayController.lock(this.displayController.lockState.UNLOCK, instant, () => {
            this.callbackController.onContentUnlock();
        });

    }

    //
    // Returns if we're in a transition state and can't be modified
    //
    inTransition(): boolean {
        return this.displayController.inTransition();
    }

    //
    // Called when the dialog becomes active and is shown
    //
    private onDialogShown() {
        // Let the client know
        this.callbackController.onDialogOpening();
    }

    //
    // Called when the dialog is finally closed
    //
    private onDialogClosed(offDialogClick: boolean) {

        // Did we click the exit button
        if (offDialogClick === false) {
            this.callbackController.onButtonExitClicked();
        }

        // We're exiting now
        this.callbackController.onDialogClosing();
    }

    //
    // Called when the dialog is fully locked
    //
    private onContentLocked() {
        // Let the client know
        this.callbackController.onContentLocked();
    }

    //
    // Called when the dialog is fully unlocked
    //
    private onContentUnlocked() {
        // Let the client know
        this.callbackController.onContentUnlocked();
    }

    //
    // Called when the dialog itself is transitioning
    //
    private onDialogTransition(transitionState: number) {

        // Call the right callback
        if (transitionState === this.displayController.dialogTransitionStates.TRANSITION_IN) {
            this.callbackController.onDialogOpened();
        } else if (transitionState === this.displayController.dialogTransitionStates.TRANSITION_OUT) {
            this.callbackController.onDialogClosed();
        }
    }

    //
    // Called when the content is in transition
    //
    private onContentTransition(transitionState: number) {

        // Call the right callback
        if (transitionState === this.displayController.contentTransitionStates.DIMENSIONS) {
            this.callbackController.onTransitionDimensions();
        } else if (transitionState === this.displayController.contentTransitionStates.TRANSITION_IN) {
            this.callbackController.onTransitionContentShow();
        } else if (transitionState === this.displayController.contentTransitionStates.TRANSITION_OUT) {
            this.callbackController.onTransitionContentHide();
        } else if (transitionState === this.displayController.contentTransitionStates.LOCKING_OUT) {
            this.callbackController.onContentLock();
        } else if (transitionState === this.displayController.contentTransitionStates.UNLOCKING_OUT) {
            this.callbackController.onContentUnlock();
        }
    }

    //
    // Called when a component content object is created
    //
    private onComponentCreated(component: Component): void {

        // See if we can get the callbacks
        if (typeof ((<any>component).getDialogComponentCallbacks) !== 'undefined') {

            // Get the callbacks from this component
            let componentCallbacks: Callbacks = (<any>component).getDialogComponentCallbacks();
            this.callbackController.setComponentCallbacks(componentCallbacks);
        }

        // Pass through this dialog if the component wants it
        if (typeof ((<any>component).setDialogComponent) !== 'undefined') {
            (<any>component).setDialogComponent(this);
        }
    }

    //
    // Called when a component content object is destroyed
    //
    private onComponentDestroyed(): void {

        // Remove the component callbacks
        this.callbackController.setComponentCallbacks(null);
    }

    //
    // Called when a button is clicked
    //
    /* tslint:disable:no-unused-variable */
    private onButtonClicked(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Just call the right callbacks
        this.callbackController.onButtonClicked(buttonIndex);
    }

    //
    // Called when the mose moves over a button
    //
    /* tslint:disable:no-unused-variable */
    private onButtonMouseOver(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Set the state of the button
        this.displayController.setButtonState(buttonIndex, this.displayController.buttonState.HOVER);

        // Entered the button
        this.callbackController.onButtonEnter();
    }

    //
    // Called when the mose moves out from a button
    //
    /* tslint:disable:no-unused-variable */
    private onButtonMouseOut(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // No longer highlighted
        this.displayController.setButtonState(buttonIndex, this.displayController.buttonState.IDLE);

        // Left the button
        this.callbackController.onButtonExit();
    }
}
