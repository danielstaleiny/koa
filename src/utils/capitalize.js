// returns string with first capital letter
// params : string > string
const toUpperFirst = str => `${str.charAt().toUpperCase()}${str.substr(1)}`
module.exports = (str = '') => toUpperFirst(str.toLowerCase())
