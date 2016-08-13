
//
// Lerps a given set of values over time
//
export class Ng2DynamicDialogLerp {

    private currentTime: number = 0;
    private lerpValues: number[][] = [[0, 0]];
    private duration: number = 1;

    //
    // Sets the lerp values we're aiming for
    //
    setSingleLerp(start: number, end: number, duration: number) {

        this.lerpValues = [[start, end]];

        this.duration = duration;
        this.currentTime = 0;
    }

    //
    // Sets multiple values to be lerped over
    //
    setMultipleLerp(lerpValues: number[][], duration: number) {

        this.lerpValues = lerpValues;

        this.duration = duration;
        this.currentTime = 0;
    }

    //
    // Lerps the given values
    //
    lerp(timeDelta: number): (number | boolean)[] {

        // Increase our time
        this.currentTime += timeDelta;
        this.currentTime = Math.min(this.currentTime, this.duration);

        // Just lerp each element
        let lerpResults: (number | boolean)[] = [];
        for (let index = 0; index < this.lerpValues.length; ++index) {

            // Pull out this set of values
            let currentLerpValues = this.lerpValues[index];

            // Lerp the values
            let lerpDistance = currentLerpValues[1] - currentLerpValues[0];
            let lerpedValue = this.easeOutQuad(currentLerpValues[0], lerpDistance, this.duration, this.currentTime);

            // Add our result
            lerpResults.push(lerpedValue);
        }

        // Have we finished?
        let finished = (this.currentTime === this.duration);
        lerpResults.push(finished);

        // Send back our value
        return lerpResults;
    }

    //
    // Quadratic easing out
    //
    private easeOutQuad(startValue: number, lerpDistance: number, duration: number, currentTime: number): number {

        currentTime /= duration;
        return -lerpDistance * currentTime * (currentTime - 2) + startValue;
    }
}
