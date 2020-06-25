const styleReg = /(-?\d+\.?\d*)([a-z%]*)/
const separatePI = Math.PI / 2
const easingReg = /(\w+)\s*(\(?\s*[\d\,\. ]*\)?)/      // 将缓冲函数的参数和函数体分离

// 获取rem的值
const REM = window.getComputedStyle?
            parseInt(window.getComputedStyle( document.documentElement ).fontSize) >>> 0 || 10:
            parseInt( document.documentElement.currentStyle['font-size'] )

export {styleReg, separatePI, REM, easingReg}
