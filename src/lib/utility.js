var numeral = require('numeral')

class Utility {
    formatMoney(value) {
        return numeral(value).format('0.00a')
    }
}

export default new Utility