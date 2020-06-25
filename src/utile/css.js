const scrollTop = 'scrollTop'
export default {
    getStyle (el, styleAttr, isInt = true) {
        if (getComputedStyle) {
            return typeof styleAttr === 'undefined' ? getComputedStyle(el) :
                isInt ? parseInt(getComputedStyle(el)[styleAttr]) : getComputedStyle(el)[styleAttr];
        } else {
            return typeof styleAttr === 'undefined' ? el.currentStyle :
                isInt ? parseInt(el.currentStyle[styleAttr]) : el.currentStyle[styleAttr];
        }
    },
    /**
     * DOM对象的css操作(赋值，获取值)
     * 取值的时候，如果style === undefined 返回整个currentStyle
     * [获取值: return number]
     * @param {HTMLElement} el 
     * @param {String} styleAttr 
     * @param {String | Number} val 
     */
    css (el, styleAttr, val) {
        let styleValue = '', originDisplay = '';

        switch (arguments.length) {
            case 1:
            case 2: 
                if (styleAttr === scrollTop) {
                    return el.scrollTop
                }
                // 获取值的操作,如果没有指定属性，获取所有属性
                styleValue = this.getStyle(el, styleAttr, val)

                // 获取display == 'none'的高度或宽度
                if (isNaN(styleValue) && (styleAttr == 'height' || styleAttr == 'width')) {
                    originDisplay = this.getStyle(el, 'display', false);

                    this.css(el, 'visibility', 'hidden')
                    this.css(el, 'display', 'block')
                    styleValue = this.getStyle(el, styleAttr)
                    this.css(el, 'display', originDisplay)
                    this.css(el, 'visibility', '')
                }

                return styleValue
            break
            case 3: 
                // 赋值操作
                if (styleAttr === scrollTop) {
                    el.scrollTop = val
                    return
                }
                el.style[styleAttr] = val
            break
        }
    }
}
