// Imports
import { Component, AfterViewChecked, OnInit } from '@angular/core';

import { TsLerp, TsLerpTransition, TsLerpStyle } from 'tslerp';

import { Content } from '../styles/content';
import { Style } from '../styles/style';
import { Behaviour } from '../styles/behaviour';
import { Callbacks } from '../styles/callbacks';

import { CallbackController } from '../controllers/callback-controller';

//
// Main dialog component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-modal',

    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
})
export class DialogComponent implements AfterViewChecked, OnInit {

    // Transition states
    private dialogTransitionStates = {
        NONE: 0,
        TRANSITION_IN: 1,
        TRANSITION_OUT: 2,
    };

    private contentTransitionStates = {
        NONE: 0,

        TRANSITION_IN: 1,
        TRANSITION_OUT: 2,

        DIMENSIONS: 3,
    };

    // Private properties
    private isActive = false;

    private dialogTransition = this.dialogTransitionStates.NONE;
    private contentTransition = this.contentTransitionStates.NONE;

    // Style and behaviour
    private currentContent: Content;
    private nextContent: Content;

    private dialogStyle: Style = new Style();
    private dialogBehaviour: Behaviour = new Behaviour();

    private callbackController: CallbackController = new CallbackController();

    private lerpTransition: TsLerpTransition = TsLerpTransition.EaseOut;
    private lerpStyle: TsLerpStyle = TsLerpStyle.Quadratic;

    // Dialog wrapper callbacks
    private boundOnComponentCreated: Function;
    private boundOnComponentDestroyed: Function;

    // Transition lerps
    private dialogTransitionLerp: TsLerp = new TsLerp();

    // Transition properties
    private dialogOpacity: number = 0;

    private dialogWidth: number = 0;
    private dialogHeight: number = 0;

    private contentOpacity: number = 0;

    private contentChanging: boolean = false;
    private dimensionsChanging: boolean = false;

    // Track which buttons are on or off
    private buttonHighlighted: boolean[] = [false, false, false];

    //
    // Called to initialise the object
    //
    ngOnInit() {
        // Make sure the styles are set correctly
        this.setStyle(this.dialogStyle);

        // Bind the callbacks we will pass to the component wrapper
        this.boundOnComponentCreated = this.onComponentCreated.bind(this);
        this.boundOnComponentDestroyed = this.onComponentDestroyed.bind(this);
    }

    //
    // Called when the view changes
    //
    ngAfterViewChecked() {
    }

    //
    // Sets the style of the dialog
    //
    setStyle(dialogStyle: Style) {
        this.dialogStyle = dialogStyle;
        this.duplicateIdleButtonStyles();
    }

    //
    // Sets the behaviour of this dialog
    //
    setBehaviour(dialogBehaviour: Behaviour) {
        this.dialogBehaviour = dialogBehaviour;
    }

    //
    // Sets the callbacks for this dialog
    //
    setCallbacks(Callbacks: Callbacks) {
        this.callbackController.setCallbacks(Callbacks);
    }

    //
    // Shows the dialog
    //
    show(Content: Content) {

        // Can't do anything if we're currently transitioning
        if (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE) {
            return;
        }

        // Are we already active?
        if (this.isActive === true) {

            // Set what we'll show next
            this.nextContent = Content;

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
            this.currentContent = Content;
            this.setDialogTransitionState(this.dialogTransitionStates.TRANSITION_IN);

            // Set our other transition properties
            this.dialogWidth = this.currentContent.width;
            this.dialogHeight = this.currentContent.height;

            this.contentOpacity = 1;

            this.dimensionsChanging = false;
            this.contentChanging = false;

            this.isActive = true;

            // Reset our default colours
            for (let i = 0; i < this.buttonHighlighted.length; i++) {
                this.buttonHighlighted[i] = false;
            }

            // Let the client know
            this.callbackController.onDialogOpening();
        }
    }

    //
    // Closes the dialog
    //
    close() {
        // Just close it
        this.onCloseDialog(true);
    }

    //
    // Returns if we're in a transition state and can't be modified
    //
    isInTransition(): boolean {
        return (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE);
    }

    //
    // Duplicates any properties not in the button hover style from the idle style
    //
    private duplicateIdleButtonStyles() {

        // Copy over and duplicate the idle properties in hover
        for (let key in this.dialogStyle.button.idle) {

            // If this property does not exist in the hover style, add it
            if (this.dialogStyle.button.idle.hasOwnProperty(key) === true) {

                let hoverValue: any = (<any>this.dialogStyle.button.hover)[key];
                let idleValue: any = (<any>this.dialogStyle.button.idle)[key];

                if (hoverValue == null) {
                    (<any>this.dialogStyle.button.hover)[key] = idleValue;
                }
            }
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
            this.dialogTransitionLerp.define([[0, 1]], this.dialogStyle.transitionTimeDialogs, this.lerpTransition, this.lerpStyle);
        } else if (transitionState === this.dialogTransitionStates.TRANSITION_OUT) {
            this.dialogTransitionLerp.define([[1, 0]], this.dialogStyle.transitionTimeDialogs, this.lerpTransition, this.lerpStyle);
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
            this.dialogTransitionLerp.define(lerpValues, this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            this.callbackController.onTransitionDimensions();

        } else if (transitionState === this.contentTransitionStates.TRANSITION_OUT) {

            this.dialogTransitionLerp.define([[1, 0]], this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            this.callbackController.onTransitionContentHide();

        } else if (transitionState === this.contentTransitionStates.TRANSITION_IN) {

            this.dialogTransitionLerp.define([[0, 1]], this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            this.callbackController.onTransitionContentShow();
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

                    // Let the client know
                    this.callbackController.onDialogClosed();

                } else if (this.dialogTransition === this.dialogTransitionStates.TRANSITION_IN) {

                    // Let the client know
                    this.callbackController.onDialogOpened();
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
    // Called when a component content object is created
    //
    onComponentCreated(component: Component): void {

        // See if we can get the callbacks
        if (typeof ((<any>component).getDialogComponentCallbacks) !== 'undefined') {

            // Get the callbacks from this component
            let componentCallbacks: Callbacks = (<any>component).getDialogComponentCallbacks();
            this.callbackController.setComponentCallbacks(componentCallbacks);
        }
    }

    //
    // Called when a component content object is destroyed
    //
    onComponentDestroyed(): void {
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
    // Closes the dialog
    //
    /* tslint:disable:no-unused-variable */
    private onCloseDialog(offDialogClick: boolean) {
        /* tslint:enable:no-unused-variable */

        // Can't close if we're currently transitioning
        if (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE) {
            return;
        }

        // Do we want to do this if it's an off dialog click?
        if (offDialogClick === true && this.dialogBehaviour.exitOnOffDialogClick === false) {
            return;
        }

        // Did we click the exit button
        if (offDialogClick === false) {
            this.callbackController.onButtonExitClicked();
        }

        // We're exiting now
        this.callbackController.onDialogClosing();

        // We are now transitioning out
        this.setDialogTransitionState(this.dialogTransitionStates.TRANSITION_OUT);
    }

    //
    // Called when the mose moves over a button
    //
    /* tslint:disable:no-unused-variable */
    private onButtonMouseOver(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Highlighted
        this.buttonHighlighted[buttonIndex] = true;

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
        this.buttonHighlighted[buttonIndex] = false;

        // Left the button
        this.callbackController.onButtonExit();
    }

    // Styles

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
        return this.buttonHighlighted[buttonIndex] === true ? this.dialogStyle.button.hover : this.dialogStyle.button.idle;
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
}
