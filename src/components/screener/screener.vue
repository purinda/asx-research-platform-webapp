<template>
    <form v-show="showFilters" class="screener">
        <div v-for="field in fields" class="row">
            <!-- Range filters -->
            <div v-if="field.type == 'RANGE'">
                <label>
                    <input type="checkbox" title="Filter Enable/Disable" v-model="filters[field.field].enabled">
                    {{ field.display_name }} ({{ field.measurement_type }}{{ format(filters[field.field].min) }}
                    to
                    {{ field.measurement_type }}{{ format(filters[field.field].max) }})</label>
                <div class="form-group">
                    <div class="col-xs-6">
                        <div class="input-group">
                            <div class="input-group-addon">Min</div>
                            <input v-model="filters[field.field].min" min="{{ field.min }}" max="{{ field.max }}"
                                   type="range" class="form-control" id="{{ field.field }}">
                        </div>
                    </div>
                    <div class="col-xs-6">
                        <div class="input-group">
                            <input v-model="filters[field.field].max" min="{{ field.min }}" max="{{ field.max }}"
                                   type="range" class="form-control">
                            <div class="input-group-addon">Max</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Filter Options</h3>
            </div>

            <div class="panel-body">
                <form>
                    <div class="form-group">
                        <div v-for="field in fields" class="row">
                            <div v-if="field.type == 'OPTION'">
                                <label>
                                    <input type="checkbox"
                                           v-model="filters[field.field].checked">
                                    {{ field.display_name }}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div v-for="field in fields" class="row">
                        <!-- Date range filters -->
                        <div v-if="field.type == 'DATE_RANGE'">
                            <label>
                                {{ field.display_name }}
                            </label>
                            <div class="form-group">
                                <div class="col-xs-12">
                                    <datepicker
                                            :value.sync="filters[field.field].min"
                                            format="dd/MM/yyyy"
                                            show-reset-button="reset">
                                    </datepicker>
                                    <datepicker
                                            :value.sync="filters[field.field].max"
                                            format="dd/MM/yyyy"
                                            show-reset-button="reset">
                                    </datepicker>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </form>

    <br>
    <div class="btn-group">
        <button @click="showFilters = !showFilters" type="button" class="btn btn-primary pull-left">
            <span v-show="!showFilters">Show Filters</span>
            <span v-show="showFilters">Hide Filters</span>
        </button>
        <button @click="fetch" type="button" class="btn btn-primary pull-left">Lookup</button>
    </div>
    <br>

    <div class="row">
        <v-client-table :data="[]" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
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
    var CompanyScreener = require('../../models/filters/company-screener').CompanyScreener
    var FieldCollection = require('../../models/filters/field').FieldCollection
    var LiveQuote = require('../../models/live-quote').LiveQuote

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var screener = new CompanyScreener()
    var fields = new FieldCollection()
    var quote = new LiveQuote()

    module.exports = {
        name: 'screener-filter',
        data: function () {
            return {
                screener: screener,
                showFilters: false,
                chartLarge: false,
                showLivePrice: false,
                livePriceData: quote.toJSON(),
                chartLargeUrl: '',
                filters: {},
                fields: [],
                debug: true,
                tableOptions: {
                    orderBy: {
                        descending: true,
                        column: 'published_date'
                    },
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
                        price_information: "<span class='label label-danger'>{year_low}</span>&nbsp;" +
                        "<span class='label label-default'>{last_trade_price}</span>&nbsp;" +
                        "<span class='label label-success'>{year_high}</span><br>" +
                        "<button @click='this.$parent.fetchLivePrice(\"{symbol}\")' type='button' class='btn btn-danger btn-xs btn-block btn-live-price'>Live Price</button>",

                        symbol: function (row) {
                            return "<a target=_blank href='http://www.asx.com.au/asx/research/company.do#!/" + row.symbol + "'\>"
                                    + row.symbol + "</a> (<a target=_blank href='http://hotcopper.com.au/asx/" + row.symbol + "'>HC</a>)<br>" +
                                    "AU$ " + Utility.shortNumber(row.mkt_cap)
                        },

                        intra_day: '<a href="javascript:void(0);" ' +
                        '@click=\'this.$parent.enlarge("{static_chart_intraday}")\'>' +
                        '<img class="img-thumbnail" width="100%" src="{static_chart_intraday}"/></a>',

                        weekly: '<a href="javascript:void(0);" ' +
                        '@click=\'this.$parent.enlarge("{static_chart_7d}")\'>' +
                        '<img class="img-thumbnail" width="100%" src="{static_chart_7d}"/></a>',

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
                    'headline',
                    'price_sensitive',
                    'price_information',
                    'published_date',
                    'intra_day',
                    'weekly'
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
            fetch: function () {
                this.screener.fetch(this.filters).then(function (xhr) {
                    this.$refs.table.data = xhr['data']
                }.bind(this))
            }
        },
        route: {
            waitForData: true,
            /**
             * Async data loading for filters section
             * @returns {*|Promise.<TResult>}
             */
            data: function () {
                return fields.fetch().then(function (xhr) {
                    var result = {
                        fields: xhr['data'],
                        filters: {}
                    }

                    // Set up start and end date default values to the range
                    _.each(result.fields, function (f) {
                        if (f.field == 'created_at') {
                            // Set min, max for the date picker
                            result.filters[f.field] = {
                                enabled: true,
                                min: f.min,
                                max: f.max
                            }
                        }
                    }.bind(result))

                    return result
                }.bind(this))
            },
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Securities and Announcements Screener'
                t.next()
            }
        }
    }
</script>

