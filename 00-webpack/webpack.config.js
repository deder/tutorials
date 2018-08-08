const path = require('path');

module.exports = {
    watch: true,
    entry: './src/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer:{
        contentBase: path.resolve(__dirname, 'dist'),
        open: true
    }
};