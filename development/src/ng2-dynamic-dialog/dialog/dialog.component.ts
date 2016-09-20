// Imports
import { Component, AfterViewChecked, OnInit } from '@angular/core';

import { TsLerp, TsLerpTransition, TsLerpStyle } from 'tslerp';

import { Ng2DynamicDialogContent } from '../styles/content';
import { Ng2DynamicDialogStyle } from '../styles/style';
import { Ng2DynamicDialogBehaviour } from '../styles/behaviour';
import { Ng2DynamicDialogCallbacks } from '../styles/callbacks';

//
// Main dialog component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-modal',

    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],
})
export class Ng2DynamicDialogComponent implements AfterViewChecked, OnInit {

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
    private currentDialogContent: Ng2DynamicDialogContent;
    private nextDialogContent: Ng2DynamicDialogContent;

    private dialogStyle: Ng2DynamicDialogStyle = new Ng2DynamicDialogStyle();
    private dialogBehaviour: Ng2DynamicDialogBehaviour = new Ng2DynamicDialogBehaviour();

    private dialogCallbacks: Ng2DynamicDialogCallbacks = new Ng2DynamicDialogCallbacks();

    private lerpTransition: TsLerpTransition = TsLerpTransition.EaseOut;
    private lerpStyle: TsLerpStyle = TsLerpStyle.Quadratic;

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
    }

    //
    // Called when the view changes
    //
    ngAfterViewChecked() {
    }

    //
    // Sets the style of the dialog
    //
    setStyle(dialogStyle: Ng2DynamicDialogStyle) {
        this.dialogStyle = dialogStyle;
        this.duplicateIdleButtonStyles();
    }

    //
    // Sets the behaviour of this dialog
    //
    setBehaviour(dialogBehaviour: Ng2DynamicDialogBehaviour) {
        this.dialogBehaviour = dialogBehaviour;
    }

    //
    // Sets the callbacks for this dialog
    //
    setCallbacks(dialogCallbacks: Ng2DynamicDialogCallbacks) {
        this.dialogCallbacks = dialogCallbacks;
    }

    //
    // Shows the dialog
    //
    show(dialogContent: Ng2DynamicDialogContent) {

        // Can't do anything if we're currently transitioning
        if (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE) {
            return;
        }

        // Are we already active?
        if (this.isActive === true) {

            // Set what we'll show next
            this.nextDialogContent = dialogContent;

            // Has anything actually changes?
            this.dimensionsChanging = (this.nextDialogContent.height !== this.currentDialogContent.height ||
                this.nextDialogContent.width !== this.currentDialogContent.width);
            this.contentChanging = (this.nextDialogContent.unsafeHtmlContent !== this.currentDialogContent.unsafeHtmlContent ||
                this.nextDialogContent.safeHtmlContent !== this.currentDialogContent.safeHtmlContent ||
                this.nextDialogContent.componentContent !== this.currentDialogContent.componentContent);

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
            this.currentDialogContent = dialogContent;
            this.setDialogTransitionState(this.dialogTransitionStates.TRANSITION_IN);

            // Set our other transition properties
            this.dialogWidth = this.currentDialogContent.width;
            this.dialogHeight = this.currentDialogContent.height;

            this.contentOpacity = 1;

            this.dimensionsChanging = false;
            this.contentChanging = false;

            this.isActive = true;

            // Reset our default colours
            for (let i = 0; i < this.buttonHighlighted.length; i++) {
                this.buttonHighlighted[i] = false;
            }

            // Let the client know
            if (this.dialogCallbacks.onDialogOpening !== null) {
                this.dialogCallbacks.onDialogOpening();
            }
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

            let lerpValues = [[this.currentDialogContent.width, this.nextDialogContent.width],
                [this.currentDialogContent.height, this.nextDialogContent.height]];
            this.dialogTransitionLerp.define(lerpValues, this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionDimensions !== null) {
                this.dialogCallbacks.onTransitionDimensions();
            }

        } else if (transitionState === this.contentTransitionStates.TRANSITION_OUT) {

            this.dialogTransitionLerp.define([[1, 0]], this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionContentHide !== null) {
                this.dialogCallbacks.onTransitionContentHide();
            }

        } else if (transitionState === this.contentTransitionStates.TRANSITION_IN) {

            this.dialogTransitionLerp.define([[0, 1]], this.dialogStyle.transitionTimeContent, this.lerpTransition, this.lerpStyle);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionContentShow !== null) {
                this.dialogCallbacks.onTransitionContentShow();
            }
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
                    if (this.dialogCallbacks.onDialogClosed !== null) {
                        this.dialogCallbacks.onDialogClosed();
                    }
                } else if (this.dialogTransition === this.dialogTransitionStates.TRANSITION_IN) {

                    // Let the client know
                    if (this.dialogCallbacks.onDialogOpened !== null) {
                        this.dialogCallbacks.onDialogOpened();
                    }
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
                this.currentDialogContent = this.nextDialogContent;
            }
        }
    }

    //
    // Called when a button is clicked
    //
    /* tslint:disable:no-unused-variable */
    private onButtonClicked(buttonIndex: number) {
        /* tslint:enable:no-unused-variable */

        // Just call the right callbacks
        if (buttonIndex === 0 && this.dialogCallbacks.onButton1Clicked !== null) {
            this.dialogCallbacks.onButton1Clicked();
        }
        if (buttonIndex === 1 && this.dialogCallbacks.onButton2Clicked !== null) {
            this.dialogCallbacks.onButton2Clicked();
        }
        if (buttonIndex === 2 && this.dialogCallbacks.onButton3Clicked !== null) {
            this.dialogCallbacks.onButton3Clicked();
        }

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
        if (offDialogClick === false && this.dialogCallbacks.onButtonExitClicked !== null) {
            this.dialogCallbacks.onButtonExitClicked();
        }

        // We're exiting now
        if (this.dialogCallbacks.onDialogClosing !== null) {
            this.dialogCallbacks.onDialogClosing();
        }

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
        if (this.dialogCallbacks.onButtonEnter !== null) {
            this.dialogCallbacks.onButtonEnter();
        }
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
        if (this.dialogCallbacks.onButtonExit !== null) {
            this.dialogCallbacks.onButtonExit();
        }
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
