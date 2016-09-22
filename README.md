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

![](https://cloud.githubusercontent.com/assets/1649415/18762632/7fafdd10-8101-11e6-96bf-d16995a6ffca.gif)

<br>

## Dependancies
Currently built against Angular 2.0.0.

ng2-dynamic-dialog has the following additional dependancies
- [TsLerp](https://www.npmjs.com/package/tslerp): Typescript library for lerping single and multi-sample data sets over time

<br>

## Installation
1. Add the package to your 'dependencies' list in `package.json` and run `npm install`

  `"ng2-dynamic-dialog": "^0.1.0"`
  
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
![](https://cloud.githubusercontent.com/assets/1649415/17703006/123c9a58-63c8-11e6-9acd-df1bde4dd555.gif)

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
![](https://cloud.githubusercontent.com/assets/1649415/18762714/f1b57faa-8101-11e6-82df-8d5620ed629f.gif)

Once a dialog is being triggered, you can use 'Ng2DynamicDialogStyle' to customise how the dialog looks.  This can be seen in [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts).

```TypeScript
    // Sets the style of the dialog
    private setDialogStyles() {

        // Initialise the style of the dialog
        let dialogStyle = new Ng2DynamicDialogStyle();

        // Background style - we don't want one
        dialogStyle.background['opacity'] = 0;

        // Dialog style
        dialogStyle.dialog['font-family'] = 'Raleway';
        dialogStyle.dialog['font-size.px'] = 14;

        ...

        dialogStyle.dialog['border-radius.px'] = 0;
        dialogStyle.dialog['border-width.px'] = 0;

        dialogStyle.dialog['box-shadow'] = '0px 0px 18px 3px rgba(120,120,120,1)';

        // Button style
        dialogStyle.button.general.idle['background-color'] = '#FFFFFF';
        dialogStyle.button.general.idle['color'] = '#000000';

        ...

        // Move the first button to the right so they are bunched
        dialogStyle.button.individial[0].idle['left.px'] = 250;

        dialogStyle.button.individial[0].idle['width.px'] = 90;
        dialogStyle.button.individial[1].idle['width.px'] = 90;

        // Title style
        dialogStyle.title['font-family'] = dialogStyle.dialog['font-family'];

        ...

        // Cancel button style
        dialogStyle.cancelButton['source'] = 'assets/close.png';

        // Set it
        this.modalDialog.setStyle(dialogStyle);
    }
```

Each element is styled using CSS properties which are then applied to the dialog when it is displayed.  The default styles specified can be seen in [ng2-dynamic-dialog/styles/style.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/style.ts)

For more information on custom styles and how they are used, see 'Styling Dialogs' below.

<br>

### Triggering Dialogs With Custom Components
![](https://cloud.githubusercontent.com/assets/1649415/17703216/d6144b42-63c8-11e6-8f1f-a1dc86ca4227.gif)

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
![](https://cloud.githubusercontent.com/assets/1649415/17707331/d338c5ba-63d7-11e6-80e6-80ac1c87dd47.gif)

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
* Cancel button

![](https://cloud.githubusercontent.com/assets/1649415/18762714/f1b57faa-8101-11e6-82df-8d5620ed629f.gif)

For every stylable element, you can provide CSS properties for each element which is applied when the dialog is displayed.  There is no restriction on which CSS elements can be defined within the Ng2DynamicDialogStyle object, offering significant control over how the dialog looks.

There are two examples of using styles within the library and samples
* [ng2-dynamic-dialog/styles/style.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/style.ts) - Shows the available objects that can be defined on a per dialog basis
* [styled-with-html-dialog.component.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/samples/src/app/components/dialogs/styled-with-html-dialog/styled-with-html-dialog.component.ts) - Shows how the dialog uses Ng2DynamicDialogStyle to override pre-defined CSS properties and add new properties where needed

#### Styling Buttons
The buttons contained within the dialog require a bit more work to be fully styled due to the various states they can be in
* Generic button style either idle or hovered
* Individual button style either idle or hovered

As a result, the Ng2DynamicDialogStyle.buttons member requires properties for general idle and hover states, plus allowing you to specify idle and hover states for the individual buttons within the dialog.  The structure you can modify is defined in [ng2-dynamic-dialog/styles/style.ts](https://github.com/leewinder/ng2-dynamic-dialog/blob/master/development/src/ng2-dynamic-dialog/styles/style.ts).

```TypeScript
  // Button style
  button = {
      'general': {
          'idle': {},
          'hover': {},
      },
      'individial': [
          {
              'idle': {},
              'hover': {},
          },
          {
              'idle': {},
              'hover': {},
          },
          {
              'idle': {},
              'hover': {},
          },
      ],
  };
```

There is also a hierarchy to how the button styles are used
* Regardless of type, the 'hover' style first copies the properties of the idle style (meaning you do not need to duplicate properties, only the differences).  But the 'hover' property overrides any idle properties if they are defined/
* Whether idle or hover, individial's 'hover' or 'idle' style is combined with the general 'hover' or 'idle' style with the individual style taking priority.

This boils down to having to define all the required style properties in the general.idle object, defining only the differences required on a hover or per-button basis.

```TypeScript
  // Sets the style of the dialog
  private setDialogStyles() {
  
      // Initialise the style of the dialog
      let dialogStyle = new Ng2DynamicDialogStyle();
  
      ...
  
      // Button style
      dialogStyle.button.general.idle['background-color'] = '#FFFFFF';
      dialogStyle.button.general.idle['color'] = '#000000';
  
      dialogStyle.button.general.idle['border-width.px'] = 0;
      dialogStyle.button.general.idle['border-radius.px'] = 0;
  
      // The button will be a different colour when hovered, otherwise it's identical to the general state
      dialogStyle.button.general.hover['background-color'] = '#DDDDDD';
  
      // We'd like the first and second button to be slightly different, but the rest of  
      // the style will be identical to the general style (either idle or hovered)
      (<any>dialogStyle.button.individial[0].idle)['left.px'] = 250;
  
      (<any>dialogStyle.button.individial[0].idle)['width.px'] = 90;
      (<any>dialogStyle.button.individial[1].idle)['width.px'] = 90;
  
      ...
  
      // Set it
      this.modalDialog.setStyle(dialogStyle);
  }
```

#### Styling Cancel Buttons
The cancel button is styled like any other element of the dialog with a single exception.  A special property - cancelButton.source - is required to pass through the asset used to render the exit button.

```TypeScript
  // Sets the style of the dialog
  private setDialogStyles() {
  
      // Initialise the style of the dialog
      let dialogStyle = new Ng2DynamicDialogStyle();
  
      ...
  
      // Cancel button image
      dialogStyle.cancelButton['source'] = 'assets/close.png';
  
      // Set it
      this.modalDialog.setStyle(dialogStyle);
  }
```

<br>

### Component Level Control
By default, the flow of events and input response is handled at the dialog level via the Ng2DynamicDialogComponent as described in the previous sections.  But there are times when a Custom Component will need to handle user input or control the behaviour of the dialog without passing that control back to the Ng2DynamicDialogComponent instance.

When you specify a custom component, this component can define a couple of methods which will allow you to control the flow of behaviour at a per-component level.

#### Component Level Callbacks
To allow the component to respond to user events, define 'setComponentCallbacks' in your custom component.  This method will then be called when the component is created, and allows the component to return it's own instance of Ng2DynamicDialogCallbacks, which will override those defined by the dialog controller.

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

This structure can then be passed to the dialog using [Ng2DynamicDialogComponent setBehaviour].

<br>

## Change Log

### x.y.z
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
