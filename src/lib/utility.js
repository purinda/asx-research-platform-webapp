var numeral = require('numeral')

class Utility {
    commaSeparatedNumber(value) {
        return numeral(value).format('0,0')
    }

    formatPercentage(value) {
        return numeral(value).format('0.00%')
    }

    shortNumber(value) {
        return numeral(value).format('0.00a')
    }
}

export default new Utility