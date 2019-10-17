import AniInstance from './AnimateInstance'
import easing from '../utile/easing'
import Css from '../utile/css'

class Animate {
    constructor () {
        this.timers = []; // 不同元素对象的动画队列
        // 动画的缓冲函数
        this.easing = easing;
        // 扩展插件
        this.plugins = {};
    }

    // 判断当前元素是否有动画实例
    hasAnimate (el) {
        let timers = this.timers

        for (let i = 0, len = timers.length; i < len; i++) {
            if (timers[i].el === el) {
                return i;
            }
        }
        return false;
    }
    // 实例化对象入口函数
    // 一个元素对象只能实例化一个AniInstance对象
    animate (el, config, callback = null) {
        let timersIndex = this.hasAnimate(el)

        if (timersIndex === false) {
            return new AniInstance(el, config, callback, this)
        } else {
            //入队操作
            this.timers[timersIndex].animate(config, callback)
        }
    }
    // 用于扩展插件,只接收json对象
    extend (plugin) {
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
    // 更新动画
    // return 是否完成动画
    tick (instance) {
        let i, val,
            config = instance.curConfig(), // 动画相关配置
            easing = this.easing[config.easing], // 动画使用的缓存
            el = instance.el, // 执行动画的dom元素
            now = Date.now(), // 当前时间
            computeVal = config.computeVal, // dom属性的增加量
            cur_val = config.cur_val, // dom属性的起始值
            percent = (now - config.startTime) / config.duration;

        percent = percent > 1 ? 1 : percent; // 防止溢出

        for (i in computeVal) {
            // dom属性赋值操作
            // 对象元素予以遍历
            val = cur_val[i] + computeVal[i] * easing(percent);

            this.css(el, i, val + config.unit);
        }

        return percent == 1;
    }
    // 指定间隔执行一次
    timer () {
        let _this = this;

        return function () {
            let AniInstance; // 动画配置实例

            // 执行动画
            for (let i = 0, len = _this.timers.length; i < len; i++) {
                AniInstance = _this.timers[i];

                // 判断动画是否结束, true为结束
                if (_this.tick(AniInstance)) {
                    // 执行回调
                    let callback = AniInstance.curConfig().hasOwnProperty('callback') ? AniInstance.curConfig().callback : null;

                    if (callback) {
                        callback(AniInstance.el)
                    }

                    // 将动画配置实例退出队列
                    if (!AniInstance.dequeue()) {
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
        }
    }
    // 开始执行动画
    start () {
        if (!this.interval) {
            this.interval = requestAnimationFrame(this.timer());
        }
    }
    // 判断动画是否结束
    isFinish () {
        return !this.timers.length
    }
    // 结束动画操作
    finish () {
        let _this = this
        this.interval = undefined
        cancelAnimationFrame(_this.interval)
    }
}

Object.assign( Animate.prototype, Css )
export default Animate
