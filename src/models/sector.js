var Sector = Backbone.Model.extend({
    defaults: {
        name: 'Untitled',
        number_of_companies: 0,
        number_of_announcements: 0,
        number_of_ps_announcements: 0
    },
    url: function () {
        return appParameters.get('endpoint') + 'sector/' + (this.id ? this.id : '')
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

var SectorCollection = Backbone.Collection.extend({
    model: Sector,
    url: appParameters.get('endpoint') + 'sectors',

    parse: function (response) {
        return response.data;
    }
})

export {
    Sector,
    SectorCollection
}