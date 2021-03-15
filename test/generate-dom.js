const jsdom = require('jsdom')
const {
    JSDOM
} = jsdom

/**
 * 生成一个jsdom 用于测试
 * 
 */
const template = `<!DOCTYPE html>
<html font-size="62.5%" style="font-size: 12px" lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div>chaos-xy</div>
    <div class="canvas">
        <a><img src=""/></a>
        <a><img src=""/></a>
        <a><img src=""/></a>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
        </ul>
    </div>
</body>
</html>`

global.jsdom = new JSDOM(template, {
    resources: 'usable',
    pretendToBeVisual: true,
    runScripts: "dangerously"
})

global.window = global.jsdom.window
global.document = global.jsdom.window.document
global.div = global.document.querySelector('div')
