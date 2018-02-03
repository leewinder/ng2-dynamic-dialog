# ng2-dynamic-dialog

## Build Status

[![npm version](https://badge.fury.io/js/ng2-dynamic-dialog.svg)](https://badge.fury.io/js/ng2-dynamic-dialog)

**Master Branch**

[![Build Status](https://travis-ci.org/leewinder/ng2-dynamic-dialog.svg?branch=master)](https://travis-ci.org/leewinder/ng2-dynamic-dialog) 
[![Dependency Status](https://dependencyci.com/github/leewinder/ng2-dynamic-dialog/badge)](https://dependencyci.com/github/leewinder/ng2-dynamic-dialog)

**Develop Branch**

[![Build Status](https://travis-ci.org/leewinder/ng2-dynamic-dialog.svg?branch=develop)](https://travis-ci.org/leewinder/ng2-dynamic-dialog) 

<br>

## Overview

A dynamically adjusting, extensible dialog component for use with Angular 2 supporting raw HTML content and injected custom components.

![](https://cloud.githubusercontent.com/assets/1649415/18934359/218a414c-85d1-11e6-958f-3de93f02e865.gif)

<br>

## Dependancies
Currently built against Angular ^5.2.3 and Typescript ^2.6.2

ng2-dynamic-dialog has the following additional dependancies
- [TsLerp](https://www.npmjs.com/package/tslerp): Typescript library for lerping single and multi-sample data sets over time

<br>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"ng2-dynamic-dialog": "^5.0.0"`
  
  Optionally, you can manually install the package using the npm command line

  `npm install ng2-dynamic-dialog`
  
2. Add ng2-dynamic-dialog to both your `map` and `packages` structures in `systemjs.config.js`

  ```javascript
  var map = {
    ...
    'tslerp': 'node_modules/tslerp',
    'ng2-dynamic-dialog': 'node_modules/ng2-dynamic-dialog'
  };
  ```
  
  ```javascript
  var packages = {
    ...
    'tslerp': { main: 'index.js', defaultExtension: 'js' },
    'ng2-dynamic-dialog': { main: 'index.js', defaultExtension: 'js' },
  };
  ```
  
3. Optionally, add the `rootDir` option to `tsconfig.json` to make sure TypeScript's default root path algorithm doesn't pull in the `node_modules` folder

<br>

## Usage

All the examples shown below are taken from the [samples application](https://github.com/leewinder/ng2-dynamic-dialog/tree/master/samples).

<br>

### Building and Running the Sample Application
Check out the repository, browse to the './samples' folder and run `npm install` to install all the required dependancies.

**Note**: Running `npm install` on the sample project requires that Python 2.7.x is available on the command line as it runs a couple of Python scripts to correctly set up the npm_modules folder.

ng2-dynamic-dialog is developed in [Visual Studio Code](https://code.visualstudio.com/) so once `npm install` has finished you should be able to open the './samples' folder in VS Code and it will run out of the box (by default it uses lite-server which is installed as part of `npm install`).

If you are not using Visual Studio Code, browse to the './samples' folder and run `tsc` to build the application.  Then open your local server of choice pointing to ./samples as the root directory.

<br>

### Importing The 'ng2-dynamic-dialog' Module
To use ng2-dynamic-dialog, you need to import the Ng2DynamicDialogModule into the relevent module in your application.  In the sample application this is done in the entry module - [app.module.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/app.module.ts)

```TypeScript
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { Ng2DynamicDialogModule }  from 'ng2-dynamic-dialog';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        
        Ng2DynamicDialogModule,
    ],

    bootstrap: [
        AppComponent,
    ],
})
export class AppModule { }
```

<br>

### Triggering Basic Dialogs
![](https://cloud.githubusercontent.com/assets/1649415/18934038/8a43d772-85cf-11e6-9c4d-2ada789db4ee.gif)

The simplest way to show a dialog is to use the custom style and simply provide custom HTML which will fill in the content of the dialog.  This can be seen in [default-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/default-with-html-dialog/default-with-html-dialog.component.ts).

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

To identify the dialog to show, the example simply added the component tag to the HTML, and uses `@ViewChild` to keep a local copy of the component.  This is not required and can be done however you prefer.

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
})
export class DefaultWithHtmlDialogComponent {

    @ViewChild(Ng2DynamicDialogComponent)
    private modalDialog: Ng2DynamicDialogComponent;
    
    ...
}
```

<br>

### Triggering Dialogs With Custom Style
![](https://cloud.githubusercontent.com/assets/1649415/18934130/081fb4f4-85d0-11e6-8971-c9170218cf74.gif)

Once a dialog is being triggered, you can use 'Ng2DynamicDialogStyle' to customise how the dialog looks.  This can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
    // Sets the style of the dialog
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        dialogStyle.background = 'ng2-dynamic-dialog-samples-custom-style-background';
        dialogStyle.dialog = 'ng2-dynamic-dialog-samples-custom-style-dialog';
        dialogStyle.title = 'ng2-dynamic-dialog-samples-custom-style-title';

        dialogStyle.buttonClose.image = 'assets/close.png';

        dialogStyle.button.general.idle = 'ng2-dynamic-dialog-samples-custom-style-button';
        dialogStyle.button.general.hover = 'ng2-dynamic-dialog-samples-custom-style-button:hover';

        dialogStyle.button.individial[0].idle = 'ng2-dynamic-dialog-samples-custom-style-button-0';
        dialogStyle.button.individial[1].idle = 'ng2-dynamic-dialog-samples-custom-style-button-1';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }
```

Each element is styled providing the name of an existing CSS class which is then applied to the dialog when it is displayed.  The default styles specified can be seen in [ng2-dynamic-dialog/background/background.component.css](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/background/background.component.css) and [ng2-dynamic-dialog/dialog/dialog.component.css](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/dialog/dialog.component.css)

For more information on custom styles and how they are used, see 'Styling Dialogs' below.

<br>

### Triggering Dialogs With Custom Components
![](https://cloud.githubusercontent.com/assets/1649415/18934429/8f43d32e-85d1-11e6-9449-148ea0c30e6d.gif)

If you have content that is more complicated than standard HTML can provide, or you need to provide internal behaviour within the dialog itself, you can pass components to the dialog to be rendered.  This will create an instance of your component within the dialog's HTML tree and behaves like any other instantiated component.

Passing a custom component can be seen in [custom-component-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/custom-component-dialog/custom-component-dialog.component.ts).

```TypeScript
  // Shows the sign in dialog
  requestUserSignIn() {

      ...

      // Set the content
      let dialogContent = new Ng2DynamicDialogContent();

      ...

      // Pass through the type of component you wish to be rendered inside the dialog
      dialogContent.componentContent = LogInComponent;

      this.modalDialog.show(dialogContent);
  }
```

In the above example, we are creating an instance of 'LogInComponent' which can be seen in [custom-component-dialog/content/login](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/custom-component-dialog/content/login/login.component.ts).  Once running, the 'LogInComponent' will then run as any other component.

**Note**: For ng2-dynamic-dialog to successfully create an instance of your custom component, your component must be declared in the relevant modules 'entryComponents'.  

In the sample application this is done in the entry module - [app.module.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/app.module.ts)

```TypeScript
import { LogInComponent } from './components/dialogs/custom-component-dialog/content/login/login.component';
import { SignUpComponent } from './components/dialogs/custom-component-dialog/content/signup/signup.component';

@NgModule({
    ...

    entryComponents: [
        SignUpComponent,
        LogInComponent,
    ],
    
    ...
})
export class AppModule { }
```

<br>

### Transitioning Between Dialogs
![](https://cloud.githubusercontent.com/assets/1649415/18934640/da7e8e00-85d2-11e6-8bb1-46ec26639f4d.gif)

You can use ng2-dynamic-dialog to automatically transition between different dialogs by changing the content of 'Ng2DynamicDialogContent' once the dialog is already being rendered.  A simple example of this can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

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

      // This is called when the dialog is already shown, causing a transition from one to the other
      this.modalDialog.show(dialogContent);
  }
```

When 'showDefaultDialogContent' is called, it will present the dialog with the default content.  When the button 'Show More Content' is pressed, showSwitchedDialogContent is called and the dialog is show again.  As it is already visible, the content and dimensions automatically transition between the two states.

Automatic transitioning of states works for both HTML and custom component content.

<br>

### Locking dialogs

Dialogs can be locked, which removes the buttons, stops users from closing the dialog and displays an optional progress icon.  This is useful when a dialog is communicating with servers or is otherwise busy and cannot be modified.
![](https://cloud.githubusercontent.com/assets/1649415/18935096/b851fe5e-85d5-11e6-9ff3-219019b930a1.gif)

Locking a dialog is as simple as calling [Ng2DynamicDialogComponent lock(instant: boolean)] or [Ng2DynamicDialogComponent unlock(instant: boolean)] to release it and can be seen in [locked-content.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/locked-component-dialog/locked-content/locked-content.component.ts).

The boolean parameter specifies if the lock should be instant or whether there should be a transition between the current and next state.  Regardless of whether true or false is provided, the callback order is the same.

Once locked, the buttons will be removed and any custom components can hook into the 'Ng2DynamicDialogCallbacks' options to detect when the lock has started or finished and disable any custom elements that are currently being shown.

Again, this can be seen in [locked-content.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/locked-component-dialog/locked-content/locked-content.component.ts).

The locked icon is used if it has been provided in the Ng2DynamicDialogStyle object as described below in 'Styling Locked Icons'.

<br>

### Responding to events

The dialog provides hooks to various events within the dialogs lifecycle using 'Ng2DynamicDialogCallbacks' and can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbackResult } from 'ng2-dynamic-dialog';

  // Sets the callbacks of the dialog
  private setDialogCallbacks() {

      // Initialise the style of the dialog
      let dialogCallbacks = new Ng2DynamicDialogCallbacks();

      // Set the local callbacks for the buttons we are using
      dialogCallbacks.onButton1Clicked = () => this.onButton1Selected();
      dialogCallbacks.onButton2Clicked = () => this.onButton2Selected();
      dialogCallbacks.onButton3Clicked = () => this.onButton3Selected();

      this.modalDialog.setCallbacks(dialogCallbacks);
  }
  
  // Called when the event is triggered
  private onButton1Selected(): Ng2DynamicDialogCallbackResult {
    
    // Do what ever work is required

    // Doesn't matter what you return in this callback, so just return .None
    return Ng2DynamicDialogCallbackResult.None;
  }
```

When the user clicks any of the buttons the callbacks are automatically raised and the dialog can respond as needed.  In the above case, the buttons are used to transition between different dialog states.

Note the format of the how the callbacks are assigned, this is due to how `this` is [scoped in the transpiled JavaScript](https://github.com/Microsoft/TypeScript/wiki/FAQ#why-does-this-get-orphaned-in-my-instance-methods).

The available callbacks can be seen in [ng2-dynamic-dialog/styles/callbacks.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/callbacks.ts)

<br>

### Styling Dialogs
All dialogs, whether they are HTML or custom component dialogs, are styled using Ng2DynamicDialogStyle.  This object allows you to specify the style of the following properties
* Full screen background
* Dialog body and content
* Title
* Buttons (both generically and individually for both idle and hover states)
* Button text
* Cancel button
* Locked icon

![](https://cloud.githubusercontent.com/assets/1649415/18934640/da7e8e00-85d2-11e6-8bb1-46ec26639f4d.gif)

For every stylable element, you can provide a CSS style which is applied when the dialog is displayed.  There is no restriction on which CSS attributes can be defined within the custom CSS styles, offering significant control over how the dialog looks.

The following shows how one of the samples defines the styles using CSS classes and then defines them using Ng2DynamicDialogStyle
* [styled-with-html-dialog.component.css](https://github.com/leewinder/ng2-dynamic-dialog/blob/develop/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.css)
* [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/develop/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts)


#### CSS Class Priorities

When applying styles, multiple CSS classes can be provided, each of which build up on the properties of another.  For example, given the following in-built style for the dialog background

```
.ng2-dynamic-dialog-background {

    position: fixed;

    left: 0;
    right: 0;
    top: 0;

    width: 100%;
    height: 100%;

    background: #000000;
    opacity: 0.4;
}
```

If the user want's to provide their own styles, those attributes will (if already defined in the in-built style- be over-ridden.  So if the client style looks like the following

```
.my-ng2-dynamic-dialog-background-override {

    background: #FF0000;
}
```

The final applied style will be the following

```
{

    position: fixed;

    left: 0;
    right: 0;
    top: 0;

    width: 100%;
    height: 100%;

    background: #FF0000;  // This colour in the final style is now over-ridden
    opacity: 0.4;
}
```

#### Styling Buttons
The buttons contained within the dialog require a bit more work to be fully styled due to the various states they can be in
* Generic button style either idle or hovered
* Individual button style either idle or hovered

As a result, the Ng2DynamicDialogStyle.buttons member requires styles for general idle and hover states, plus allowing you to specify idle and hover states for the individual buttons within the dialog.  The structure you can modify is defined in [ng2-dynamic-dialog/styles/style.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/style.ts).

```TypeScript
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
```

There is also a hierarchy to how the button styles are used
* The in-built idle button style is applied first
* The users idle button is then applied if provided
* The in-built button specific style is then applied
* The users button specific style is then applied if provided
* If the button is currently in a hover state
 * The in-built hover style is applied
 * The users hover style is applied

As with all over styles, later styles build on-top of previous styles meaning only changes to the style of the button need to be defined.

```TypeScript
  // Sets the style of the dialog
  private setDialogStyles() {
  
      // Initialise the style of the dialog
      let dialogStyle = new Ng2DynamicDialogStyle();
      
      ...
  
      dialogStyle.button.general.idle = 'ng2-dynamic-dialog-samples-custom-style-button';
      dialogStyle.button.general.hover = 'ng2-dynamic-dialog-samples-custom-style-button:hover';

      dialogStyle.button.individial[0].idle = 'ng2-dynamic-dialog-samples-custom-style-button-0';
      dialogStyle.button.individial[1].idle = 'ng2-dynamic-dialog-samples-custom-style-button-1';
      
      ...
  
      // Set it
      this.modalDialog.setStyle(dialogStyle);
  }
```

#### Styling Cancel Buttons and Locked Icons
The cancel button and locked icon is styled like any other property using the 'style' element of Ng2DynamicDialogStyle.buttonClose or Ng2DynamicDialogStyle.iconLocked.  You also need to specify the image using the 'image' element.

```
    buttonClose = {
        style: '',
        image: '',
    };
    iconLocked = {
        style: '',
        image: '',
    };
```

This can be seen in [locked-component-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/locked-component-dialog/locked-component-dialog.component.ts)

```TypeScript
     private setDialogStyles() {

        ...

        dialogStyle.buttonClose.image = 'assets/close.png';
        dialogStyle.iconLocked.image = 'assets/locked-icon.gif';

        ...

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }
```

#### CSS Class Naming Recommendations
To apply the class styles to the dialog, ng2-dynamic-dialog is required to search though all the available styles. modify them and apply them in the correct order.  As such, there are a number of recommendations on how the styles should be defined
* Give them a unique and descriptive name - if there is a style name clash, there is a chance the wrong one will be used.  As such, giving the style a name which identifies it clearly is recommended (e.g. [project-name]-dialog-style-override-[dialog-element]
* Define a single style for all dialogs if they share the same look - since the style needs to be found before being used, having to find the same style multiple times can cause performance issues

<br>

### Component Level Control
By default, the flow of events and input response is handled at the dialog level via the Ng2DynamicDialogComponent as described in the previous sections.  But there are times when a Custom Component will need to handle user input or control the behaviour of the dialog without passing that control back to the Ng2DynamicDialogComponent instance.

When you specify a custom component, this component can define a couple of methods which will allow you to control the flow of behaviour at a per-component level.

#### Component Level Callbacks
To allow the component to respond to user events, define 'setComponentCallbacks' in your custom component.  This method will then be called when the component is created, and allows the component to return it's own instance of Ng2DynamicDialogCallbacks, which will override those defined by the dialog controller.

Setting component level callbacks can be seen in [locked-content.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/locked-component-dialog/locked-content/locked-content.component.ts).


```TypeScript
import { Ng2DynamicDialogCallbacks } from 'ng2-dynamic-dialog';
import { Ng2DynamicDialogCallbackResult } from 'ng2-dynamic-dialog';

...

  // Called when the component is created and wants to override the dialogs callbacks
  setComponentCallbacks(): Ng2DynamicDialogCallbacks {
    
    // Declare a local component for button 1, so this components callback is called instead
    let componentCallbacks = new Ng2DynamicDialogCallbacks();
    componentCallbacks.onButton1Clicked = () => this.onButton1Selected();

    // Send the callbacks back
    return componentCallbacks;
  }
  
  // Called when the component is created and wants to override the dialogs callbacks
  private onButton1Selected(): Ng2DynamicDialogCallbackResult {
    
    // Do what ever work is required at the component level

    // Return how the flow should continue
    // Ng2DynamicDialogCallbackResult.CallSubsequent: Once this callback is done, call the dialog level callback also
    // Ng2DynamicDialogCallbackResult.None: Once this callback is done, do not call any additional dialog level callbacks
    
    return Ng2DynamicDialogCallbackResult.None;
  }
```

#### Component Level Control
To allow the component to control the dialog (such as closing it, changing content or locking the content), define 'setDialogComponent'  in your custom component.  This method will then be called when the custom component is created, and passes through the Ng2DynamicDialogComponent used to control the dialog, allowing the component to call any methods required to control the dialog.

Storing the dialog component can be seen in [locked-content.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/locked-component-dialog/locked-content/locked-content.component.ts).

```TypeScript
import { Ng2DynamicDialogComponent } from 'ng2-dynamic-dialog';

...

  // Called when the component is created and wants to override the dialogs callbacks
  setDialogComponent(dialogComponent: Ng2DynamicDialogComponent): void {
    
    // Save the dialog component so we can call methods like .show, .close etc. at a later date
    this.dialogComponent = dialogComponent;
  }
```

<br>

### Modifying a dialogs behaviour

The overall behaviour of the dialog can be specified by using 'Ng2DynamicDialogBehaviour', and the available options can be seen in [ng2-dynamic-dialog/styles/behaviour.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/behaviour.ts).

This structure can then be passed to the dialog using [Ng2DynamicDialogComponent setBehaviour] and is shown in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

<br>

## Change Log

### 5.0.0
* Updated to Angular ^5.2.3

### 4.0.0
* Removed dependency on typings
* Updated Typescript dependency to ^2.6.2

### 2.1.0
* Updated to Angular ^4.1.3 and Typescript ^2.3.2 - [#7](https://github.com/leewinder/ng2-dynamic-dialog/pull/7)
* Altered used of moduleId for Webpack support - [#8](https://github.com/leewinder/ng2-dynamic-dialog/pull/8)

### 2.0.0
* Dialogs are now styled using CSS classes rather then TypeScript defined properties

### 1.1.1
* Bug fix: Made sure the lock state was correctly set when an instant lock was triggered

### 1.1.0
* The dialogs lock/unlock function now takes a boolean to indicate whether a lock should be instant or via a transition

### 1.0.0
* Added callback owners, which allow a dialog callback to identify which object will be called next if Ng2DynamicDialogCallbackResult.CallSubsequent is returned.

### 0.9.0
* Updated to Typescript 2.0.x
* Added support for locking and unlocking dialogs to disable user input when the dialog cannot be used (in sitiations where server communication is in progress etc.)
* Changed Ng2DynamicDialogStyle to take a map of CSS properties rather than directly referenced styles giving significantly more control over the style of dialogs
* The background, cancel button and individual dialog buttons can now be styled using Ng2DynamicDialogStyle
* Added option to override dialog callbacks at a custom component level
* Added ability for a custom component to store the Ng2DynamicDialogComponent to allow per-component control of the dialog when needed
* Updated the samples to show significantly more customisation on the Custom Style dialog example

### 0.1.0
* Updated Angular dependancy to 2.0.0

### 0.0.6
* Added dependacy against [TsLerp](https://www.npmjs.com/package/tslerp) and removed the internal lerp/interval objects

### 0.0.5
* Update library to RC 5
* Update samples to RC 5
* Updated all documentation to reference new RC 5 requirements

### 0.0.4
* Updated documentation

### 0.0.3
* Added samples application to repository
* Updated all documentation
* Switched to using rootDir rather than outDir to correctly build all .ts files

### 0.0.2
* Initial release
