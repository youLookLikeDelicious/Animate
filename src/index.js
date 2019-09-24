import {buffers} from "./global";
import aniInstance from './AnimateInstance.js';
/*v1.0.0 兼容IE >= 9*/
// rem自适应
//(function (doc, win) {
//    var docEl = doc.documentElement,
//        recalc = function () {
//            var clientWidth = docEl.clientWidth;
//            if (!clientWidth) return;
//            var tmp = clientWidth / 160;
//            docEl.style.fontSize = (tmp < 10? 10 : tmp) + 'px';
//            docEl.style.display = "none";
//            docEl.clientWidth; // Force relayout - important to new Android devices
//            docEl.style.display = "";
//        };
//
//    // Abort if browser does not support addEventListener
//    if (!doc.addEventListener) return;
//
//    // Test rem support
//    var div = doc.createElement('div');
//    div.setAttribute('style', 'font-size: 1rem');
//
//    // Abort if browser does not recognize rem
//    if (div.style.fontSize != "1rem") return;
//
//    win.addEventListener('resize', recalc, false);
//    doc.addEventListener('DOMContentLoaded', recalc, false);
//})(document, window);

// 兼容性处理
(function () {
    'use strict';
    if (!window) return; // 服务端不需要执行
    // 事件绑定函数，兼容ie>=9
    function addHandler(obj, type, handler, flag = false) {
        if (obj.addEventListener) {
            // 标准浏览器方式
            obj.addEventListener(type, handler, flag);
        } else if (obj.attachEvent) {
            // IE的方式
            obj.attachEvent('on' + type, handler);
        } else {
            // 使用DOM一级的方式,无法给同一个事件源添加多个监听器
            obj['on' + type] = handler;
        }
    }
    window.addHandler = addHandler;

    if (!Date.now)
        Date.now = function () {
            return new Date().getTime()
        };

    var vp,
        i = 0,
        venders = ['webkit', 'mos'],
        len = venders.length,
        animationframe_interval = 1000 / 60;
    var ios6Pattern = /iP(ad|hone|od).*OS 6/;
    if (!window.requestAnimationFrame) {
        for (; i < len; i++) {
            vp = venders[i];
            window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame']
        }

    }
    // ios6 is buggy, use timeOut instead of requestAnimationFrame
    if (ios6Pattern.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        window.requestAnimationFrame = function (callback) {
            return window.requestAnimationFrame.animationID = setTimeout(function () {
                window.requestAnimationFrame.animationCallback = callback;
                callback();
            }, animationframe_interval);
        };
        window.requestAnimationFrame.animationCallback = null;
        window.requestAnimationFrame.animationID = null;
        window.cancelAnimationFrame = window.clearTimeout;

        // add document listener
        if (document.visibilityState) {
            addHandler(document, 'visibilitychange', function () {
                if (document.visibilityState == 'hidden') {
                    // 当浏览器处于hidden状态时（最小化或后台运行），停止动画
                    window.cancelAnimationFrame(window.requestAnimationFrame.animationID)
                } else if (document.visibilityState == 'show') {
                    // 当浏览器处于show状态时，开始动画
                    window.requestAnimationFrame(window.requestAnimationFrame.animationCallback);
                }
            });
        }
    }
})();


class Animate {
    constructor() {
        this.timers = []; // 不同元素对象的动画队列

        // 动画的缓冲函数
        this.buffers = buffers
        // 扩展插件
        this.plugins = {};
    }

    /**
     * 判断当前元素是否有动画实例
     * return mixed 实例在timers堆栈中的位置 | false
     */
    hasAnimate(elem) {
        var timers = this.timers;

        for (let i = 0, len = timers.length; i < len; i++) {
            if (timers[i].elem === elem)
                return i;
        }
        return false;
    }
    // 实例化对象入口函数
    // 一个元素对象只能实例化一个aniInstance对象
    animate(elem, config, duration, delay = null, callback = null) {
        var timersIndex = this.hasAnimate(elem);

        if (timersIndex === false) {
            return new aniInstance(elem, config, duration, delay, callback);
        } else {
            //入队操作
            this.timers[timersIndex].animate(config, duration, delay, callback);
        }
    }
    // 用于扩展插件,只接收json对象
    extend(plugin) {
        if (Object.prototype.toString.call(plugin) === '[object Object]') {
            for (let i in plugin) {
                if (!this.hasOwnProperty(i)) {
                    this[i] = plugin[i];
                } else {
                    // 如果属性名称冲突，抛出报错信息
                    new Error('Animate already has this attribute ' + i);
                }
            }
        }
    }

