var numeral = require('numeral')

class Utility {
    humanFriendlyNumber(value) {
        return numeral(value).format('0.00a')
    }
}

export default new Utility