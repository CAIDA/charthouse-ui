import auth0 from 'auth0-js';

export { default as AuthenticatedRoute } from './route';

import config from 'Config';

class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'hicube.auth0.com',
            clientID: '72l1lVLW9T71MRebhnU1c264YnnjOrtY',
            redirectUri: `${config.getParam('baseUri')}/auth/callback`,
            responseType: 'token id_token',
            scope: 'openid'
        });
    }

    login() {
        this.auth0.authorize();
    }

    handleAuthentication(onSuccess, onErr) {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                onSuccess(authResult);
            } else if (err) {
                onErr(err);
            }
        });
    }

    setSession(authResult) {
        // Set the time that the Access Token will expire at
        const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    }

    logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}

export const auth = new Auth();
