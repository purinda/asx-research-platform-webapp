<template>
    <div>
        <div v-for="field in fields" class="row">
            <div class="col-xs-12">
                {{ field.display_name }} ({{ field.measurement_type }})
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

        <pre v-if="debug">{{ filters | json}}</pre>
    </div>
</template>

<script>
    var CompanyScreener = require('../../models/filters/company-screener').CompanyScreener
    var RangeFieldCollection = require('../../models/filters/range-field').RangeFieldCollection

    // Required to be defined outside the component definition to initialise the backbone collection for component
    // to start using data structure
    var screener = new CompanyScreener()
    var fields = new RangeFieldCollection()

    module.exports = {
        name: 'screener-filter',
        data: function () {
            return {
                screener: screener,
                companies: screener.toJSON(),
                filters: {},
                fields: [],
                debug: true
            }
        },
        methods: {
            fetch: function () {
                this.screener.fetch({market_capitalisation: 'test'})
            }
        },
        created: function () {
            // Load fields
            fields.fetch()
            this.fields = fields.toJSON()
        },
        route: {
            activate: function (t) {
                this.$parent.$parent.$data.title = 'Securities Screener'

                // Fetch from the API endpoint
                this.fetch()

                // Reload vue-table
                this.companies = this.screener.toJSON()


                t.next()
            }
        }
    }
</script>

