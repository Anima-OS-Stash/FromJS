var webpack = require('webpack');
var WebpackShellPlugin = require("webpack-shell-plugin")
var getBaseConfig = require("./getBaseConfig")

var webConfig = getBaseConfig()
webConfig.entry = {
    background: ['./chrome-extension/background.js'],
    from: ['./src/from.js'],
    inspector: ['./src/inspector.js'],
    injected: ["./chrome-extension/injected.js"],
    resolveFrameWorker: ["./src/resolveFrameWorker.js"],
    inhibitJavaScriptExecution: ["./chrome-extension/inhibitJavaScriptExecution.js"]
};
webConfig.output = {
    path: "./",
    filename: 'chrome-extension/dist/[name].js'
};
webConfig.plugins.push(new WebpackShellPlugin({
    onBuildExit: [
        `
        cp src/fromjs.css chrome-extension/dist/fromjs.css
        cp chrome-extension/dist/from.js dist/from.js
        cp chrome-extension/dist/from.js.map dist/from.js.map
        cp chrome-extension/dist/inspector.js dist/inspector.js
        cp chrome-extension/dist/inspector.js.map dist/inspector.js.map
        cp chrome-extension/dist/resolveFrameWorker.js dist/resolveFrameWorker.js
        cp chrome-extension/dist/resolveFrameWorker.js.map dist/resolveFrameWorker.js.map
        cp chrome-extension/icon.png chrome-extension/dist/icon.png;
        cp chrome-extension/manifest.json chrome-extension/dist/manifest.json;
        echo 'Finished onBuildExit';
        `
    ]
}),
new webpack.DefinePlugin({
    'VERSION': "\"" + require("../chrome-extension/manifest.json").version + "\""
})
)

var serverConfig = getBaseConfig()
serverConfig.entry = {
    server: ['./server.js'],
    extensionHelperServer: ['./src/extensionHelperServer.js']
};
serverConfig.output = {
    path: "./",
    filename: './dist/[name].js'
};
serverConfig.target = "node"
serverConfig.node.__dirname = false
serverConfig.node.__filename = false

module.exports = [webConfig, serverConfig]
