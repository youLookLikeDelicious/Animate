import AniInstance from './AnimateInstance'
import easing from '../utile/easing'
import Css from '../utile/css'
import{REM, styleReg, easingReg} from "../utile/macro"
import AnimateInstance from './AnimateInstance'
import addHandler from '../utile/add-handler'

class Animate {
    constructor () {
        this.timers = []; // 不同元素对象的动画队列
        // 动画的缓冲函数
        // 扩展插件
        this.plugins = {};
        this._timer = this.timer.bind(this)
        this._relation = ''
    }

    /**
     * 判断一个对象是否是元素节点
     * 
     * @param {mixed} el
     */
    isElement (el) {
        return typeof window.HTMLElement === 'function' ? el instanceof window.HTMLElement : el && typeof el === 'object' && el.nodeType === 1
    }
    /**
     * 判断当前元素是否有动画实例
     * @param {DOM} el 
     * 
     * @return {Number}
     */    
    hasAnimate (el) {
        let timers = this.timers

        for (let i = 0, len = timers.length; i < len; i++) {
            if (timers[i].el === el) {
                return i
            }
        }
        return false;
    }
    // 实例化对象入口函数
    // 一个元素对象只能实例化一个AniInstance对象
    animate (el, config, callback = null) {
        if (!this.isElement(el)) {
            return
        }
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
                    this[i] = plugin[i]
                    if (this._relation) {
                        this._relation[i] = plugin[i]
                    }
                } else {
                    // 如果属性名称冲突，抛出报错信息
                    new Error('Animate already has this attribute ' + i)
                }
            }
        }
    }
    /**
     * 更新动画
     * @param {Object AnimateInstance} instance 
     * @param {DOMHighResTimeStamp} timestamp 
     * 
     * return 是否完成动画
     */
    tick (instance, timestamp) {
        let i = 0, val,
            config = instance.curConfig(), // 动画相关配置
            easing = this[config.easing], // 动画使用的缓存
            el = instance.el, // 执行动画的dom元素
            computeVal = config.computeVal, // dom属性的增加量
            cur_val = config.cur_val, // dom属性的起始值
            percent = (Date.now() - config.startTime) / config.duration;

        percent = percent > 1 ? 1 : parseFloat(percent); // 防止溢出

        for (let item in computeVal) {
            // dom属性赋值操作
            // 对象元素予以遍历
            val = cur_val[item] + computeVal[item] * this[config.easing](percent, ...config.easingArguments);
            
            this.css(el, item, val + config.unit[item].ext)

            ++i
        }

        return percent == 1;
    }
    
    /**
     * 更新所有的动画
     * 
     * @param {DOMHighResTimeStamp} timestamp
     */
    timer (timestamp) {
        let AniInstance; // 动画配置实例

        // 执行动画
        for (let i = 0, len = this.timers.length; i < len; i++) {
            AniInstance = this.timers[i];

            // 判断动画是否结束, true为结束
            if (this.tick(AniInstance, timestamp)) {
                // 执行回调
                let callback = AniInstance.curConfig().hasOwnProperty('callback') ? AniInstance.curConfig().callback : null;

                // 将动画配置实例退出队列
                if (!AniInstance.dequeue()) {
                    // 某个元素的一个动画结束，并且在队列中有下一个动画
                    this.timers.splice(i, 1);
                    --len; // 队列长度减一
                }

                if (callback) {
                    callback(AniInstance.el)
                }
            }
        }

        // length === 0 结束动画
        if (this.timers.length === 0) {
            this.finish()
            return
        }

        this.interval = window.requestAnimationFrame(this._timer)
    }
    
    /**
     * 开始执行动画
     */
    start () {
        if (!this.interval) {
            this.interval = window.requestAnimationFrame(this._timer);
        }
    }
    
    /**
     * 结束动画
     */
    finish () {
        window.cancelAnimationFrame(this.interval)
        this.interval = undefined
    }

    /**
     * 
     * @param {Object} obj 
     */
    bind (ref) {
        this._relation = ref
        Object.assign(ref, this)
        Object.assign(ref, Animate.prototype)
    }
}

Animate.prototype.__AnimateInstance = AnimateInstance
Object.assign( Animate.prototype, Css )
Object.assign( Animate.prototype, easing)
Object.assign( Animate.prototype, { addHandler })
Object.assign( Animate.prototype, { REM, styleReg, easingReg} )
export default Animate
