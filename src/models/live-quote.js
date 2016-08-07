var LiveQuote = Backbone.Model.extend({
    defaults: {
        symbol: null,
        created_at: null,
        last_trade_time: null,
        volume: null,
        avg_daily_volume: null,
        volume_change_percentage: null,
        ask: null,
        bid: null,
        last: null,
        open: null,
        high: null,
        low: null,
        movement: null,
        movement_percent: null
    },
    url: function () {
        return appParameters.get('endpoint') + 'live/' + this.get('symbol')
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


export {
    LiveQuote
}
