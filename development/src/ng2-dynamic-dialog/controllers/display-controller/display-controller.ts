// Imports
import { TsLerp, TsLerpTransition, TsLerpStyle } from 'tslerp';

import { StyleSheets } from '../../style-sheets/style-sheets';

import { Style } from '../../styles/style';
import { Behaviour } from '../../styles/behaviour';
import { Content } from '../../styles/content';

import { CachedDisplayStyles } from './cached-display-styles';

//
// Controls the display of the dialog
//
export class DisplayController {

    // Transition states
    public dialogTransitionStates = {
        NONE: 0,

        TRANSITION_IN: 1,
        TRANSITION_OUT: 2,
    };

    public contentTransitionStates = {
        NONE: 0,

        TRANSITION_IN: 1,
        TRANSITION_OUT: 2,

        DIMENSIONS: 3,

        LOCKING_OUT: 4,
        LOCKING_IN: 5,

        UNLOCKING_OUT: 6,
        UNLOCKING_IN: 7,
    };

    public buttonState = {
        IDLE: 0,
        HOVER: 1,
    };

    public lockState = {
        LOCK: 0,
        UNLOCK: 1,
    };

    // Styles
    private dialogStyle: Style = new Style();
    private dialogBehaviour: Behaviour = new Behaviour();

    // Content
    private currentContent: Content;
    private nextContent: Content;

    // Transition states
    private isActive = false;

    private dialogTransition = this.dialogTransitionStates.NONE;
    private contentTransition = this.contentTransitionStates.NONE;

    private dialogTransitionLerp: TsLerp = new TsLerp();

    private lerpTransition: TsLerpTransition = TsLerpTransition.EaseOut;
    private lerpStyle: TsLerpStyle = TsLerpStyle.Quadratic;

    // Transition properties
    private dialogOpacity: number = 0;

    private dialogWidth: number = 0;
    private dialogHeight: number = 0;

    private contentOpacity: number = 0;
    private lockedIconOpacity: number = 0;
    private buttonOpacity: number = 0;

    private contentChanging: boolean = false;
    private dimensionsChanging: boolean = false;

    // Track our state
    private currentButtonStates: number[] = [this.buttonState.IDLE, this.buttonState.IDLE, this.buttonState.IDLE];
    private currentLockState: number = this.lockState.UNLOCK;

    // Merged styles
    private cachedStyles: CachedDisplayStyles = new CachedDisplayStyles();

    // Callbacks
    private dialogShownCallback: () => void;
    private dialogClosedCallback: (offDialogClick: boolean) => void;

    private contentLockedCallback: () => void;
    private contentUnlockedCallback: () => void;

    private dialogTransitionCallback: (transitionState: number) => void;
    private contentTransitionCallback: (transitionState: number) => void;

    //
    // Constructor
    //
    constructor() {
    }

    //
    // Sets the style of the dialog
    //
    setStyle(dialogStyle: Style) {

        // If we've had nothing passed through, reset
        if (dialogStyle === null) {
            this.dialogStyle = new Style();
        } else {
            this.dialogStyle = dialogStyle;
        }

        // When we set a new style, we clear the cached styles
        this.cachedStyles.clear();
    }

    //
    // Sets the behaviour of the dialog
    //
    setBehaviour(dialogBehaviour: Behaviour) {

        // If we've had nothing passed through, reset
        if (dialogBehaviour === null) {
            this.dialogBehaviour = new Behaviour();
        } else {
            this.dialogBehaviour = dialogBehaviour;
        }
    }

    //
    // Sets the event callbacks
    //
    setEventCallbacks(dialogShownCallback: () => void, dialogClosedCallback: (offDialogClick: boolean) => void,
        contentLockedCallback: () => void, contentUnockedCallback: () => void,
        dialogTransitionCallback: (transitionState: number) => void,
        contentTransitionCallback: (transitionState: number) => void) {

        // Just save them
        this.dialogShownCallback = dialogShownCallback;
        this.dialogClosedCallback = dialogClosedCallback;

        this.contentLockedCallback = contentLockedCallback;
        this.contentUnlockedCallback = contentUnockedCallback;

        this.dialogTransitionCallback = dialogTransitionCallback;
        this.contentTransitionCallback = contentTransitionCallback;
    }

