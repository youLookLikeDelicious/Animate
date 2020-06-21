"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _css = _interopRequireDefault(require("../utile/css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 扩展插件
 * 1、banner渐隐效果
 * @param container banner动画部分的顶级dom元素
 * @param json  config  相关配置，长度宽度等
 * @param animate Animate的实例话对象
 */
var BannerAnimation =
/*#__PURE__*/
function () {
  function BannerAnimation(container, config, animate) {
    _classCallCheck(this, BannerAnimation);

    this.container = container; // 模板容器

    this.aEles = container.getElementsByTagName('a'); // 容器下的a标签

    this.lis = container.getElementsByTagName('li'); // 容器下的li标签

    this.animate = animate; // 如果只有一张图片，不启动动画

    if (this.aEles.length === 1) return;
    this.curIndex = 0;
    this.preIndex = this.maxIndex = this.aEles.length - 1;
    this.speed = config.hasOwnProperty('speed') ? config.speed : 370; // 动画速度, 单位毫秒

    this.interval = config.hasOwnProperty('interval') ? config.interval : 5000; // 再次执行动画的间隔

    this.timer; // 定时器

    this.init();
  } // 初始化设置


  _createClass(BannerAnimation, [{
    key: "init",
    value: function init() {
      var _this = this,
          aEles = this.aEles,
          lis = this.lis; // 监听鼠标事件


      for (var i = 0, len = aEles.length; i < len; i++) {
        // 鼠标移入移除事件
        window.addHandler(aEles[i], 'mouseover', function (event) {
          return _this.mouseOverListener(event);
        });
        window.addHandler(aEles[i], 'mouseout', function (event) {
          return _this.mouseOutListener(event);
        }); // 添加li的点击事件

        window.addHandler(lis[i], 'mouseover', function (event) {
          return _this.overLiListener(event);
        }, true); // 为每个li添加索引

        lis[i].setAttribute('data-index', i);
        aEles[i].style.transitionDuration = this.speeds + 'ms';
      } // 设置第一张的zIndex为1


      this.aEles[0].style.zIndex = 1; // 开始启用动画

      this.timer = window.setTimeout(function () {
        return _this.start();
      }, this.interval);
    } // 鼠标移到img \ a标签时的事件

  }, {
    key: "mouseOverListener",
    value: function mouseOverListener() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
      // 取消冒泡
      if (event.stopPropagation) event.stopPropagation();else event.cancelBubble = true;
      this.stop();
    } // 鼠标移除img \ a标签的事件

  }, {
    key: "mouseOutListener",
    value: function mouseOutListener() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
      // 取消冒泡
      if (event.stopPropagation) event.stopPropagation();else event.cancelBubble = true;

      var _this = this;

      this.stop();
      this.timer = window.setTimeout(function () {
        return _this.start();
      }, this.interval);
    } // 鼠标移入li事件

  }, {
    key: "overLiListener",
    value: function overLiListener() {
      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.event;
      // 事件源
      var srcEle = event.target || event.srcElement,
          index;

      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      } // 处理IE下的li鼠标触摸事件


      if (srcEle.tagName === 'I') return; // 设置当前索引

      index = parseInt(srcEle.getAttribute('data-index')); // 如果要显示的图片索引 等于 当前索引， 不做任何处理

      if (this.curIndex === index) {
        return;
      } // 将前一张的层级设为0


      this.aEles[this.preIndex].style.zIndex = 0; // 设置上一张图片的索引

      this.preIndex = this.curIndex; // 更改当前索引

      this.curIndex = index === 0 ? this.maxIndex : index - 1; // 开始自动播放

      this.start(false);
    } // 开始执行banner动画
    // @param flag false preIndex = this.index

  }, {
    key: "start",
    value: function start() {
      var _this2 = this;

      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var lis = this.lis,
          aEles = this.aEles; // 将当前位置的li属性设为on

      for (var i = 0; i <= this.maxIndex; i++) {
        lis[i].className = '';
      }

      if (flag) {
        this.preIndex = this.curIndex;
      } // 索引加一


      if (++this.curIndex > this.maxIndex) {
        this.curIndex = 0;
      }

      var _this = this;

      this.animate.css(aEles[this.curIndex], 'opacity', 0);
      aEles[this.curIndex].style.zIndex = 2; // 修改li的样式

      lis[this.curIndex].className = 'on'; // 开始执行转换动画

      this.animate(aEles[this.curIndex], {
        opacity: 1,
        duration: this.speed
      }, function (item) {
        _this.aEles[_this.preIndex].style.zIndex = 0;

        _this2.animate.css(_this.aEles[_this.preIndex], 'opacity', 0);

        if (item.style.zIndex == 2) item.style.zIndex = 1;

        _this.stop();

        _this.timer = window.setTimeout(function () {
          return _this.start();
        }, _this2.interval);
      }, {
        buffer: 'speedDownIn'
      });
    } // 清除定时器

  }, {
    key: "stop",
    value: function stop() {
      if (this.timer === null) return;
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }]);

  return BannerAnimation;
}();

var _default = BannerAnimation;
exports["default"] = _default;