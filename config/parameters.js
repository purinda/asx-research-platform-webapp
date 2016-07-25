/**
 * Vue debug parameters
 *
 * @type {Vue}
 */
var Vue = require('vue')
Vue.config.warnExpressionErrors = false
Vue.config.debug = true

/**
 * Web app configuration
 *
 * Configuration thats imported into the bundle based
 * on the target environment by the app's config-loader
 *
 * From a client-side javascript file you can pull this
 * configuration in with:
 *
 *   console.log(appParameters.get('title'));
 */
var params = [
    {
        name:  'title',
        value: 'ASX Announcements'
    },
    {
        name:  'version',
        value: '0.8.0'
    },
    {
        name: 'endpoint',
        value: 'http://asx.shared/'
    },
    {
        name: 'datetime-format',
        value: 'DD/MM/YYYY hh:mm'
    },
    {
        name: 'adminlte-theme',
        value: 'skin-black-light'
    }
]

var exports = module.exports

/**
 * Return the value of the parameter
 *
 * @param key
 * @returns {*}
 */
exports.get = function(key) {
    return params.find(function (item) {
        return item.name === key;
    }).value;
}