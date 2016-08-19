import { Component } from '@angular/core';

import { UserDetailsService } from '../user-details/user-details.service';

@Component({

    moduleId: module.id,
    selector: 'custom-component-dialog-signup-content',

    templateUrl: 'signup.component.html',
    styleUrls: ['signup.component.css'],
})
export class SignUpComponent {

    // Constructor
    constructor(private userDetails: UserDetailsService) {
    }
}
