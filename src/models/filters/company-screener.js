var Company = require('../company').Company

/**
 * This class is a custom backbone collection using the Company model to represent filetered
 * companies based on screening options.
 *
 * fetch() is extended to support dynamic parameters that requires to be sent to the server.
 */
var CompanyScreener = Backbone.Collection.extend({
    model: Company,
    xhrOptions: {
        type: 'POST',
        processData: false,
        contentType: false,
        dataType: 'json'
    },
    url: appParameters.get('endpoint') + 'screener/filter',
    parse: function (response) {
        return response.data
    },
    fetch: function(data) {
        this.xhrOptions.data = JSON.stringify(data)
        return Backbone.Collection.prototype.fetch.call(this, this.xhrOptions)
    }
})

export {
    CompanyScreener
}
