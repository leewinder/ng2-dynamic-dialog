//
// Code originally taken from http://stackoverflow.com/a/36325468/48651
//

// Imports
import {Component, ComponentRef, Input, ViewContainerRef, ComponentResolver,
    ComponentFactory, ViewChild, OnChanges, AfterViewInit, OnDestroy} from '@angular/core';

//
// Dynamic component loader component
//
@Component({
    selector: 'ng2-dynamic-dialog-wrapper',
    template: `<div #dynamicTarget></div>`,
})
export class Ng2DynamicDialogWrapperComponent implements OnChanges, AfterViewInit, OnDestroy {

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
    constructor(private resolver: ComponentResolver) {
    }

    //
    // Updates the view with the dynamically loaded component
    //
    updateComponent() {

        if (!this.isViewInitialized) {
            return;
        }

        if (this.componentReference) {
            this.componentReference.destroy();
        }

        this.resolver.resolveComponent(this.componentType).then((factory: ComponentFactory<any>) => {
            this.componentReference = this.dynamicTarget.createComponent(factory);
        });
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
    ngAfterViewInit() {
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
}