    //
    // Sets the button state
    //
    setButtonState(buttonIndex: number, state: number) {
        this.currentButtonStates[buttonIndex] = state;
    }

    //
    // Shows the dialog
    //
    show(content: Content) {

        // Can't do it if we're already in transition
        if (this.inTransition() === true) {
            return;
        }

        // Are we already active?
        if (this.isActive === true) {

            // Set what we'll show next
            this.nextContent = content;

            // Has anything actually changes?
            this.dimensionsChanging = (this.nextContent.height !== this.currentContent.height ||
                this.nextContent.width !== this.currentContent.width);
            this.contentChanging = (this.nextContent.unsafeHtmlContent !== this.currentContent.unsafeHtmlContent ||
                this.nextContent.safeHtmlContent !== this.currentContent.safeHtmlContent ||
                this.nextContent.componentContent !== this.currentContent.componentContent);

            // Set the right next state
            let contentTransition = this.contentTransitionStates.NONE;
            if (this.contentChanging === true) {
                contentTransition = this.contentTransitionStates.TRANSITION_OUT;
            } else if (this.dimensionsChanging === true) {
                contentTransition = this.contentTransitionStates.DIMENSIONS;
            }

            if (contentTransition !== this.contentTransitionStates.NONE) {
                this.setContentTransitionState(contentTransition);
            }

        } else {

            // Not active, so set the content and start to show the dialog
            this.currentContent = content;
            this.setDialogTransitionState(this.dialogTransitionStates.TRANSITION_IN);

            // Set our other transition properties
            this.dialogWidth = this.currentContent.width;
            this.dialogHeight = this.currentContent.height;

            this.contentOpacity = 1;
            this.buttonOpacity = 1;
            this.lockedIconOpacity = 0;

            this.dimensionsChanging = false;
            this.contentChanging = false;

            this.isActive = true;

            // Reset our default colours
            for (let i = 0; i < this.currentButtonStates.length; i++) {
                this.currentButtonStates[i] = this.buttonState.IDLE;
            }

            // We've become active, so call the callback
            if (this.dialogShownCallback != null) {
                this.dialogShownCallback();
            }
        }
    }

    //
    // Closes the dialog
    //
    close(offDialogClick: boolean) {

        // Can't do it if we're already in transition
        if (this.inTransition() === true) {
            return;
        }

        // If we have no buttons, we can't quit
        if (this.buttonOpacity <= 0) {
            return;
        }

        // Do we want to do this if it's an off dialog click?
        if (offDialogClick === true && this.dialogBehaviour.exitOnOffDialogClick === false) {
            return;
        }

        // We've closed to pass through the callback
        if (this.dialogClosedCallback != null) {
            this.dialogClosedCallback(offDialogClick);
        }

        // We are now transitioning out
        this.setDialogTransitionState(this.dialogTransitionStates.TRANSITION_OUT);
    }

    //
    // Locks or unlocks the dialog
    //
    lock(lockState: number, instant: boolean, lockStartedCallback: () => void): void {

        // Do we want to do this instantly?
        if (instant === true) {

            // Trigger it and we're done
            this.triggerInstantLock(lockState, lockStartedCallback);
            return;
        }

        // Can't do it if we're already in transition
        if (this.inTransition() === true) {
            return;
        }

        // If we're in the same state, don't bother
        if (lockState === this.currentLockState) {
            return;
        }
        this.currentLockState = lockState;

        // Let the client know we're doing it
        if (lockStartedCallback != null) {
            lockStartedCallback();
        }

        // We are now transitioning our lock state
        if (lockState === this.lockState.LOCK) {
            this.setContentTransitionState(this.contentTransitionStates.LOCKING_OUT);
        } else if (lockState === this.lockState.UNLOCK) {
            this.setContentTransitionState(this.contentTransitionStates.UNLOCKING_OUT);
        }
    }

    //
    // Returns if we're in a transition state and can't be modified
    //
    inTransition(): boolean {
        return (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE);
    }

