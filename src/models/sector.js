var Sector = Backbone.Model.extend({
    defaults: {
        name: 'Untitled',
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