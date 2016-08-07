var ImpulsiveQuote = Backbone.Model.extend({
    defaults: {},
    parse: function (response) {
        // Per item GET will have 'data' property
        if (response.data) {
            return response.data
        } else {
            return response
        }
    }
})

var ImpulsiveQuoteCollection = Backbone.Collection.extend({
    model: ImpulsiveQuote,
    url: appParameters.get('endpoint') + 'table/impulsive',
    parse: function (response) {
        return response.data;
    }
})

export {
    ImpulsiveQuote,
    ImpulsiveQuoteCollection
}

