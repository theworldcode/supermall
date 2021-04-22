module.exports = {
    plugins: {
        autoprefixer: {},
        "postcss-px-to-viewport": {
            viewportWidth: 375, //视窗的宽度，对应设计稿的宽度
            viewportHeight: 375, //视窗的高度，对应设计稿的高度
            unitPrecision: 5, //指定‘px’转化为视窗单位值的小数位数
            viewportUnit: 'vw', //指定需要转换成的视窗单位，建议使用vw
            selectorBlackList: ['ignore', 'tab-bar', 'tab-bar-item'], //指定不需要转换的类
            minPixelValue: 1, //小于或等于1px不转换为视窗单位
            mediaQuery: false, //允许在媒体查询中转换’px‘
            exclude: [/TabBar/]
        }
    }
}