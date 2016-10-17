
//
// Requested style for a dialog
//
export class Style {

    background: string = null;
    dialog: string = null;
    title: string = null;

    buttonClose = {
        style: '',
        image: '',
    };
    iconLocked = {
        style: '',
        image: '',
    };

    // Button style
    button = {
        general: {
            idle: '',
            hover: '',
        },
        individial: [
            {
                idle: '',
                hover: '',
            },
            {
                idle: '',
                hover: '',
            },
            {
                idle: '',
                hover: '',
            },
        ],
    };

    buttonText: string = null;
}
