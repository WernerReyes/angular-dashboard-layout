import { Injectable } from '@angular/core';
import { SignIn } from '../inferfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    signIn(signIn: SignIn) {
        console.log('AuthService signIn', signIn);
    }
}