    /**
     * 对获取style属性做兼容处理
     */
    getStyle(el, styleAttr) {
        if (getComputedStyle) {
            return typeof styleAttr === 'undefined' ? getComputedStyle(el) :
                parseInt(getComputedStyle(el)[styleAttr]);
        } else {
            return typeof styleAttr === 'undefined' ? el.currentStyle : parseInt(el.currentStyle[styleAttr]);
        }
    }
    // DOM对象的css操作(赋值，获取值)
    // 取值的时候，如果style === undefined 返回整个currentStyle
    // [获取值: return number]
    css(elem, styleAttr, val) {
        var styleValue, tmpDisplay

        if (arguments.length == 3) {
            // 赋值操作
            elem.style[styleAttr] = val
        } else {
            // 获取值的操作,如果没有指定属性，获取所有属性
            styleValue = this.getStyle(elem, styleAttr, val)

            // 获取display == 'none'的高度
            if (isNaN(styleValue) && styleAttr == 'height') {
                tmpDisplay = this.css(elem, 'display');

                this.css(elem, 'visibility', 'hidden')
                this.css(elem, 'display', 'block')
                styleValue = this.getStyle(elem, styleAttr)
                this.css(elem, 'display', tmpDisplay)
                this.css(elem, 'visibility', '')
            }

            return styleValue
        }
    }

    /**
     * 更新动画
     * return 动画是否完成
     */
    tick(instance) {
        var val,
            config = instance.curConfig(),          // 动画相关配置
            buffer = this.buffers[config.buffer],   // 动画使用的缓存
            elem   = instance.elem,                 // 执行动画的dom元素
            now    = Date.now(),                    // 当前时间
            cur_val = config.cur_val,               // 属性的起始值
            compute_val = config.compute_val,       // dom属性的增加量
            percent = (now - config.startTime) / config.duration;

        percent = percent > 1 ? 1 : percent;        // 防止溢出

        // dom属性赋值操作
        for (let i in compute_val) {
            // 对象元素予以遍历
            let computedBuffer = buffer(percent, ...config.bufferArguments)
            // 属性的初值 + 相对于当前时间需要 附加的增量
            val = cur_val[i] + compute_val[i] * computedBuffer
            this.css(elem, i, val + config.unit)
        }

        return percent == 1;
    }
    // 指定间隔执行一次
    timer() {
        var _this = this;

        return function () {
            var aniInstance; // 动画配置实例
            // 执行动画
            for (let i = 0, len = _this.timers.length; i < len; i++) {
                aniInstance = _this.timers[i];

                // 判断动画是否结束, true为结束
                if (_this.tick(aniInstance)) {

                    // 执行回调
                    var callback = aniInstance.curConfig().hasOwnProperty('callback') ? aniInstance.curConfig().callback : null;

                    if (callback) {
                        callback(aniInstance.elem)
                    }

                    // 将动画配置实例退出队列
                    if (!aniInstance.dequeue()) {
                        // 某个元素的一个动画结束，并且在队列中有下一个动画
                        _this.timers.splice(i, 1);
                        --len; // 队列长度减一
                    }
                }
            }
            if (_this.isFinish()) {
                _this.finish();
            } else {
                _this.interval = requestAnimationFrame(_this.timer());
            }

            _this = null;
        }
    }
    // 开始执行动画
    start() {
        if (!this.interval) {
            this.interval = requestAnimationFrame(this.timer());
        }
    }
    // 判断动画是否结束
    isFinish() {
        return !this.timers.length;
    }
    // 结束动画操作
    finish() {
        var _this = this;
        this.interval = null;
        cancelAnimationFrame(_this.interval);
        // 用于不支持requestAnimation的浏览器清除定时器
        if (requestAnimationFrame.hasOwnProperty('animationID')) {
            requestAnimationFrame.animationID = null;
            requestAnimationFrame.animationCallback = null;
        }
    }
}
const animate = new Animate();

/**
 * 扩展插件
 * 1、banner滑动插件
 * @param json  config  相关配置，长度宽度等
 */
