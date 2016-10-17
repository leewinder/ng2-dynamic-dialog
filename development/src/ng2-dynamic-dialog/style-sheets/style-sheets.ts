
//
// Maintains style sheet lists for display
//
export class StyleSheets {

    private static cachedStyles: any = {};

    //
    // Caches a style for us to use later
    //
    static cacheStyle(styleName: string): any {

        let styleAttributes: any = StyleSheets.getStyleAttributes(styleName);
        if (styleAttributes === null) {
            console.warn(`ng2-dynamic-dialog: Unable to find ${styleName}`);
            return null;
        }

        // we have the style, cache it
        StyleSheets.cachedStyles[styleName] = styleAttributes;
        return styleAttributes;
    }

    //
    // Merges the given set of styles into a single style
    //
    static mergeStyles(styleList: string[]): any {

        let styleToReturn: any = {};
        for (let i = 0; i < styleList.length; ++i) {

            // Get this style
            let thisStyleName: any = styleList[i];
            let thisStyle: any = StyleSheets.cachedStyles[thisStyleName];
            if (thisStyle === null || thisStyle === undefined) {

                // Try and cache this style
                thisStyle = StyleSheets.cacheStyle(thisStyleName);
                if (thisStyle === null) {
                    continue;
                }
            }

            // Add all these properties, we'll override any existing ones
            for (let attrname in thisStyle) {

                // Check the attrbute name
                // This also removes the for...in... tslint warning
                if (attrname === null || attrname === undefined) {
                    continue;
                }

                // Using hasOwnProperty in Firefox skips all properties
                // if (thisStyle.hasOwnProperty(attrname)) {

                // We need to make some checks on what we are passing through
                let isNaN: boolean = Number.isNaN(Number(attrname));
                let isCssText: boolean = attrname.toLowerCase() === 'csstext';

                // Check we actually want this property
                if (isNaN === true && isCssText === false) {

                    // Again, check this is a value we want
                    let isString = typeof thisStyle[attrname] === 'string' || thisStyle[attrname] instanceof String;

                    if (thisStyle[attrname] != null && isString === true && thisStyle[attrname].length > 0) {
                        styleToReturn[attrname] = thisStyle[attrname];
                    }
                }

                // } // if (thisStyle.hasOwnProperty(attrname))
            }

        }

        // Send the style back
        return styleToReturn;
    }

    //
    // Get's a style object
    //
    private static getStyleAttributes(styleName: string) {

        // Make sure the class name starts with a period
        styleName = styleName.toLocaleLowerCase();
        if (styleName.startsWith('.') === false) {
            styleName = '.' + styleName;
        }

        // Spin through all the style sheets, looking for this one
        for (let i = 0; i < document.styleSheets.length; ++i) {

            // Classes list depends on the browser
            let rulesList: any = null;
            try {
                // In Firefox, if stylesheet originates from a different domain, trying
                // to access ss.cssRules will throw a SecurityError
                rulesList = (<any>document.styleSheets[i]).rules || (<any>document.styleSheets[i]).cssRules;
            } catch (e) {
                // Rethrow exception if it's not a SecurityError. Note that SecurityError
                // exception is specific to Firefox.
                if (e.name !== 'SecurityError') {
                    throw e;
                }
            }
            if (rulesList != null) {

                // Spin through all the rules, looking for this one
                for (let x = 0; x < rulesList.length; x++) {

                    // We don't always have one
                    if (rulesList[x].selectorText != null) {

                        // Since Angular appends scope info to the style names, we need to find
                        // ones that _start_ with what we're looking for
                        let selectorFound: boolean = StyleSheets.checkSelectorName(rulesList[x].selectorText, styleName);
                        if (selectorFound === true) {
                            return rulesList[x].style;
                        }
                    }
                }
            }
        }

        // We cant find it
        return null;
    }

    //
    // Returns if the selector name is the one we're looking for
    //
    private static checkSelectorName(thisSelector: string, targetSelector: string): boolean {

        // Check we have what we need
        if (thisSelector === null || targetSelector === null) {
            return false;
        }

        // Angular 2 appends (depending on scope) a '[_ngcontent-ccc-n]' element
        // though I cannot guarentee that will always be the case, so I'm assuming
        // (hopefully with some confidence) it will always start with [_.
        // Since it appends modifiers after the appended string e.g. blab[]:hover
        // we need to remove the appended data to get the original name
        let strippedSelectorString: string = thisSelector.replace(/\[_(.*?)\]/, '');
        let selectorNameToCheck = strippedSelectorString.toLocaleLowerCase();

        // The names should now be equal
        return selectorNameToCheck === targetSelector;
    }

}
