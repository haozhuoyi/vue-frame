module.exports = {
    presets: [
        ['@vue/app', {
            // loose: true,
            useBuiltIns: 'entry'
        }],
        ["@babel/preset-env", {
            "modules": false
        }]
    ],
    plugins: [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ]
    ]
}
