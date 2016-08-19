//
// Code originally taken from http://stackoverflow.com/a/36325468/48651
//

// Imports
import {Component, ComponentRef, Input, ViewContainerRef, ComponentFactoryResolver,
    ViewChild, OnChanges, OnInit, OnDestroy} from '@angular/core';

//
// Dynamic component loader component
//
@Component({
    selector: 'ng2-dynamic-dialog-wrapper',
    template: `<div #dynamicTarget></div>`,
})
export class Ng2DynamicDialogWrapperComponent implements OnChanges, OnInit, OnDestroy {

    // Private properties
    private componentReference: ComponentRef<any>;
    private isViewInitialized = false;

    // Component input
    @ViewChild('dynamicTarget', { read: ViewContainerRef })
    private dynamicTarget: any;

    @Input()
    private componentType: any;

    //
    // Constructor
    //
    constructor(private resolver: ComponentFactoryResolver) {
    }

    //
    // Called when the view changes
    //
    ngOnChanges() {
        this.updateComponent();
    }

    //
    // Called after the view has been initialised
    //
    ngOnInit() {
        this.isViewInitialized = true;
        this.updateComponent();
    }

    //
    // Called when we need to destroy the view
    //
    ngOnDestroy() {
        if (this.componentReference) {
            this.componentReference.destroy();
        }
    }

    //
    // Updates the view with the dynamically loaded component
    //
    private updateComponent() {

        if (!this.isViewInitialized) {
            return;
        }

        if (this.componentReference) {
            this.componentReference.destroy();
        }

        let componentFactory = this.resolver.resolveComponentFactory(this.componentType);
        this.componentReference = this.dynamicTarget.createComponent(componentFactory);
    }
}
