var Vue = require('vue')
import {alert, modal, datepicker, popover} from 'vue-strap'

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

    // VueStrap components
    Vue.component('alert', alert)
    Vue.component('modal', modal)
    Vue.component('datepicker', datepicker)
    Vue.component('popover', popover)

    // Load spinner plugin for jQuery AJAX calls
    require('../assets/plugins/spinner')
    $(document).ajaxStart(function () {
        $.LoadingOverlay("show")
    }).ajaxStop(function () {
        $.LoadingOverlay("hide")
    })
}

export {install}