// config.js
// =========
const bodyParser = require('body-parser');
module.exports = {
    port:3000,
    secret:'dzahohoifjzpnfpozanf897fzafZDZf9gf7fdZf74987zf4f9FZFZ',
    urlEncodedParser:bodyParser.urlencoded({extended: false})
};