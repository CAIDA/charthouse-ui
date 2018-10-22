import auth0 from 'auth0-js';

export { default as AuthenticatedRoute } from './route';

class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'hicube.auth0.com',
            clientID: '72l1lVLW9T71MRebhnU1c264YnnjOrtY',
            redirectUri: 'https://test.hicube.caida.org/auth/callback',
            responseType: 'token id_token',
            scope: 'openid'
        });
    }

    login() {
        this.auth0.authorize();
    }

    logout() {
    }

    renewToken(cb) {
    }

    getUser() {
    }
}

export const auth = new Auth();
