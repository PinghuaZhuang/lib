// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
        // allowImportExportEverywhere: true
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        // 'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        // 'standard',
        'jquery'
    ],

    // required to lint *.vue files
    plugins: [
        // 'vue',
        // 'html'
    ],

    globals: {
		define: true,
        module: true,
        Promise: true,
        require: true,
        WeakMap: true,
        WeakSet: true,
        $: true,
        describe: true,
        it: true,
        mocha: true,
        expect: true,
        z: true,
        VERSION: true,
        ActiveXObject: true,
        Symbol: true,
	},

    // add your custom rules here
    rules: {

        // 变量可以申明不使用
        "no-unused-vars": "off",

        // * 号前面空格
        'generator-star-spacing': [ 'error', { 'before': true, 'after': false } ],

        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

        // 缩进
        'indent': [ 'error', 4 ],

        // 使用单引号
        'quotes': [ 'error', 'single' ],

        // window 下的换行 CRLF
        'linebreak-style': [ 'error', 'windows' ],

        // 空行可以有多个, true: 只能有一行
        'no-multiple-empty-lines': 'off',
        // 多个空格
        // a  =    19;
        // 行尾注释多个空格
        // 'no-multi-spaces': [ 'error', {
        //     exceptions: {
        //         'VariableDeclarator': true
        //     },
        //     ignoreEOLComments: true
        // } ],

        // 行注释位置
        'line-comment-position': 'off',
        'lines-around-comment': 'off',

        // 函数前空格
        'space-before-function-paren': [ 'error', {
            'anonymous': 'always',      // 匿名函数
            'named': 'always'           // 申明函数
        } ],

        // 代码后面内联注释
        'no-inline-comments': 'off',

        // 分号
        'semi': 'off',

        // 与 null 对比较
        'eqeqeq': [ 'error', 'always', { 'null': 'ignore' } ],

        // 对象最后的分号
        'comma-dangle': 'off'
    }
}
