var TableAnnouncement = Backbone.Model.extend({
    defaults: {
        id: null,
        symbol: null,
        sector: null,
        name: null,
        headline: null,
        price_sensitive: null,
        pages: null,
        url: null,
        published_date: null,
        time_received: null
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

var TableAnnouncementCollection = Backbone.Collection.extend({
    model: TableAnnouncement,
    url: appParameters.get('endpoint') + 'table/announcements',
    parse: function (response) {
        return response.data;
    }
})

export {
    TableAnnouncement,
    TableAnnouncementCollection
}

