<style>
    div.row label {
        padding-left: 15px;
    }

    form button {
        padding-top: 20px;
    }

    .year-low {
        color: orangered;
    }

    .year-high {
        color: green;
    }

    .current-price {
        color: dimgray;
    }
</style>
<template>
    <div class="row">
        <v-client-table :data="data" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
    </div>

    <!-- Chart: Large Modal -->
    <modal :show.sync="chartLarge" cancel-text=false>
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">Chart</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <img width="100%" :src="chartLargeUrl"/>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click='chartLarge = false'>Close</button>
        </div>
    </modal>

    <!-- Live Data: Large Modal -->
    <modal :show.sync="showLivePrice" cancel-text=false>
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">Live Price</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <table class="table table-condensed table-hover nopad">
                <tr>
                    <td>Instrument</td>
                    <td>{{ livePriceData.symbol }}</td>
                </tr>
                <tr>
                    <td>Retrieved At</td>
                    <td>{{ livePriceData.created_at }}</td>
                </tr>
                <tr>
                    <td>Last Trade At</td>
                    <td>{{ livePriceData.last_trade_time }}</td>
                </tr>
                <tr v-bind:class="{ 'success': livePriceData.movement > 0, 'danger': livePriceData.movement < 0}">
                    <td>Gain</td>
                    <td>{{ livePriceData.movement }}</td>
                </tr>
                <tr v-bind:class="{ 'success': livePriceData.movement > 0, 'danger': livePriceData.movement < 0}">
                    <td>Gain %</td>
                    <td>{{ livePriceData.movement_percent }}%</td>
                </tr>
                <tr>
                    <td>Avg. Volume</td>
                    <td>{{ livePriceData.avg_daily_volume }} ({{ format(livePriceData.avg_daily_volume) }})</td>
                </tr>
                <tr v-bind:class="{ 'success': livePriceData.volume_change_percentage > 100, 'danger': livePriceData.volume_change_percentage < 100 }">
                    <td>Volume</td>
                    <td>{{ livePriceData.volume }} ({{ format(livePriceData.volume) }})</td>
                </tr>
                <tr v-bind:class="{ 'success': livePriceData.volume_change_percentage > 100, 'danger': livePriceData.volume_change_percentage < 100 }">
                    <td>Percentage Vol. Increase</td>
                    <td>{{ livePriceData.volume_change_percentage }}%</td>
                </tr>
                <tr>
                    <td>Ask</td>
                    <td>{{ livePriceData.ask }}</td>
                </tr>
                <tr>
                    <td>Bid</td>
                    <td>{{ livePriceData.bid }}</td>
                </tr>
                <tr>
                    <td>Last</td>
                    <td>{{ livePriceData.last }}</td>
                </tr>
                <tr>
                    <td>Open</td>
                    <td>{{ livePriceData.open }}</td>
                </tr>
                <tr>
                    <td>High</td>
                    <td>{{ livePriceData.high }}</td>
                </tr>
                <tr>
                    <td>Low</td>
                    <td>{{ livePriceData.low }}</td>
                </tr>
            </table>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click='showLivePrice = false'>Close</button>
        </div>
    </modal>
</template>

<script>
    import Utility from '../../lib/utility'
    import {ImpulsiveQuote, ImpulsiveQuoteCollection} from '../../models/table/table-impulsive-quotes'
    var LiveQuote = require('../../models/live-quote').LiveQuote


    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var quote = new LiveQuote()
    var collection = new ImpulsiveQuoteCollection

    module.exports = {
        name: 'screener-filter',
        data: function () {
            return {
                data: collection.toJSON(),
                collection: collection,
                chartLarge: false,
                showLivePrice: false,
                livePriceData: quote.toJSON(),
                chartLargeUrl: '',
                tableOptions: {
                    perPage: 100,
                    templates: {
                        headline: function (row) {
                            if (row.headline) {
                                return '<a target=_blank href="http://www.asx.com.au' + row.url + '">' + row.headline +
                                        '</a>'
                            } else {
                                return '';
                            }
                        },
                        volume: "Now: {volume} <br> Avg: {avg_daily_volume}",
                        volume_change_percentage: "{volume_change_percentage}%",
                        movement_percent: "{movement_percent}%",
                        price_information: "<span class='year-low'>{year_low}</span>, " +
                        "<span class='current-price'>{ask}</span>, " +
                        "<span class='year-high'>{year_high}</span><br>" +
                        "<button @click='this.$parent.fetchLivePrice(\"{symbol}\")' type='button' class='btn btn-danger btn-xs'>Live Price</button>",

                        symbol: function (row) {
                            return "<a target=_blank href='http://www.asx.com.au/asx/research/company.do#!/" + row.symbol + "'\>"
                                    + row.symbol + "</a> (<a target=_blank href='http://hotcopper.com.au/asx/" + row.symbol + "'>HC</a>)<br>" +
                                    "AU$ " + Utility.humanFriendlyNumber(row.mkt_cap)
                        },

                        chart: '<div class="btn-group" role="group"><button type="button" class="btn btn-sm btn-info"' +
                        '@click=\'this.$parent.enlarge("{static_chart_intraday}")\'>Daily</a>' +
                        '<button type="button" class="btn btn-sm btn-info"' +
                        '@click=\'this.$parent.enlarge("{static_chart_7d}")\'>7 Day</button></div>',
                    },
                    listColumns: {
                        price_sensitive: [
                            {
                                value: true,
                                text: 'Yes'
                            },
                            {
                                value: false,
                                text: 'No'
                            }
                        ]
                    }
                },
                columns: [
                    'sector',
                    'symbol',
                    'volume',
                    'volume_change_percentage',
                    'movement_percent',
                    'price_information',
                    'headline',
                    'published_date',
                    'price_sensitive',
                    'chart'
                ]
            }
        },
        methods: {
            enlarge: function (url) {
                this.chartLargeUrl = url
                this.chartLarge = true
            },
            format: function (value) {
                return Utility.humanFriendlyNumber(value)
            },
            fetchLivePrice: function (symbol) {
                if (!symbol) {
                    alert('No instrument supplied')
                    return false
                }

                quote.set('symbol', symbol)
                quote.fetch()
                this.livePriceData = quote.toJSON()

                this.showLivePrice = true
            },
            forceFetch: function () {
                this.collection.fetch()
            }
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Impulsive Securities & Announcements'

                // Fetch from the API endpoint
                this.forceFetch()

                // Reload vue-table
                this.data = this.collection.toJSON()

                t.next()
            }
        }
    }
</script>