    //
    // Performs an instant lock or unlock
    //
    private triggerInstantLock(lockState: number, lockStartedCallback: () => void) {

        // We can't do anything if we're already transitioning the lock transition already
        if (this.contentTransition === this.contentTransitionStates.LOCKING_IN ||
            this.contentTransition === this.contentTransitionStates.LOCKING_OUT ||
            this.contentTransition === this.contentTransitionStates.UNLOCKING_IN ||
            this.contentTransition === this.contentTransitionStates.UNLOCKING_OUT) {

            // We can't do anything here
            return;
        }

        // We can lock, but do it straight away
        this.lockedIconOpacity = (lockState === this.lockState.LOCK ? 1 : 0);
        this.buttonOpacity = (lockState === this.lockState.LOCK ? 0 : 1);

        // Save our lock state
        this.currentLockState = lockState;

        // It's started
        if (lockStartedCallback != null) {
            lockStartedCallback();
        }

        // And it's done...
        let callbackToCall = (lockState === this.lockState.LOCK ? this.contentLockedCallback : this.contentUnlockedCallback);
        if (callbackToCall != null) {
            callbackToCall();
        }
    }

    //
    // Sets the dialog transition state
    //
    private setDialogTransitionState(transitionState: number) {

        // Are we just clearing out state
        if (transitionState === this.dialogTransitionStates.NONE) {
            this.dialogTransition = this.dialogTransitionStates.NONE;
            return;
        }

        // Should we start to fade?
        if (transitionState === this.dialogTransitionStates.TRANSITION_IN) {
            this.dialogTransitionLerp.define([[0, 1]], this.dialogBehaviour.transitionTimeDialogs, this.lerpTransition, this.lerpStyle);
        } else if (transitionState === this.dialogTransitionStates.TRANSITION_OUT) {
            this.dialogTransitionLerp.define([[1, 0]], this.dialogBehaviour.transitionTimeDialogs, this.lerpTransition, this.lerpStyle);
        }

        // Trigger the lerp update
        this.dialogTransitionLerp.lerp((results: number[], time: number) => {
            this.intervalCallback(results, time);
        });

        // Save the new state
        this.dialogTransition = transitionState;
    }

    //
    // Sets a content transition state
    //
    private setContentTransitionState(transitionState: number) {

        // Are we just clearing out state
        if (transitionState === this.contentTransitionStates.NONE) {
            this.contentTransition = this.contentTransitionStates.NONE;
            return;
        }

        // Set our states
        if (transitionState === this.contentTransitionStates.DIMENSIONS) {

            let lerpValues = [[this.currentContent.width, this.nextContent.width],
            [this.currentContent.height, this.nextContent.height]];
            this.dialogTransitionLerp.define(lerpValues, this.dialogBehaviour.transitionTimeContent, this.lerpTransition, this.lerpStyle);

        } else if (transitionState === this.contentTransitionStates.TRANSITION_OUT ||
            transitionState === this.contentTransitionStates.LOCKING_OUT ||
            transitionState === this.contentTransitionStates.UNLOCKING_OUT) {

            this.dialogTransitionLerp.define([[1, 0]], this.dialogBehaviour.transitionTimeContent, this.lerpTransition, this.lerpStyle);

        } else if (transitionState === this.contentTransitionStates.TRANSITION_IN ||
            transitionState === this.contentTransitionStates.LOCKING_IN ||
            transitionState === this.contentTransitionStates.UNLOCKING_IN) {

            this.dialogTransitionLerp.define([[0, 1]], this.dialogBehaviour.transitionTimeContent, this.lerpTransition, this.lerpStyle);
        }

        // Call the transition callback if we have one
        if (this.contentTransitionCallback != null) {
            this.contentTransitionCallback(transitionState);
        }

        // Trigger the lerp update
        this.dialogTransitionLerp.lerp((results: number[], time: number) => {
            this.intervalCallback(results, time);
        });

        // Save the new state
        this.contentTransition = transitionState;
    }

