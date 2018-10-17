export {default as AuthenticatedRoute} from './route';

class Auth {
    constructor() {
        this.isAuthenticated = false;
    }

    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 1000);
    }

    signout(cb) {
        this.isAuthenticated = false;
        setTimeout(cb, 1000);
    }
}

export const auth = new Auth();
