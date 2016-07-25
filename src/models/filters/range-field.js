var RangeField = Backbone.Model.extend({
    defaults: {
        field: null,
        display_name: '',
        measurement_type: '',
        min: 0,
        max: 0,
        help: ''
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

var RangeFieldCollection = Backbone.Collection.extend({
    model: RangeField,
    url: appParameters.get('endpoint') + 'screener/fields',
    parse: function (response) {
        return response.data;
    }
})

export {
    RangeField,
    RangeFieldCollection
}
