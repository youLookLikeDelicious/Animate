"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
// 根据指令自动设置动画配置
// 每个指令返回的是json config
var autoConfig = {
  // 渐现
  // 只要不透明度小于1，就执行动画
  fadeIn: function fadeIn(el) {
    if (this.css(el, 'opacity') < 1) {
      return {
        "opacity": 1
      };
    }
  },
  // 渐隐
  // 只要不透明度大于0就执行动画
  fadeOut: function fadeOut(el) {
    if (this.css(el, 'opacity') > 0) {
      return {
        "opacity": 0
      };
    }
  },
  // 自动渐隐渐现
  fadeToggle: function fadeToggle(el) {
    if (this.css(el, 'opacity') == 0) {
      return {
        "opacity": 1
      };
    } else if (this.css(el, 'opacity') == 1) {
      return {
        "opacity": 0
      };
    }
  },
  // 向上滑动
  slideUp: function slideUp(el) {
    el.setAttribute('data-direct', 'up');
    var h = el.getAttribute('slideTo'); // 如果元素没有slidTo属性，添加之，值为元素当前的计算高度

    if (!h) {
      h = this.css(el, 'height');
      el.setAttribute('slideTo', h);
    }

    if (h > 0) {
      return {
        height: '0px'
      };
    }
  },
  // 向下滑动
  slideDown: function slideDown(el) {
    el.setAttribute('data-direct', 'down');
    var h = el.getAttribute('slideTo');

    if (this.getStyle(el, 'display', false) === 'none') {
      el.style.display = el.dataset ? el.dataset.display || 'block' : el.getAttribute('data-display') || 'block';
    } // 没有slideTo Attribute 添加之


    if (!h) {
      h = this.css(el, 'height');
      el.setAttribute('slideTo', h);
      el.style.height = '0px';
    }

    return {
      height: h + 'px'
    };
  },
  // 自动滑动
  // 1、当前的计算高度为0 向下滑动
  // 2、当前的计算高 > 0 向上滑动
  slideToggle: function slideToggle(el) {
    var curHeight = this.css(el, 'height'),
        // 获取元素当前的高度
    display = this.getStyle(el, 'display', false);

    if (curHeight === 0 || display === 'none') {
      return this.slideDown(el);
    } else if (curHeight > 0) {
      return this.slideUp(el);
    }
  }
};
var _default = autoConfig;
exports["default"] = _default;