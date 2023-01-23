const path = require("path");
const dotenv = require("dotenv");
const webpack = require("webpack");

dotenv.config();

module.exports = {
    entry: "./server.js",
    mode: "production",
    target: "node",
    output: {
        path: path.resolve(__dirname, '.'),
        filename: "server.bundle.js"
    },
    plugins: [
        // read the process.env
        new webpack.DefinePlugin({
           'process.env': JSON.stringify(process.env)
        }),
   ],
   externals: {
       "express": "commonjs express",
   }
}