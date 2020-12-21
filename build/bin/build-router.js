var fs = require('fs')
var render = require('json-templater/string')
var path = require('path')
var endOfLine = require('os').EOL
const chalk = require('chalk')

// 标准版配置
var { STANDARD_IMPORT, STANDARD_VIEWS } = require('./../clients/standard/router')

// 客户配置
var CLIENT = process.env.CLIENT || '';
if (CLIENT) {
    var { CLIENT_IMPORT, CLIENT_VIEWS } = require(`./../clients/${CLIENT}/router`)
} else {
    var { CLIENT_IMPORT, CLIENT_VIEWS } = { CLIENT_IMPORT: {}, CLIENT_VIEWS: {}}
}

// 版本信息
var config = require(`./../clients/${CLIENT || 'standard'}/info`);
console.log(chalk.yellow('当前执行版本信息:', config.clientName + '-' + config.version));

// 生成 router/import.js
var IMPORT_OUTPUT_PATH = path.join(__dirname, '../../src/router/import.js');
var IMPORT_IMPORT_TEMPLATE = 'const {{name}} = resolve => require([\'{{path}}\'], resolve);';
var IMPORT_MAIN_TEMPLATE = ` /* 由 build/bin/build-router.js 自动生成 */

// 引入所有页面组件
{{include}}

// 导出所有页面
export {
{{list}}
}
`

var importIncludeTemplate = [];
var importListTemplate = [];

var importObject = STANDARD_IMPORT;
// 更新页面的地址或者增加页面
if (CLIENT) {
    Object.assign(importObject, CLIENT_IMPORT.update);
}
// 删除页面
if (CLIENT) {
    CLIENT_IMPORT.delete.forEach(name => {
        if (importObject[name]) delete importObject[name];
    })
}
for (let name of Object.keys(importObject)) {
    importIncludeTemplate.push(render(IMPORT_IMPORT_TEMPLATE, {
        name: name,
        path: importObject[name]
    }))
    importListTemplate.push(`   ${name}`);
}

var importTemplate = render(IMPORT_MAIN_TEMPLATE, {
    include: importIncludeTemplate.join(endOfLine),
    list: importListTemplate.join(',' + endOfLine)
})

fs.writeFileSync(IMPORT_OUTPUT_PATH, importTemplate);
console.log('[build router/import] DONE:', IMPORT_OUTPUT_PATH);

// 生成 router/client.js
var INDEX_OUTPUT_PATH = path.join(__dirname, '../../src/router/client.js');
var INDEX_INPORT_TEMPLATE = 'import {{name}} from \'{{path}}\';';
var INDEX_MAIN_TEMPLATE =  ` /* 由 build/bin/build-router.js 自动生成 */

import { Home } from 'layout/'
{{include}}

export default {
    path: '/',
    name: 'arc',
    isMenu: true,
    icon: 'iconfont icon-shouye',
    meta:{
        alias: '首页'
    },
    redirect: '/home',
    component: Home,
    children: [
{{list}}
    ]
}
`

var indexIncludeTemplate = [];
var indexListTemplate = [];

var viewsObject = STANDARD_VIEWS;
// 更新模块地址或者增加功能模块
if (CLIENT) {
    Object.assign(viewsObject, CLIENT_VIEWS.update);
}
// 删除功能模块
if (CLIENT) {
    CLIENT_VIEWS.delete.forEach(name => {
        if (viewsObject[name]) delete viewsObject[name];
    })
}
for (let name of Object.keys(viewsObject)) {
    indexIncludeTemplate.push(render(INDEX_INPORT_TEMPLATE, {
        name: name,
        path: viewsObject[name]
    }))
    indexListTemplate.push(`       ${name}`);
}

var indexTemplate = render(INDEX_MAIN_TEMPLATE, {
    include: indexIncludeTemplate.join(endOfLine),
    list: indexListTemplate.join(',' + endOfLine)
})

fs.writeFileSync(INDEX_OUTPUT_PATH, indexTemplate);
console.log('[build router/client] DONE:', INDEX_OUTPUT_PATH);

// 生成版本信息
var CONFIG_OUTPUT_PATH = path.join(__dirname, '../../static/version.json');
fs.writeFileSync(CONFIG_OUTPUT_PATH, JSON.stringify(config));
console.log('[build version] DONE:', CONFIG_OUTPUT_PATH)






