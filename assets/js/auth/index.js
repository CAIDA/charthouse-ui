import auth0 from 'auth0-js';

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
            scope: 'openid profile email',
            audience: 'https://api.hicube.caida.org/test'
        });
    }

    login() {
        // TODO: figure out how to use checkSession to avoid token expiry
        if (this.isAuthenticated()) {
            // no need to authorize
            return;
        }
        this.auth0.authorize();
    }

    handleAuthentication(onSuccess, onErr) {
        this.auth0.parseHash((err, authResult) => {
            this.handleAuthResult(err, authResult, onSuccess, onErr);
        });
    }

    handleAuthResult(err, authResult, onErr, onSuccess) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            this.setSession(authResult);
            onSuccess && onSuccess(authResult);
        } else if (err) {
            onErr && onErr(err);
        }
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

    getExpiryTime() {
        return JSON.parse(localStorage.getItem('expires_at'));
    }

    isAuthenticated() {
        // Check whether the current time is past the Access Token's expiry time
        return new Date().getTime() < this.getExpiryTime();
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    getIdToken() {
        if (!this.idToken) {
            this.idToken = JSON.parse(localStorage.getItem('id_token_payload'));
        }
        return this.idToken;
    }

    getNSClaim(claim) {
        const ns = 'https://hicube.caida.org/';
        return this.getIdToken()[ns + claim];
    }

    getNickname() {
        return this.getIdToken().nickname;
    }

    getName() {
        return this.getIdToken().name;
    }

    getSubject() {
        return this.getIdToken().sub;
    }

    getAuthorization() {
        return this.getNSClaim('auth');
    }

    hasPermission(permission) {
        return this.getAuthorization()['permissions'].includes(permission);
    }

    hasRole(role) {
        return this.getAuthorization()['roles'].includes(role);
    }

    inGroup(group) {
        return this.getAuthorization()['groups'].includes(group);
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
