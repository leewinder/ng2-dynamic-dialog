import { Injectable } from '@angular/core';

//
// Object used to track log-in details from the user
//
@Injectable()
export class UserDetailsService {

    // Properties used to pass information around about the user
    public email: string = null;

    public password: string = null;
    public confirmedPassword: string = null;

    public firstName: string = null;
    public lastName: string = null;

    //
    // Clears the properties
    //
    clear() {
        this.email = null;

        this.password = null;
        this.confirmedPassword = null;

        this.firstName = null;
        this.lastName = null;
    }
}