    //
    // Called during a transition
    //
    private intervalCallback(results: number[], time: number) {

        // We've finished if we've got to the end of the transition
        let finished = time === 1;

        // Update any transitions
        if (this.dialogTransition !== this.dialogTransitionStates.NONE) {

            // Update the opacity of the dialog
            this.dialogOpacity = results[0];

            // If we're done, no more transition (end value is if all are finished)
            if (finished === true) {

                if (this.dialogTransition === this.dialogTransitionStates.TRANSITION_OUT) {
                    // Turn the dialog off
                    this.isActive = false;
                }

                // Call the transition callback if we have one
                if (this.dialogTransitionCallback != null) {
                    this.dialogTransitionCallback(this.dialogTransition);
                }
            }

        } else if (this.contentTransition === this.contentTransitionStates.DIMENSIONS) {

            // Get our DIMENSIONS
            this.dialogWidth = results[0];
            this.dialogHeight = results[1];

        } else if (this.contentTransition === this.contentTransitionStates.TRANSITION_OUT ||
            this.contentTransition === this.contentTransitionStates.TRANSITION_IN) {

            // Save our opacity
            this.contentOpacity = results[0];

        } else if (this.contentTransition === this.contentTransitionStates.LOCKING_IN ||
            this.contentTransition === this.contentTransitionStates.UNLOCKING_OUT) {

            // Save our opacity
            this.lockedIconOpacity = results[0];
            this.buttonOpacity = 0;

        } else if (this.contentTransition === this.contentTransitionStates.LOCKING_OUT ||
            this.contentTransition === this.contentTransitionStates.UNLOCKING_IN) {

            // Save our opacity
            this.buttonOpacity = results[0];
            this.lockedIconOpacity = 0;

        }

        // If we finished, what state is next?
        if (finished === true) {

            // We need to figure out if we're going into another content state
            let newContentTransitionState = this.contentTransitionStates.NONE;
            if (this.contentTransition === this.contentTransitionStates.TRANSITION_OUT) {

                // Are the dimensions changing?
                if (this.dimensionsChanging === true) {
                    newContentTransitionState = this.contentTransitionStates.DIMENSIONS;
                } else {
                    newContentTransitionState = this.contentTransitionStates.TRANSITION_IN;
                }

                // We've tracked this now
                this.dimensionsChanging = false;

            } else if (this.contentTransition === this.contentTransitionStates.DIMENSIONS) {

                // Has the content changed?
                if (this.contentChanging === true) {
                    newContentTransitionState = this.contentTransitionStates.TRANSITION_IN;
                }

                // Done
                this.contentChanging = false;
            } else if (this.contentTransition === this.contentTransitionStates.LOCKING_OUT) {
                newContentTransitionState = this.contentTransitionStates.LOCKING_IN;
            } else if (this.contentTransition === this.contentTransitionStates.LOCKING_IN) {
                this.contentLockedCallback();
            } else if (this.contentTransition === this.contentTransitionStates.UNLOCKING_OUT) {
                newContentTransitionState = this.contentTransitionStates.UNLOCKING_IN;
            } else if (this.contentTransition === this.contentTransitionStates.UNLOCKING_IN) {
                this.contentUnlockedCallback();
            }

            // Set the new content state
            this.setContentTransitionState(newContentTransitionState);
            this.setDialogTransitionState(this.dialogTransitionStates.NONE);

            // Swap the content over if we're now moving into the state
            if (newContentTransitionState === this.contentTransitionStates.TRANSITION_IN) {
                this.currentContent = this.nextContent;
            }
        }
    }

