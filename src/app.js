// Bootstrap javascript and stylesheets
require('../config/assets')

// Initialise router and additional plugins used in the App
var router = require('config/routes').default
require('config/plugins').install()

// Start the app
var App = require('src/components/container.vue')
router.start(App, '#app')