var webpack = require('webpack');
var WebpackShellPlugin = require("webpack-shell-plugin")
var getBaseConfig = require("./getBaseConfig")

var webConfig = getBaseConfig()
webConfig.entry = {
    background: ['./code-preprocessing-test/background.js'],
    ChromeCodeInstrumenterBeforeEmbedding: ["./chrome-extension/ChromeCodeInstrumenter.js"]
};
webConfig.output = {
    path: "./",
    filename: 'code-preprocessing-test/dist/[name].js'
};
webConfig.plugins.push(new WebpackShellPlugin({
    onBuildExit: [
        `
        node scripts/embed-scripts-in-instrumenter.js
        cp code-preprocessing-test/manifest.json code-preprocessing-test/dist/manifest.json;
        echo 'Finished onBuildExit';
        `
    ]
})
)

module.exports = [webConfig]
