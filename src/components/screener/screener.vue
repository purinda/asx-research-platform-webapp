<style>
    div.row label {
        padding-left: 15px;
    }

    form button {
        padding-top: 20px;
    }

</style>
<template>
    <form>
        <div v-for="field in fields" class="row">
            <div v-if="field.type == 'RANGE'">
                <label>
                    <input type="checkbox" title="Filter Enable/Disable" v-model="filters[field.field].enabled" checked>
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
                </form>
            </div>
        </div>

        <br>
        <button @click="fetch" type="button" class="btn btn-primary pull-left">Lookup</button>
        <br>

        <div class="row">
            <div class="col-xs-12">
                <v-client-table :data="[]" :columns="columns" :options="tableOptions" v-ref:table></v-client-table>
            </div>
        </div>
        <!--<pre v-if="debug">{{ filters | json}}</pre>-->
    </form>
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
                filters: {},
                fields: [],
                debug: true,
                tableOptions: {
                    perPage: 100,
                    templates: {
                        headline: function (row) {
                            if (row.headline) {
                                return "<a target=_blank href='http://www.asx.com.au' + row.url >" + row.headline +
                                       "</a>"
                            } else {
                                return '';
                            }
                        },
                        symbol: "<a target=_blank href='http://www.asx.com.au/asx/research/company.do#!/{symbol}'>{symbol}</a>",
                        intra_day: '<img class="img-thumbnail" width="100%" src="{static_chart_intraday}"/>',
                        weekly: '<img class="img-thumbnail" width="100%" src="{static_chart_7d}"/>',
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
                columns: ['sector', 'symbol', 'headline', 'price_sensitive', 'published_date']
            }
        },
        methods: {
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
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Securities and Announcements Screener'

                t.next()
            }
        }
    }
</script>

