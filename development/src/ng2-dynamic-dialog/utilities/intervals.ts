
//
// Updates intervals until complete and calls a callback when done
//
export class Ng2DynamicDialogIntervals {

    // Private properties
    private setIntervalHandle: any = null;
    private setIntervalLastTime: number = 0;

    private intervalCallback: any = null;

    // Constants
    private static get DEFAULT_MILLISECOND_INTERVAL(): number { return 33; }

    //
    // Triggers the interval update to start
    //
    trigger(intervalCallback: (timeDelta: number) => boolean) {

        // If we have a valid interval, don't bother
        if (this.setIntervalHandle !== null) {
            return;
        }

        // Get the time before we start
        this.setIntervalLastTime = (new Date()).getTime();

        // Save the callback and start the intervals
        this.intervalCallback = intervalCallback;
        this.setIntervalHandle = setInterval(() => this.setIntervalCallback(), Ng2DynamicDialogIntervals.DEFAULT_MILLISECOND_INTERVAL);
    }

    //
    // Interval callback
    //
    private setIntervalCallback() {

        // Before we get the callback, callculate the time difference
        let currentTime = (new Date()).getTime();
        let timeDelta = (currentTime - this.setIntervalLastTime) / 1000;

        // Trigger the callback
        let continueWithInterval: boolean = this.intervalCallback(timeDelta);

        // Save our callback time
        this.setIntervalLastTime = currentTime;

        // Should we continue
        if (continueWithInterval === false) {
            clearInterval(this.setIntervalHandle);
            this.setIntervalHandle = null;
        }
    }

}
