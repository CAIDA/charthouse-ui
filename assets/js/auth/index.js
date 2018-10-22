import { UserManager, Log } from 'oidc-client';

export { default as AuthenticatedRoute } from './route';

class Auth {
    constructor() {
        Log.logger = console;
        Log.level = Log.DEBUG;

        const settings = {
            authority: 'https://auth.globus.org/',
            client_id: 'fec6a634-d866-4670-a305-54d9eabbd5b0',

            // TODO: need to use the router for this to get abs url
            //redirect_uri: 'https://test.hicube.caida.org/DEBUG',
            redirect_uri: 'https://auth.globus.org/v2/web/auth-code',
            //silent_redirect_uri: `https://test.hicube.caida.org/DEBUG`,
            post_logout_redirect_uri: 'https://test.hicube.caida.org/',

            response_type: 'token',
            scope: 'openid profile email',

            automaticSilentRenew: false
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
