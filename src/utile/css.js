export default {
    getStyle (el, styleAttr) {
        if (getComputedStyle) {
            return typeof styleAttr === 'undefined' ? getComputedStyle(el) :
                parseInt(getComputedStyle(el)[styleAttr]);
        } else {
            return typeof styleAttr === 'undefined' ? el.currentStyle : parseInt(el.currentStyle[styleAttr]);
        }
    },
    // DOM对象的css操作(赋值，获取值)
    // 取值的时候，如果style === undefined 返回整个currentStyle
    // [获取值: return number]
    css (el, styleAttr, val) {
        let styleValue = '', tmpDisplay = '';

        if (arguments.length == 3) {
            // 赋值操作
            el.style[styleAttr] = val
        } else {
            // 获取值的操作,如果没有指定属性，获取所有属性
            styleValue = this.getStyle(el, styleAttr, val)

            // 获取display == 'none'的高度或宽度
            if (isNaN(styleValue) && (styleAttr == 'height' || styleAttr == 'width')) {
                tmpDisplay = this.css(el, 'display');

                this.css(el, 'visibility', 'hidden')
                this.css(el, 'display', 'block')
                styleValue = this.getStyle(el, styleAttr)
                this.css(el, 'display', tmpDisplay)
                this.css(el, 'visibility', '')
            }

            return styleValue
        }
    }
}
