var path = require('path');
var Encore = require('@symfony/webpack-encore');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    // enable hash in file name to force cache busting
    .enableVersioning()

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     */
    .addEntry('hi3', ['babel-polyfill', './assets/js/hi3.js'])

    // shim to webpackify the horribly old jquery BBQ plugin
    .addLoader({
        test: require.resolve('jquery2-bbq'),
        loader: 'exports-loader?jQuery.bbq!imports-loader?jQuery=jquery,this=>window'
    })

    // shim for jstree to inject jquery
    .addLoader({
        test: require.resolve('jstree'),
        loader: 'imports-loader?jQuery=jquery'
    })

    // boostrap-select
    .addLoader({
        test: require.resolve('bootstrap-select/dist/js/bootstrap-select'),
        loader: 'imports-loader?jQuery=jquery'
    })

    // bootstrap
    .addLoader({
        test: /bootstrap\/js\//,
        loader: 'imports-loader?jQuery=jquery'
    })

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    //.enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // enables React support
    .enableReactPreset()

    // enables Sass/SCSS support
    //.enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()

    .configureBabel(function (babelConfig) {
        babelConfig.plugins.push('transform-class-properties');
        babelConfig.plugins.push('syntax-dynamic-import');
        babelConfig.plugins.push('transform-object-rest-spread');
        babelConfig.plugins.push('istanbul');
    });
;

let webpackConfig = Encore.getWebpackConfig();

webpackConfig.resolve.alias = {
    // hax to get daterangepicker to work correctly
    'jquery': require.resolve('jquery'),

    // convenience for accessing our local CSS files
    'css': path.resolve(__dirname, './assets/css/'),

    // convenience for accessing our top-level modules
    'Auth': path.resolve(__dirname, './assets/js/auth/'),
    'Config': path.resolve(__dirname, './assets/js/config/'),
    'Explorer/css': path.resolve(__dirname, './assets/css/Explorer/'),
    'Explorer': path.resolve(__dirname, './assets/js/Explorer/')
};

module.exports = webpackConfig;
