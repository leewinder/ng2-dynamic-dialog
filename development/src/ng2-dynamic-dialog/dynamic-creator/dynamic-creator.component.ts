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
    selector: 'ng2-dynamic-creator-component',
    template: `<div #dynamicTarget></div>`,
})
export class DynamicCreatorComponent implements OnChanges, OnInit, OnDestroy {

    // Private properties
    private componentReference: ComponentRef<any>;
    private isViewInitialized = false;

    // Component input
    @ViewChild('dynamicTarget', { read: ViewContainerRef })
    private dynamicTarget: any;

    @Input()
    private componentType: any;

    @Input()
    private componentCreatedCallback: (component: Component) => void;

    @Input()
    private componentDestroyedCallback: () => void;

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

        // If we have a component, destroy it first
        if (this.componentReference) {
            this.componentReference.destroy();

            // Call the callback if needed
            if (this.componentDestroyedCallback !== null) {
                this.componentDestroyedCallback();
            }
        }

        // Create an instance of this component
        let componentFactory = this.resolver.resolveComponentFactory(this.componentType);
        this.componentReference = this.dynamicTarget.createComponent(componentFactory);

        // If we need to, pass through the component we created
        if (this.componentCreatedCallback !== null) {
            this.componentCreatedCallback(this.componentReference.instance);
        }
    }
}