class BannerAnimation {
    constructor(container, config) {
        this.container = container; // 模板容器
        this.aEles = container.getElementsByTagName('a'); // 容器下的a标签
        this.lis = container.getElementsByTagName('li'); // 容器下的li标签

        // 如果只有一张图片，不启动动画
        if (this.aEles.length === 1) return;

        this.curIndex = 0;
        this.preIndex = this.maxIndex = this.aEles.length - 1;
        this.speed = config.hasOwnProperty('speed') ? config.speed : 370; // 动画速度, 单位毫秒
        this.interval = config.hasOwnProperty('interval') ? config.interval : 5000; // 再次执行动画的间隔
        this.timer; // 定时器

        this.init();
    }
    // 初始化设置
    init() {
        var _this = this,
            aEles = this.aEles,
            lis = this.lis;
        // 监听鼠标事件
        for (let i = 0, len = aEles.length; i < len; i++) {
            // 鼠标移入移除事件
            window.addHandler(aEles[i], 'mouseover', (event) => _this.mouseOverListener(event));
            window.addHandler(aEles[i], 'mouseout', (event) => _this.mouseOutListener(event));
            // 添加li的点击事件
            window.addHandler(lis[i], 'mouseover', (event) => _this.overLiListener(event), true);
            // 为每个li添加索引
            lis[i].setAttribute('data-index', i);
            aEles[i].style.transitionDuration = this.speeds + 'ms';
        }
        // 设置第一张的zIndex为1
        this.aEles[0].style.zIndex = 1;
        // 开始启用动画
        this.timer = window.setTimeout(() => _this.start(), this.interval);
    }
    // 鼠标移到img \ a标签时的事件
    mouseOverListener(event = window.event) {
        // 取消冒泡
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;

        this.stop();
    }
    // 鼠标移除img \ a标签的事件
    mouseOutListener(event = window.event) {
        // 取消冒泡
        if (event.stopPropagation) event.stopPropagation();
        else event.cancelBubble = true;
        var _this = this;

        this.stop();
        this.timer = window.setTimeout(() => _this.start(), this.interval);
    }
    // 鼠标移入li事件
    overLiListener(event = window.event) {
        // 事件源
        var srcEle = event.target || event.srcElement,
            index;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }

        // 处理IE下的li鼠标触摸事件
        if (srcEle.tagName === 'I') return;
        // 设置当前索引
        index = parseInt(srcEle.getAttribute('data-index'));

        // 如果要显示的图片索引 等于 当前索引， 不做任何处理
        if (this.curIndex === index) {
            return;
        }
        // 将前一张的层级设为0
        this.aEles[this.preIndex].style.zIndex = 0;
        // 设置上一张图片的索引
        this.preIndex = this.curIndex;
        // 更改当前索引
        this.curIndex = index === 0 ? this.maxIndex :
            index - 1;

        // 开始自动播放
        this.start(false);
    }
    // 开始执行banner动画
    // @param flag false preIndex = this.index
    start(flag = true) {
        var lis = this.lis,
            aEles = this.aEles;

        // 将当前位置的li属性设为on
        for (let i = 0; i <= this.maxIndex; i++) {
            lis[i].className = '';
        }

        if (flag) {
            this.preIndex = this.curIndex;
        }
        // 索引加一
        if (++this.curIndex > this.maxIndex) {
            this.curIndex = 0;
        }

        let _this = this;

        window.Animate.css(aEles[this.curIndex], 'opacity', 0);

        aEles[this.curIndex].style.zIndex = 2;
        // 修改li的样式
        lis[this.curIndex].className = 'on';
        // 开始执行转换动画
        window.Animate.animate(aEles[this.curIndex], {
            opacity: 1
        }, this.speed, (item) => {
            _this.aEles[_this.preIndex].style.zIndex = 0;
            window.Animate.css(_this.aEles[_this.preIndex], 'opacity', 0);
            if (item.style.zIndex == 2)
                item.style.zIndex = 1;
            _this.stop();
            _this.timer = window.setTimeout(() => _this.start(), this.interval)
        }, {
            buffer: 'speedDownIn'
        });

    }
    // 清除定时器
    stop() {
        if (this.timer === null) return;
        window.clearTimeout(this.timer);
        this.timer = null;
    }
}
animate.extend({
    bannerFader: function (container, config = {}) {
        new BannerAnimation(container, config);
    }
});
window.Animate = animate
