var Announcement = Backbone.Model.extend({
    defaults: {
        headline: 'Untitled',
        symbol: 'XXX',
        price_sensitive: 0,
        pages: 0,
        url: '',
        published_date: '',
        time_received: ''
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

var AnnouncementCollection = Backbone.Collection.extend({
    model: Announcement,
    url: appParameters.get('endpoint') + 'announcements',

    parse: function (response) {
        return response.data;
    }
})

export {
    Announcement,
    AnnouncementCollection
}