
//
// Requested style for a dialog
//
export class DialogStyle {

    // Background style
    background = {
        'background': '#000000',
        'opacity': 0.4,
    };

    // Dialog style
    dialog = {
        'background-color': '#ffffff',
        'color': '#000000',

        'border-color': '#000000',
        'border-radius.px': 15,

        'border-style': 'solid',
        'border-width.px': 7,

        'font-family': '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
        'font-size.px': 14,
        'font-style': 'normal',

        'padding.px': 20,

    };

    // Button style
    button = {
        'idle': {

            'background-color': '#dddddd',
            'color': '#000000',

            'border-color': '#000000',
            'border-radius.px': 5,

            'border-style': 'solid',
            'border-width.px': 2,

            'font-family': '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
            'font-size.px': 14,
            'font-style': 'normal',

        },
        'hover': {
            'background-color': '#ffffff',
        },
    };

    // Title style
    title = {
        'color': '#000000',

        'font-family': '"Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif',
        'font-size.px': 20,
        'font-style': 'normal',
    };

    // Other buttons
    closeButtonImage: string;

    // Transitions
    transitionTimeDialogs: number = 0.3;
    transitionTimeContent: number = 0.3;
}
