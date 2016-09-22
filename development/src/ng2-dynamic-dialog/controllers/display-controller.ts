// Imports
import { TsLerp, TsLerpTransition, TsLerpStyle } from 'tslerp';

import { Style } from '../styles/style';
import { Behaviour } from '../styles/behaviour';
import { Content } from '../styles/content';

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
    };

    public buttonState = {
        IDLE: 0,
        HOVER: 1,
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

    private contentChanging: boolean = false;
    private dimensionsChanging: boolean = false;

    // Cancel button properties
    private cancelButtonImage: string = null;

    // Track which buttons are on or off
    private currentButtonStates: number[] = [this.buttonState.IDLE, this.buttonState.IDLE, this.buttonState.IDLE];

    // Callbacks
    private dialogShownCallback: () => void;
    private dialogClosedCallback: (offDialogClick: boolean) => void;

    private dialogTransitionCallback: (transitionState: number) => void;
    private contentTransitionCallback: (transitionState: number) => void;

    //
    // Constructor
    //
    constructor() {
        // Make sure our hover styles are duplicated
        this.duplicateIdleButtonStyles();
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

        // Make sure our hover styles are duplicated
        this.duplicateIdleButtonStyles();

        // Get our cancel button properties
        this.getCancelButtonStyles();
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
        dialogTransitionCallback: (transitionState: number) => void,
        contentTransitionCallback: (transitionState: number) => void) {

        // Just save them
        this.dialogShownCallback = dialogShownCallback;
        this.dialogClosedCallback = dialogClosedCallback;

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

        // Can't do anything if we're currently transitioning
        if (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE) {
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

        // Can't close if we're currently transitioning
        if (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE) {
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
    // Returns if we're in a transition state and can't be modified
    //
    inTransition(): boolean {
        return (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE);
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

        } else if (transitionState === this.contentTransitionStates.TRANSITION_OUT) {
            this.dialogTransitionLerp.define([[1, 0]], this.dialogBehaviour.transitionTimeContent, this.lerpTransition, this.lerpStyle);
        } else if (transitionState === this.contentTransitionStates.TRANSITION_IN) {
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
        }

        // If we finished, we're good
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
    // Duplicates any properties not in the button hover style from the idle style
    //
    private duplicateIdleButtonStyles() {

        // Copy the general properties
        this.copyObjectProperties(this.dialogStyle.button.general.idle, this.dialogStyle.button.general.hover);

        // Now duplicate the indivial buttons
        for (let i = 0; i < this.dialogStyle.button.individial.length; ++i) {
            this.copyObjectProperties(this.dialogStyle.button.individial[i].idle, this.dialogStyle.button.individial[i].hover);
        }
    }

    //
    // Copies the elements from one object into another
    //
    private copyObjectProperties(source: any, destination: any) {

        // Copy over and duplicate the idle properties in hover
        for (let key in source) {

            // If this property does not exist in the hover style, add it
            if (source.hasOwnProperty(key) === true) {

                let hoverValue: any = (<any>destination)[key];
                let idleValue: any = (<any>source)[key];

                if (hoverValue == null) {
                    (<any>destination)[key] = idleValue;
                }
            }
        }
    }

    //
    // Gets the properties of the cancel button
    //
    private getCancelButtonStyles() {

        this.cancelButtonImage = null;
        if (this.dialogStyle.cancelButton.source != null) {

            // Do we have a string?
            if (this.dialogStyle.cancelButton.source.length !== 0) {
                this.cancelButtonImage = this.dialogStyle.cancelButton.source;
            }

            // Lose it from the properties
            delete this.dialogStyle.cancelButton.source;
        }
    }
    //
    // Called to set the style of the modal
    //
    /* tslint:disable:no-unused-variable */
    private setStyleModalDialog() {
        /* tslint:enable:no-unused-variable */

        // Add our properties
        (<any>this.dialogStyle.dialog)['width.px'] = this.dialogWidth;
        (<any>this.dialogStyle.dialog)['height.px'] = this.dialogHeight;

        (<any>this.dialogStyle.dialog)['opacity'] = this.dialogOpacity;

        return this.dialogStyle.dialog;
    }

    //
    // Called to set the style of the title string of the dialog
    //
    /* tslint:disable:no-unused-variable */
    private setStyleTitle() {
        /* tslint:enable:no-unused-variable */

        // Return our title style
        return this.dialogStyle.title;
    }

    //
    // Called to set the style of a given button
    //
    /* tslint:disable:no-unused-variable */
    private setStyleButton(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Simply return our style based on our behaviour
        return this.currentButtonStates[buttonIndex] === this.buttonState.HOVER ?
            this.dialogStyle.button.general.hover : this.dialogStyle.button.general.idle;
    }

    //
    // Sets the style of the dialog background
    //
    /* tslint:disable:no-unused-variable */
    private setStyleBackground() {
        /* tslint:enable:no-unused-variable */

        // Return our background style
        return this.dialogStyle.background;
    }

    //
    // Sets the style of the cancel button
    //
    /* tslint:disable:no-unused-variable */
    private setStyleCancelButton() {
        /* tslint:enable:no-unused-variable */

        // Return our background style
        return this.dialogStyle.cancelButton;
    }
}
