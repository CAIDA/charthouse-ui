/*
 * This software is Copyright (c) 2013 The Regents of the University of
 * California. All Rights Reserved. Permission to copy, modify, and distribute this
 * software and its documentation for academic research and education purposes,
 * without fee, and without a written agreement is hereby granted, provided that
 * the above copyright notice, this paragraph and the following three paragraphs
 * appear in all copies. Permission to make use of this software for other than
 * academic research and education purposes may be obtained by contacting:
 *
 * Office of Innovation and Commercialization
 * 9500 Gilman Drive, Mail Code 0910
 * University of California
 * La Jolla, CA 92093-0910
 * (858) 534-5815
 * invent@ucsd.edu
 *
 * This software program and documentation are copyrighted by The Regents of the
 * University of California. The software program and documentation are supplied
 * "as is", without any accompanying services from The Regents. The Regents does
 * not warrant that the operation of the program will be uninterrupted or
 * error-free. The end-user understands that the program was developed for research
 * purposes and is advised not to rely exclusively on the program for any reason.
 *
 * IN NO EVENT SHALL THE UNIVERSITY OF CALIFORNIA BE LIABLE TO ANY PARTY FOR
 * DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
 * PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF
 * THE UNIVERSITY OF CALIFORNIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
 * DAMAGE. THE UNIVERSITY OF CALIFORNIA SPECIFICALLY DISCLAIMS ANY WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE PROVIDED HEREUNDER IS ON AN "AS
 * IS" BASIS, AND THE UNIVERSITY OF CALIFORNIA HAS NO OBLIGATIONS TO PROVIDE
 * MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.
 */

import config from 'Config';
import Keycloak from 'keycloak-js';

class Auth {

    idToken;
    authStatus;

    userProfile;

    keycloak;
    keycloakInit;

    constructor() {
        var myself=this;
        this.keycloak = Keycloak({
                realm: "demo",
                "url": process.env.KEYCLOAK_URL + "/auth/",
                resource: "charthouse-ui",
                "ssl-required": "external",
                "confidential-port": "0",
                "enable-cors": true,
                "clientId": "charthouse-ui"
        });

        this.keycloak.onTokenExpired = function() {

            myself.keycloak.updateToken(70).success((refreshed) => {
            }).error(() => {
                myself.forceLogin();
            });
        }
        this.keycloakInit = false;
        this.idTokenParsed = null;
        this.authStatus = false;
        this.userProfile = null;
    }

    callSilentInit() {
        var myself = this;
        if (this.keycloakInit) {
            return Promise.resolve(this.authStatus);
        }
        return this.keycloak.init({onLoad: 'check-sso',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'}).then(function() {
                        myself.keycloakInit = true;
                        myself.idToken = myself.keycloak.idTokenParsed;
                        myself.authStatus = myself.keycloak.authenticated;
                        localStorage.setItem('idtoken', myself.keycloak.idToken);
                        return myself.keycloak.authenticated;
                });
    }

    callLoginPageInit() {
        if (this.keycloakInit) {
            return Promise.resolve(this.keycloak.authenticated);
        }
        this.keycloakInit = true;
        return this.keycloak.init({onLoad: 'login-required'});
    }

    login() {
        if (this.isAuthenticated()) {
            // no need to authorize
            return;
        }
        this.keycloak.login({
            redirectUri: sessionStorage.getItem('redirect_uri')
        });
    }

    forceLogin() {
        if (this.keycloakInit) {
                this.keycloak.clearToken();
        }
        this.login();
    }

    logout(dest) {
        this.idToken = null;
        this.authStatus = false;
        localStorage.removeItem('id_token');
        this.keycloak.logout({redirectUri : window.location.protocol + "//" + window.location.host +  dest});
    }

    isAuthenticated() {
        return this.authStatus;
    }

    getAccessToken() {
        return localStorage.getItem('access_token');
    }

    getIdToken() {
        if (this.idToken) {
            return this.idToken;
        }
        var tok = localStorage.getItem('id_token');
        if (tok == null) {
            return null;
        }
        this.idToken = this.keycloak.decodeToken(tok);
        return this.idToken;
    }

    getNickname() {
        var idtoken = this.getIdToken();
        if (idtoken != null) {
            return idtoken.preferred_username;
        }
        return "";
    }

    getName() {
        var idtoken = this.getIdToken();
        var name = null;
        if (idtoken == null) {
            name = "Unauthenticated User";
        }
        else if (idtoken.hasOwnProperty('name')) {
            name = idtoken.name;
        }
        else if (idtoken.hasOwnProperty('preferred_username')) {
            name = idtoken.preferred_username;
        } else {
            name = "Unidentified User";
        }
        return name;
    }

    getSubject() {
        var idtoken = this.getIdToken();
        if (idtoken != null) {
            return idtoken.sub;
        }
        return "";
    }

    hasRole(role) {
        var idtoken = this.getIdToken();
        if (!idtoken) {
             return false;
        }
        if (!idtoken.hasOwnProperty('roles')) {
             return false;
        }
        return idtoken.roles.includes(role);
    }

    getProfile(cb) {
        var myself=this;
        if (!myself.userProfile) {
            myself.keycloak.loadUserProfile().then(function(profile) {
                myself.userProfile = profile;
                cb(myself.userProfile);
            }).catch(function(err) {
                /* TODO invoke cb with an error */
                return
            });
        } else {
            cb(myself.userProfile);
        }
    }

    makeCancelable(promise) {
        let hasCanceled_ = false;
        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then(
                val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
                error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
            );
        });

        return {
            promise: wrappedPromise,
            cancel() {
                hasCanceled_ = true;
            },
        };
    }
}

export const auth = new Auth();
