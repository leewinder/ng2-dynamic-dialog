// Imports
import { Component, ViewChild, AfterViewChecked, OnInit } from '@angular/core';

import { Ng2DynamicDialogWrapperComponent } from '../wrapper/wrapper.component';
import { Ng2DynamicDialogIntervals } from '../utilities/intervals';
import { Ng2DynamicDialogLerp } from '../utilities/lerp';

import { Ng2DynamicDialogContent } from '../styles/content';
import { Ng2DynamicDialogStyle } from '../styles/style';
import { Ng2DynamicDialogBehaviour } from '../styles/behaviour';
import { Ng2DynamicDialogCallbacks } from '../styles/callbacks';

import { Ng2DynamicDialogBackgroundComponent } from '../background/background.component';

//
// Main dialog component
//
@Component({

    moduleId: module.id,
    selector: 'ng2-dynamic-dialog-modal',

    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.css'],

    directives: [Ng2DynamicDialogBackgroundComponent, Ng2DynamicDialogWrapperComponent],
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

    // Transitions
    private intervalUpdate = new Ng2DynamicDialogIntervals();

    // Style and behaviour
    private currentDialogContent: Ng2DynamicDialogContent;
    private nextDialogContent: Ng2DynamicDialogContent;

    private dialogStyle: Ng2DynamicDialogStyle = new Ng2DynamicDialogStyle();
    private dialogBehaviour: Ng2DynamicDialogBehaviour = new Ng2DynamicDialogBehaviour();

    private dialogCallbacks: Ng2DynamicDialogCallbacks = new Ng2DynamicDialogCallbacks();

    // Transition lerps
    private dialogTransitionLerp: Ng2DynamicDialogLerp = new Ng2DynamicDialogLerp();
    private dimensionTransitionLerp: Ng2DynamicDialogLerp = new Ng2DynamicDialogLerp();
    private contentTransitionLerp: Ng2DynamicDialogLerp = new Ng2DynamicDialogLerp();

    // Transition properties
    private dialogOpacity: number = 0;

    private dialogWidth: number = 0;
    private dialogHeight: number = 0;

    private contentOpacity: number = 0;

    private contentChanging: boolean = false;
    private dimensionsChanging: boolean = false;

    // Background colour which changes on mouse events as we do not have :hover styles
    private buttonBackgroundColour: string[] = ['', '', ''];

    // Child elements
    @ViewChild(Ng2DynamicDialogBackgroundComponent)
    private dialogBackground: Ng2DynamicDialogBackgroundComponent;

    //
    // Initialisation
    //
    ngOnInit() {
        // Save our default colours
        for (let i = 0; i < this.buttonBackgroundColour.length; i++) {
            this.buttonBackgroundColour[i] = this.dialogStyle.buttonBackgroundColor;
        }
    }

    //
    // Called when the view changes
    //
    ngAfterViewChecked() {

        // Pull out our child elements
        if (this.dialogBackground) {
            this.dialogBackground.modalDialog = this;
        }
    }

    //
    // Sets the style of the dialog
    //
    setStyle(dialogStyle: Ng2DynamicDialogStyle) {

        this.dialogStyle = dialogStyle;

        // Save our button hovers
        for (let i = 0; i < this.buttonBackgroundColour.length; i++) {
            this.buttonBackgroundColour[i] = this.dialogStyle.buttonBackgroundColor;
        }
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
            for (let i = 0; i < this.buttonBackgroundColour.length; i++) {
                this.buttonBackgroundColour[i] = this.dialogStyle.buttonBackgroundColor;
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
            this.dialogTransitionLerp.setSingleLerp(0, 1, this.dialogStyle.transitionTimeDialogs);
        } else if (transitionState === this.dialogTransitionStates.TRANSITION_OUT) {
            this.dialogTransitionLerp.setSingleLerp(1, 0, this.dialogStyle.transitionTimeDialogs);
        }

        // Trigger the interval update
        this.intervalUpdate.trigger((thisDelta: number) => this.intervalCallback(thisDelta));

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
            this.dimensionTransitionLerp.setMultipleLerp(lerpValues, this.dialogStyle.transitionTimeContent);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionDimensions !== null) {
                this.dialogCallbacks.onTransitionDimensions();
            }

        } else if (transitionState === this.contentTransitionStates.TRANSITION_OUT) {

            this.contentTransitionLerp.setSingleLerp(1, 0, this.dialogStyle.transitionTimeContent);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionContentHide !== null) {
                this.dialogCallbacks.onTransitionContentHide();
            }

        } else if (transitionState === this.contentTransitionStates.TRANSITION_IN) {

            this.contentTransitionLerp.setSingleLerp(0, 1, this.dialogStyle.transitionTimeContent);

            // Dimension transition started
            if (this.dialogCallbacks.onTransitionContentShow !== null) {
                this.dialogCallbacks.onTransitionContentShow();
            }
        }

        // Trigger the interval update
        this.intervalUpdate.trigger((thisDelta: number) => this.intervalCallback(thisDelta));

        // Save the new state
        this.contentTransition = transitionState;
    }

    //
    // Called during a transition
    //
    private intervalCallback(thisDelta: number) {

        // Update any transitions
        let finished = false;
        if (this.dialogTransition !== this.dialogTransitionStates.NONE) {

            // Run our lerps
            let lerpResult = this.dialogTransitionLerp.lerp(thisDelta);
            finished = <boolean>lerpResult[lerpResult.length - 1] === true;

            // Update the opacity of the dialog
            this.dialogOpacity = <number>lerpResult[0];

            // If we're done, no more transition (end value is if all are finished)
            if (finished === true) {

                // Finished?
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

            // Update the opacity of the dialog, dialogs are just as they are
            let lerpResult = this.dimensionTransitionLerp.lerp(thisDelta);
            finished = <boolean>lerpResult[lerpResult.length - 1] === true;

            // Get our DIMENSIONS
            this.dialogWidth = <number>lerpResult[0];
            this.dialogHeight = <number>lerpResult[1];

        } else if (this.contentTransition === this.contentTransitionStates.TRANSITION_OUT ||
            this.contentTransition === this.contentTransitionStates.TRANSITION_IN) {

            // Update the opacity of the content
            let lerpResult = this.contentTransitionLerp.lerp(thisDelta);
            finished = <boolean>lerpResult[lerpResult.length - 1] === true;

            // Save our opacity
            this.contentOpacity = <number>lerpResult[0];
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

        // Are we still in a state
        return (this.dialogTransition !== this.dialogTransitionStates.NONE || this.contentTransition !== this.contentTransitionStates.NONE);
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

        // Set the background colours
        this.buttonBackgroundColour[buttonIndex] = this.dialogStyle.buttonHoverColor;

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

        // Set the background colours
        this.buttonBackgroundColour[buttonIndex] = this.dialogStyle.buttonBackgroundColor;

        // Left the button
        if (this.dialogCallbacks.onButtonExit !== null) {
            this.dialogCallbacks.onButtonExit();
        }
    }
}
