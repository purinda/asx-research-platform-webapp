var Company = Backbone.Model.extend({
    defaults: {
        id: null,
        symbol: null,
        name: '',
        sector: null,
        static_chart_intraday: null,
        static_chart_7d: null
    },
    parse: function (response) {
        // Per item GET will have 'data' property
        if (response.data) {
            return response.data
        } else {
            return response
        }
    }
})

var CompanyCollection = Backbone.Collection.extend({
    model: Company,
    url: appParameters.get('endpoint') + 'companies',
    parse: function (response) {
        return response.data;
    }
})

export {
    Company,
    CompanyCollection
}
