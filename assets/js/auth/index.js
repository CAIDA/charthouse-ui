import { UserManager } from 'oidc-client';

export { default as AuthenticatedRoute } from './route';

class Auth {
    constructor() {
        const settings = {
            authority: Constants.stsAuthority,
            client_id: 'implicit',

            // TODO: should we use the router for this?
            // TODO: can we redirect to login?
            redirect_uri: '/login-callback',
            silent_redirect_uri: `/renew-callback`,
            post_logout_redirect_uri: '/',

            response_type: 'id_token token',
            scope: 'openid profile email',

            automaticSilentRenew: true
        };
        this.userManager = new UserManager(settings);
    }

    login() {
        return this.userManager.signinRedirect();
    }

    logout() {
        return this.userManager.signoutRedirect();
    }

    renewToken(cb) {
        return this.userManager.signinSilent();
    }

    getUser() {
        return this.userManager.getUser();
    }
}

export const auth = new Auth();
