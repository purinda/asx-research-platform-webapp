var Field = Backbone.Model.extend({
    defaults: {
        field: null,
        type: null,
        display_name: '',
        measurement_type: '',
        min: 0,
        max: 0,
        enabled: false,
        help: null
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

var FieldCollection = Backbone.Collection.extend({
    model: Field,
    url: appParameters.get('endpoint') + 'screener/fields',
    parse: function (response) {
        return response.data;
    }
})

export {
    Field,
    FieldCollection
}
