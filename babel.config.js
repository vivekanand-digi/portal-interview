module.exports = {
    ignore: [/(node_module)/],
    presets: ['@babel/env', '@babel/react'],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-async-to-generator',
        '@babel/transform-arrow-functions',
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties'
    ]
};
