var Encore = require('@symfony/webpack-encore');

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Add 1 entry for each "page" of your app
     * (including one that's included on every page - e.g. "app")
     *
     * Each entry will result in one JavaScript file (e.g. explorer.js)
     * and one CSS file (e.g. explorer.css) if you JavaScript imports CSS.
     */
    .addEntry('explorer', ['babel-polyfill', './assets/js/explorer.js'])

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

    // bootstrap-loader config
    //.addLoader({test: /\.scss$/, loaders: ['style', 'css', 'postcss', 'sass']})
    //.addLoader({test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url?limit=10000'})
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
    .enableBuildNotifications()
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
;

let webpackConfig = Encore.getWebpackConfig();

// hax to get daterangepicker to work correctly
webpackConfig.resolve.alias = {
    'jquery': require.resolve('jquery')
};

module.exports = webpackConfig;