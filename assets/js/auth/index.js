import auth0 from 'auth0-js';

export { default as AuthenticatedRoute } from './route';

import config from 'Config';

class Auth {

    idToken;

    userProfile;

    constructor() {
        this.auth0 = new auth0.WebAuth({
            domain: 'hicube.auth0.com',
            clientID: '72l1lVLW9T71MRebhnU1c264YnnjOrtY',
            redirectUri: `${config.getParam('baseUri')}/auth/callback`,
            responseType: 'token id_token',
            scope: 'openid profile email'
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
        localStorage.setItem('id_token_payload', JSON.stringify(authResult.idTokenPayload));
        localStorage.setItem('expires_at', expiresAt);
    }

    logout() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('id_token_payload');
        localStorage.removeItem('expires_at');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // Access Token's expiry time
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('No Access Token found');
        }
        return accessToken;
    }

    getIdToken() {
        if (!this.idToken) {
            this.idToken = JSON.parse(localStorage.getItem('id_token_payload'));
            if (!this.idToken) {
                throw new Error('No ID token found');
            }
        }
        return this.idToken;
    }

    getNickname() {
        return this.getIdToken().nickname;
    }

    getUserId() {
        return this.getIdToken().sub;
    }

    getProfile(cb) {
        if (this.userProfile) {
            cb(this.userProfile);
            return;
        }
        const accessToken = this.getAccessToken();
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                this.userProfile = profile;
            }
            cb(profile, err);
        });
    }
}

export const auth = new Auth();
