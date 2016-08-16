# ng2-dynamic-dialog

A dynamically adjusting, extensible dialog component for use with Angular 2 supporting raw HTML content and injected custom components.  Contains no dependancies except Angular 2 and those packages required by Angular 2.

<img src="https://cloud.githubusercontent.com/assets/1649415/17697306/020f6b22-63ac-11e6-965a-e561cdcafd53.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17697306/020f6b22-63ac-11e6-965a-e561cdcafd53.gif" width="400""/>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"ng2-dynamic-dialog": "^0.0.2"`
  
  Optionally, you can manually install the package using the npm command line

  `npm install ng2-dynamic-dialog`
  
2. Add ng2-dynamic-dialog to both your `map` and `packages` structures in `systemjs.config.js`

  ```javascript
  var map = {
    ...
    'ng2-dynamic-dialog': 'node_modules/ng2-dynamic-dialog'
  };
  ```
  
  ```javascript
  var packages = {
    ...
    'ng2-dynamic-dialog': { main: 'index.js', defaultExtension: 'js' },
  };
  ```
  
3. Optionally, add the `rootDir` option to `tsconfig.json` to make sure TypeScript's default root path algorithm doesn't pull in the `node_modules` folder


## Usage

All the examples shown below are taken from the [samples application](https://github.com/leewinder/ng2-dynamic-dialog/tree/master/samples).

### Building and Running the Sample Application
Check out the repository, browse to the './samples' folder and run `npm install` to install all the required dependancies.

ng2-dynamic-dialog is developed in [Visual Studio Code](https://code.visualstudio.com/) so once `npm install` has finished you should be able to open the './samples' folder in VS Code and it will run out of the box (by default it uses lite-server which is installed as part of `npm install`).

If you are not using Visual Studio Code, browse to the './samples' folder and run `tsc` to build the application.  Then open your local server of choice pointing to ./samples as the root directory.

### Triggering Basic Dialogs
<img src="https://cloud.githubusercontent.com/assets/1649415/17703006/123c9a58-63c8-11e6-9acd-df1bde4dd555.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17703006/123c9a58-63c8-11e6-9acd-df1bde4dd555.gif" width="400""/>

The simplest way to show a dialog is to use the custom style and simply provide custom HTML which will fill in the content of the dialog.  This can be seen in [default-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/dialogs/default-with-html-dialog/default-with-html-dialog.component.ts).

```TypeScript
// default-with-html-dialog.component.ts

import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogContent } from 'ng2-dynamic-dialog';

...

export class DefaultWithHtmlDialogComponent {

  ...
  // Shows the dialog
  show() {

      // Create an instance of the dialog content to specify what will be shown
      let dialogContent = new Ng2DynamicDialogContent();

      // Set the custom content of the dialog
      dialogContent.title = 'Default Style Dialog';
      dialogContent.unsafeHtmlContent = `<center>A dialog using out-of-the-box styles.<br><br>
      The content is specified using 'Ng2DynamicDialogContent'.<br><br>

      By default there is no exit button, and the user needs to click outside the dialog to close it.<br><br><br>

      Note that raw HTML will be sanitized by default.</center>`;

      // This can be left out to allow the dialog to resize based on the size of the host window
      dialogContent.width = 450;
      dialogContent.height = 220;

      // Show the dialog on screen
      this.modalDialog.show(dialogContent);
  }
}
```

To extract the dialog to show, the examples simply added the component tag to the HTML, and use `@ViewChild` to keep a local copy of the component, though this is not required and can be done however you prefer.

```HTML
<!-- default-with-html-dialog.component.html -->
<ng2-dynamic-dialog-modal></ng2-dynamic-dialog-modal>
```

```TypeScript
// default-with-html-dialog.component.ts

@Component({

    moduleId: module.id,
    selector: 'default-with-html-dialog',

    templateUrl: 'default-with-html-dialog.component.html',
    styleUrls: ['default-with-html-dialog.component.css'],

    directives: [Ng2DynamicDialogComponent],
})
export class DefaultWithHtmlDialogComponent {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;
    
    ...
}
```

### Triggering Dialogs With Custom Style
<img src="https://cloud.githubusercontent.com/assets/1649415/17703101/6fe8ac50-63c8-11e6-8c4c-8f0321143e77.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17703101/6fe8ac50-63c8-11e6-8c4c-8f0321143e77.gif" width="400""/>

Once a dialog is being triggered, you can use 'Ng2DynamicDialogStyle' to customise how the dialog looks.  This can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
    // Sets the style of the dialog
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        // Dialog style
        dialogStyle.dialogBorderColor = '#44086C';

        dialogStyle.dialogFontFamily = 'Architects Daughter, cursive';
        dialogStyle.dialogFontSize = '14';

        dialogStyle.dialogBorderRadius = 20;

        // Button style
        dialogStyle.buttonBackgroundColor = '#611F8E';
        dialogStyle.buttonBorderColor = '#44086C';
        dialogStyle.buttonHoverColor = dialogStyle.buttonBorderColor;

        dialogStyle.buttonBorderRadius = 10;

        dialogStyle.buttonFontFamily = dialogStyle.dialogFontFamily;
        dialogStyle.buttonFontSize = dialogStyle.dialogFontSize;

        dialogStyle.buttonFontColor = '#ffffff';

        // Title style
        dialogStyle.titleFontFamily = dialogStyle.dialogFontFamily;

        // Other buttons
        dialogStyle.closeButtonImage = 'assets/close.png';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }
```

Once shown, the dialog will use the defined styles to present the dialog as required.  The available options can be seen in [ng2-dynamic-dialog/styles/style.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/style.ts)

### Triggering Dialogs With Custom Components
<img src="https://cloud.githubusercontent.com/assets/1649415/17703216/d6144b42-63c8-11e6-8f1f-a1dc86ca4227.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17703216/d6144b42-63c8-11e6-8f1f-a1dc86ca4227.gif" width="400""/>

If you have dialog content that is more complicated than standard HTML can provide, or you need to provide internal behaviour within the dialog, you can pass components to the dialog to be rendered.  This will create an instance of your component within the dialog's HTML tree and behaves like any other instantiated component.

Passing a custom component can be seen in [custom-component-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/dialogs/custom-component-dialog/custom-component-dialog.component.ts).

```TypeScript
  // Shows the sign in dialog
  requestUserSignIn() {

      ...

      // Set the content
      let dialogContent = new Ng2DynamicDialogContent();

      // Show our dialog
      dialogContent.title = 'Log In or Sign Up';

      // We need to use both buttons for this dialog
      dialogContent.button1 = 'Log In';
      dialogContent.button2 = 'Sign Up';
  
      // Set the dimensions to adequatly cover the components render area
      dialogContent.height = 300;
      dialogContent.width = 300;

      // Pass through the type of component you wish to be rendered inside the dialog
      dialogContent.componentContent = LogInComponent;

      this.modalDialog.show(dialogContent);
  }
```

In the above example, we are creating an instance of 'LogInComponent' which can be seen in [custom-component-dialog/content/login](https://github.com/leewinder/ng2-dynamic-dialog/tree/master/samples/src/dialogs/custom-component-dialog/content/login).  Once running, the 'LogInComponent' will then run as any other component.

### Transitioning Between Dialogs
<img src="https://cloud.githubusercontent.com/assets/1649415/17703280/06a1fb92-63c9-11e6-8d52-d751fa4fec6f.gif" data-canonical-src="https://cloud.githubusercontent.com/assets/1649415/17703280/06a1fb92-63c9-11e6-8d52-d751fa4fec6f.gif" width="400""/>

You can use ng2-dynamic-dialog to automatically to transition between different dialogs by changing the content of 'Ng2DynamicDialogContent' once the dialog is already being rendered.  A simple example of this can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
  // Shows the default dialog content
  private showDefaultDialogContent() {

      let dialogContent = new Ng2DynamicDialogContent();

      dialogContent.height = 300;
      dialogContent.width = 450;

      dialogContent.title = 'Custom Style Dialog';
      dialogContent.button3 = 'Show More Content';

      dialogContent.safeHtmlContent = this._sanitizer.bypassSecurityTrustHtml(this.defaultHtmlContent);

      this.modalDialog.show(dialogContent);
  }

  // Shows the default dialog content
  private showSwitchedDialogContent() {

      let dialogContent = new Ng2DynamicDialogContent();

      dialogContent.height = 230;
      dialogContent.width = 450;

      dialogContent.title = 'Custom Style Dialog';
      dialogContent.button2 = 'Cancel';

      dialogContent.safeHtmlContent = this._sanitizer.bypassSecurityTrustHtml(this.switchedToHtmlContent);

      this.modalDialog.show(dialogContent);
  }
```

When 'showDefaultDialogContent' is called, it will present the dialog with the default content.  When the button 'Show More Content' is pressed, showSwitchedDialogContent is called and the dialog is show again.  As it is already visible, the content and dimensions automatically transition between the two states.

Automatic transitioning of states works for both HTML and custom component content.

### Responding to events

The dialog provides hooks to various events within the dialogs lifecycle using 'Ng2DynamicDialogCallbacks' and can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
  // Sets the callbacks of the dialog
  private setDialogCallbacks() {

      // Initialise the style of the dialog
      let dialogCallbacks = new Ng2DynamicDialogCallbacks();

      // Set the local callbacks for the buttons we are using
      dialogCallbacks.onButton2Clicked = () => this.onButton2Selected();
      dialogCallbacks.onButton3Clicked = () => this.onButton3Selected();

      this.modalDialog.setCallbacks(dialogCallbacks);
  }
```

When the user clicks either the 2nd or 3rd button (when they are visible) the callbacks are automatically raised and the dialog can respond as needed.  In the above case, the buttons are used to transition between different dialog states.

Note the format of the how the callbacks are assigned, this is due to how `this` is [scoped in the transpiled JavaScript](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-does-this-get-orphaned-in-my-instance-methods).

The available callbacks can be seen in [ng2-dynamic-dialog/styles/callbacks.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/callbacks.ts)

### Modifying a dialogs behaviour

The overall behaviour of the dialog can be specified by using 'Ng2DynamicDialogBehaviour', and the available options can be seen in [ng2-dynamic-dialog/styles/behaviour.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/behaviour.ts).
