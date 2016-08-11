<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="alert alert-info" role="alert">
                Data displayed after 16:00 could be delayed since the markets would be closed after hours.
            </div>
        </div>

        <div class="col-xs-12">
            <button class="btn btn-default" @click="refreshTable()">Refresh</button>
        </div>
    </div>

    <div class="row analytical-data-table">
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
                    'orderBy.column': 'gain',
                    templates: {
                        headline: function (row) {
                            if (row.headline) {
                                return '<a target=_blank href="http://www.asx.com.au' + row.url + '">' + row.headline +
                                        '</a>'
                            } else {
                                return '';
                            }
                        },
                        volume: function (row) {
                            return Utility.shortNumber(row.volume) + " (avg " + Utility.shortNumber(row.avg_daily_volume) + ')'
                        },
                        volume_change_percentage: function (row) {
                            if (row.volume_change_percentage > 0) {
                                return "<h4><span class='label label-success'>" + row.volume_change_percentage + "%</span></h4>"
                            } else if (row.volume_change_percentage == 0) {
                                return "<h4><span class='label label-default'>" + row.volume_change_percentage + "%</span></h4>"
                            } else if (row.volume_change_percentage < 0) {
                                return "<h4><span class='label label-danger'>" + row.volume_change_percentage + "%</span></h4>"
                            }
                        },
                        movement_percent: function (row) {
                            if (row.movement_percent > 0) {
                                return "<h4><span class='label label-success'>" + row.movement_percent + "%</span></h4>"
                            } else if (row.movement_percent == 0) {
                                return "<h4><span class='label label-default'>" + row.movement_percent + "%</span></h4>"
                            } else if (row.movement_percent < 0) {
                                return "<h4><span class='label label-danger'>" + row.movement_percent + "%</span></h4>"
                            }
                        },
                        price_information: "<span class='label label-danger'>{year_low}</span>&nbsp;" +
                        "<span class='label label-default'>{ask}</span>&nbsp;" +
                        "<span class='label label-success'>{year_high}</span><br>" +
                        "<button @click='this.$parent.fetchLivePrice(\"{symbol}\")' type='button' class='btn btn-danger btn-xs btn-block btn-live-price'>Live Price</button>",

                        symbol: function (row) {
                            return "<a target=_blank href='http://www.asx.com.au/asx/research/company.do#!/" + row.symbol + "'\>"
                                    + row.symbol + "</a> (<a target=_blank href='http://hotcopper.com.au/asx/" + row.symbol + "'>HC</a>)<br>" +
                                    "AU$ " + Utility.shortNumber(row.mkt_cap)
                        },

                        chart: '<button type="button" class="btn btn-sm btn-info"' +
                        '@click=\'this.$parent.enlarge("{static_chart_intraday}")\'>Daily</button>&nbsp;' +
                        '<button type="button" class="btn btn-sm btn-info"' +
                        '@click=\'this.$parent.enlarge("{static_chart_7d}")\'>7 Day</button>',

                        published_date: function (row) {
                            if (moment(row.published_date).isSame(moment(), 'day')) {
                                return "<h4><span class='label label-success'>" + row.published_date + "</span></h4>"
                            } else {
                                return "<h4><span class='label label-default'>" + row.published_date + "</span></h4>"
                            }
                        }
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
                return Utility.shortNumber(value)
            },
            formatPercentage: function (value) {
                return Utility.formatPercentage(value)
            },
            fetchLivePrice: function (symbol) {
                quote.set('symbol', symbol)
                if (!symbol) {
                    alert('No instrument supplied')
                    return false
                }

                quote.fetch().then(function (xhr) {
                    this.livePriceData = xhr['data']
                    this.showLivePrice = true
                }.bind(this))
            },
            refreshTable: function() {
                this.forceFetch().done(function(xhr) {
                    this.data = xhr.data
                }.bind(this))
            },
            forceFetch: function () {
                return this.collection.fetch().then(function (xhr) {
                    var result = {
                        data: xhr['data']
                    }

                    return result
                })
            }
        },
        route: {
            waitForData: true,
            /**
             * Async data loading for filters section
             * @returns {*|Promise.<TResult>}
             */
            data: function () {
                return this.forceFetch()
            },
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Impulsive Securities & Announcements'

                t.next()
            }
        }
    }
</script>

