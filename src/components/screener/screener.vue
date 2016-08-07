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
    <form>
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

        <br>
        <button @click="fetch" type="button" class="btn btn-primary pull-left">Lookup</button>
        <br>
    </form>

    <div class="row">
        <div class="col-xs-12">
            <v-client-table :data="[]" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
        </div>
    </div>

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
</template>

<script>
    var numeral = require('numeral')
    var CompanyScreener = require('../../models/filters/company-screener').CompanyScreener
    var FieldCollection = require('../../models/filters/field').FieldCollection

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var screener = new CompanyScreener()
    var fields = new FieldCollection()

    module.exports = {
        name: 'screener-filter',
        data: function () {
            return {
                screener: screener,
                chartLarge: false,
                chartLargeUrl: '',
                filters: {},
                fields: [],
                debug: true,
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
                        one_year_price: "<span class='year-low'>{year_low}</span>, " +
                        "<span class='current-price'>{last_trade_price}</span>, " +
                        "<span class='year-high'>{year_high}</span>",

                        symbol: "<a target=_blank href='http://www.asx.com.au/asx/research/company.do#!/{symbol}'>" +
                        "{symbol}</a> (<a target=_blank href='http://hotcopper.com.au/asx/{symbol}'>HC</a>)",

                        intra_day: '<a href="javascript:void(0);" ' +
                        '@click=\'this.$parent.enlarge("{static_chart_intraday}")\'>' +
                        '<img class="img-thumbnail" width="100%" src="{static_chart_intraday}"/></a>',

                        weekly: '<a href="javascript:void(0);" ' +
                        '@click=\'this.$parent.enlarge("{static_chart_7d}")\'>' +
                        '<img class="img-thumbnail" width="100%" src="{static_chart_7d}"/></a>',
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
                    'one_year_price',
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
                return numeral(value).format('0.00a')
            },
            fetch: function () {
                this.screener.fetch(this.filters)
                this.$refs.table.data = this.screener.toJSON()
            }
        },
        created: function () {
            // Load fields
            fields.fetch()
            this.fields = fields.toJSON()

            // Set up start and end date default values to the range
            _.each(this.fields, function(f) {
                if (f.field == 'created_at') {
                    // Set min, max for the date picker
                    this.filters[f.field] = {
                        enabled: true,
                        min: f.min,
                        max: f.max
                    }
                }
            }.bind(this))
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Securities and Announcements Screener'

                t.next()
            }
        }
    }
</script>

