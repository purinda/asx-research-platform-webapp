var CompanyAnnouncement = Backbone.Model.extend({
    defaults: {
        symbol: 'XXX',
        name: '',
        chart_1d_url: '',
        chart_1w_url: '',
        announcements: []
    },
    parse: function (response) {
        response.chart_1d_url = 'https://chart.finance.yahoo.com/z?s=' + response.symbol + '.AX&t=1d&q=c&l=on&z=m&a=r14&p=m10,m20,v&lang=en-AU&region=AU'
        response.chart_1w_url = 'https://chart.finance.yahoo.com/z?s=' + response.symbol + '.AX&t=7d&q=c&l=on&z=m&a=r14&p=m10,m20,v&lang=en-AU&region=AU'
        return response;
    }
})

var CompanyAnnouncementCollection = Backbone.Collection.extend({
    model: CompanyAnnouncement,
    initialize: function(sectorId) {
        this.url = appParameters.get('endpoint') + 'sector-announcements/' + sectorId;
    },
    parse: function (response) {
        return response.data;
    }
})

export {
    CompanyAnnouncement,
    CompanyAnnouncementCollection
}
