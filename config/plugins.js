var Vue = require('vue')

/**
 * Install/Enable Plugins in the Global Vue context
 *
 * @return {null}
 */
function install() {
    // Initialise VueTables plugin which is used CMS wide
    var VueTables = require('vue-tables')
    Vue.use(VueTables.client, {
        compileTemplates: true,
        filterByColumn: true
    })

    // Load spinner plugin for jQuery AJAX calls
    require('../assets/plugins/spinner')
    $(document).ajaxStart(function () {
        $.LoadingOverlay("show")
    }).ajaxStop(function () {
        $.LoadingOverlay("hide")
    })
}

export {install}