import { Component } from '@angular/core';

import { UserDetailsService } from '../user-details/user-details.service';

@Component({

    moduleId: __filename,
    selector: 'custom-component-dialog-login-content',

    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'],
})
export class LogInComponent {

    // Constructor
    constructor(private userDetails: UserDetailsService) {
    }
}
