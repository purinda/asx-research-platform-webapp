var Announcement = Backbone.Model.extend({
    defaults: {
        headline: null,
        price_sensitive: null,
        pages: null,
        url: null,
        published_date: null,
        time_received: null
    },
    url: function () {
        return appParameters.get('endpoint') + 'announcements/' + (this.id ? this.id : '')
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

var SectorAnnouncementCollection = Backbone.Collection.extend({
    model: Announcement,
    initialize: function (sectorId) {
        if (sectorId) {
            this.url = appParameters.get('endpoint') + 'sector-announcements/' + sectorId + '?include=announcement'
        }
    },
    parse: function (response) {
        return response.data;
    }
})

export {
    Announcement,
    SectorAnnouncementCollection
}