    //
    // Sets the style of the dialog background
    //
    /* tslint:disable:no-unused-variable */
    private setStyleBackground() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.background === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-background',
            ];
            if (this.dialogStyle.background != null && this.dialogStyle.background.length > 0) {
                styleList.push(this.dialogStyle.background);
            }

            // Get the styles we'll use
            let styleToUse = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.background = styleToUse;
        }

        return this.cachedStyles.background;
    }

    //
    // Called to set the style of the modal
    //
    /* tslint:disable:no-unused-variable */
    private setStyleModalDialog() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.dialog === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-modal',
            ];
            if (this.dialogStyle.dialog != null && this.dialogStyle.dialog.length > 0) {
                styleList.push(this.dialogStyle.dialog);
            }

            // Get the styles we'll use
            let styleToUse: any = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.dialog = styleToUse;
        }

        // Modify the style for our transitions
        this.cachedStyles.dialog['width.px'] = this.dialogWidth;
        this.cachedStyles.dialog['height.px'] = this.dialogHeight;

        this.cachedStyles.dialog['opacity'] = this.dialogOpacity;

        // Return the style of this dialog
        return this.cachedStyles.dialog;
    }

    //
    // Called to set the style of the title string of the dialog
    //
    /* tslint:disable:no-unused-variable */
    private setStyleTitle() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.title === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-modal-title',
            ];
            if (this.dialogStyle.title != null && this.dialogStyle.title.length > 0) {
                styleList.push(this.dialogStyle.title);
            }

            // Get the styles we'll use
            let styleToUse = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.title = styleToUse;
        }

        return this.cachedStyles.title;
    }

    //
    // Sets the style of the close button
    //
    /* tslint:disable:no-unused-variable */
    private setStyleCloseButton() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.closeButton === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-modal-button-close',
            ];
            if (this.dialogStyle.buttonClose.style != null && this.dialogStyle.buttonClose.style.length > 0) {
                styleList.push(this.dialogStyle.buttonClose.style);
            }

            // Get the styles we'll use
            let styleToUse: any = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.closeButton = styleToUse;
        }

        // Add the opacity
        this.cachedStyles.closeButton['opacity'] = this.buttonOpacity;

        // Are we in transition or not?
        if (this.inTransition() === true) {
            this.cachedStyles.closeButton['cursor'] = 'default';
        } else {
            this.cachedStyles.closeButton['cursor'] = 'pointer';
        }

        // Return the style we'll use
        return this.cachedStyles.closeButton;
    }

    //
    // Sets the style of the locked icon
    //
    /* tslint:disable:no-unused-variable */
    private setStyleLockedIcon() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.lockedImage === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-modal-icon-locked',
            ];
            if (this.dialogStyle.iconLocked.style != null && this.dialogStyle.iconLocked.style.length > 0) {
                styleList.push(this.dialogStyle.iconLocked.style);
            }

            // Get the styles we'll use
            let styleToUse: any = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.lockedImage = styleToUse;
        }

        // Add our opacity
        this.cachedStyles.lockedImage['opacity'] = this.lockedIconOpacity;

        // Return the style we'll use
        return this.cachedStyles.lockedImage;
    }

    //
    // Sets the style of the button test
    //
    /* tslint:disable:no-unused-variable */
    private setStyleButtonText() {
        /* tslint:enable:no-unused-variable */

        // If we don't have a cached style, generate it
        if (this.cachedStyles.buttonText === null) {

            // Get the list of styles we will use, in the order that we will apply them
            let styleList: string[] = [
                'ng2-dynamic-dialog-modal-button-text',
            ];
            if (this.dialogStyle.buttonText != null && this.dialogStyle.buttonText.length > 0) {
                styleList.push(this.dialogStyle.buttonText);
            }

            // Get the styles we'll use
            let styleToUse = StyleSheets.mergeStyles(styleList);
            this.cachedStyles.buttonText = styleToUse;
        }

        return this.cachedStyles.buttonText;
    }

    //
    // Called to set the style of a given button
    //
    /* tslint:disable:no-unused-variable */
    private setStyleButton(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Build up the list of styles we need to apply
        let styleList: string[] = [
            'ng2-dynamic-dialog-modal-button',
        ];

        // Apply the users idle state
        if (this.dialogStyle.button.general.idle != null && this.dialogStyle.button.general.idle.length > 0) {
            styleList.push(this.dialogStyle.button.general.idle);
        }

        // Apply the button specific state
        let individualButtonStyle = `ng2-dynamic-dialog-modal-button-button-${buttonIndex}`;
        styleList.push(individualButtonStyle);

        // Add the users individual style
        let usersIndividualStyle = this.dialogStyle.button.individial[buttonIndex];
        if (usersIndividualStyle.idle != null && usersIndividualStyle.idle.length > 0) {
            styleList.push(usersIndividualStyle.idle);
        }

        // Apply the hover state if we need to
        if (this.currentButtonStates[buttonIndex] === this.buttonState.HOVER) {

            // Default state
            styleList.push('ng2-dynamic-dialog-modal-button:hover');

            // Apply the users hover state
            if (this.dialogStyle.button.general.hover != null && this.dialogStyle.button.general.hover.length > 0) {
                styleList.push(this.dialogStyle.button.general.hover);
            }
        }

        // Get the styles we'll use
        let styleToUse: any = StyleSheets.mergeStyles(styleList);

        // Add the opacity
        styleToUse['opacity'] = this.buttonOpacity;

        // Are we in transition or not?
        if (this.inTransition() === true) {
            styleToUse['cursor'] = 'default';
        } else {
            styleToUse['cursor'] = 'pointer';
        }

        // Return the style of this button
        return styleToUse;
    }
}
