
//
// Keeps track of currently generated display styles
//
export class CachedDisplayStyles {

    background: any = null;

    dialog: any = null;
    title: any = null;

    closeButton: any = null;
    lockedImage: any = null;

    buttonText: any = null;

    //
    // Clears the cached styles
    //
    clear() {
        this.background = null;
        this.dialog = null;
        this.title = null;
        this.closeButton = null;
        this.lockedImage = null;
        this.buttonText = null;
    }
}
