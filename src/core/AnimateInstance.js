import{REM, styleReg, easingReg} from "../utile/macro"
import css from '../utile/css'
import predefinedAnimate from '../extension/predefined-animate'

// 默认动画速度,单位毫秒
const speeds = {
    fast: 200,
    slow: 2000,
    _default: 700
}



// 一个元素对象对应的一个或多个动画效果
class AnimateInstance{
    /**
     * @param el 元素对象
     * @param config json
     * @param callback 回调函数
     * @para parent Animate实例
     */
    constructor (el, config, callback, parent) {

        this.parent = parent

        this.queue = []

        this.el = el

        this.speeds = speeds
        
        this.animate(config, callback)
    }

    /**
     * 获取预定义动画的配置
     */
    getPreDefineAnimate (config) {
        if (config.hasOwnProperty('ani')) {
            // 如果没有预定义动画，结束执行
            if (!this[config['ani']]) {
                return
            }

            let tmpConfig = this[config.ani](this.el)
            Object.assign(config, tmpConfig)
            // 移除预定于动画属性
            // delete(config.ani)
        }
    }
    /**
     * 用于追加动画，将动画推入到队列中
     * @param config
     * @param duration
     * @param delay 当delay为function类型时，默认没有延时
     * @param callback
     */
    animate (config, callback) {
        let _this = this,
            _callback = typeof callback === 'function'? callback : ''

        this.getPreDefineAnimate(config)

        // 判断是否延迟处理
        if (config.delay >>> 0 || _callback >>> 0) {
            window.setTimeout(function () {
                _this.getConfig( config, _callback )
            }, Math.max(config.delay >>> 0, _callback >>> 0))
        } else{
            this.getConfig( config, _callback )
        }
    }

    // 获取当前队列中的元素
    curConfig(){
        return this.queue[1]
    }

    /**
     * 动画入队操作
     * @param {Object} item 
     * @returns {boolean}
     */
    enqueue (item) {
        let timers = this.parent.timers, queue = this.queue
        
        if (queue[0] === 'inProgress') {
            queue.push(item)
        } else{
            // 第一次入队操作
            item['startTime'] = Date.now()
            queue.push('inProgress')
            queue.push(item)
            timers.push(this)
            this.parent.start()
        }

        return true
    }

    /**
     * 判断动画是否移出队列
     * times剩余动画的次数
     * @return boolean
     */
    checkDequeue () {
        if (this.queue[1].times === 'infinite') {
            return false
        }

        if (this.queue[1].times && --this.queue[1].times > 0) {
            return false
        }

        return true
    }
    /**
     * 动画出队操作
     * @param {Boolean} forceDequeue 是否强制出队，作用于有times属性的动画
     * @returns {boolean} 如果有后续动画 true, 如果没有后续动画 false,
     */
    dequeue (forceDequeue = false) {
        // 不允许出队
        if (!this.checkDequeue() && !forceDequeue) {
            return false
        }

        this.queue.shift()
        this.queue.shift()
        // 设置下一个动画效果的起始时间
        if (this.queue.length >= 1) {
            this.queue[0]['startTime'] = Date.now()
        }

        this.queue.unshift('inProgress')
        return this.queue.length >= 2
    }

    /**
     * 获取动画的相关配置
     * @param config
     * @param duration
     * @param callback
     */
    getConfig (config, callback) {
        let i = 0, cur,
            tmp = {},
            el = this.el,
            computeVal = {},
            cur_val = {},
            unit = {}, // 属性的单位
            styles = this.css(el),
            styleStack // dom属性的配置信息

        // 所传的配置参数必须是json对象，否则不予以处理
        if (Object.prototype.toString.call(config) !== '[object Object]') {
            return
        }

        // 获取当前属性的值和总的计算量(目标值-当前值)
        for(let item in config){
            unit[item] = {}
            if(item in styles || item === 'scrollTop'){
                styleStack = isNaN(config[item])? config[item].match(styleReg) || '' : config[item]

                unit[item].ext = styleStack[2] || ''

                // 获取属性当前的值
                cur = this.css(el, item)

                // 如果计算的长度单位是rem，将cur的值转换成rem
                // 相应的，dom元素的属性也应该改变
                if (unit[item].ext === 'rem') {
                    styleStack[1] *= REM
                    unit[item].ext = 'px'
                }

                if(styleStack instanceof Array) {
                    computeVal[item] = styleStack[1] - cur
                } else {
                    computeVal[item] = styleStack - cur
                }

                cur_val[item] = cur
            }

            ++i
        }

        // 获取缓冲函数及其参数
        this.getEasing(config.easing, tmp)

        // 获取动画运行的次数,默认只运行一次
        tmp['times'] = config.hasOwnProperty('times')? config.times : 1

        tmp['cur_val'] = cur_val
        tmp['computeVal'] = computeVal
        tmp['duration'] = !isNaN(config.duration) ? config.duration : config.duration in this.speeds? this.speeds[config.duration] : this.speeds._default
        tmp['unit'] = unit

        // 添加回调函数
        if(typeof callback === 'function') {
            tmp['callback'] = callback
        }

        // 动画入队操作
        this.enqueue(tmp)
        // 结束当前的动画
        if (config.finish === true) {
            // 如果之前有动画，则取消之前的动画，反之不取消
            if(this.queue.length > 2){
                this.dequeue(true)
            }
        }
    }

    /**
     * 添加扩展配置（根据指令，自动设置动画配置）
     * @param obj: Object
     */
    static extend(obj){
        for(let key in obj){
            // 如果AnimateInstance已经拥有obj的key值，抛出异常
            if(AnimateInstance.hasOwnProperty(key)){
                new Error('AnimateInstance already had this property!')
            }
            AnimateInstance.prototype[key] = obj[key]
        }
    }

    /**
     * 获取缓冲函数的配置
     * @param {String} easing 输入的缓冲
     * @param {Object} &tmp 赋值的对象
     */
    getEasing (easing, tmp) {        
        // 将函数体和参数分离
        easing = easing || ''
        easing = easing.match(easingReg)

        // 配置默认的缓冲
        if (!easing || !this.parent[easing[1]]) {
            tmp['easing'] = 'bezier'
            tmp['easingArguments'] = [0.6]
            return
        }

        tmp['easing'] =  easing[1]
        // 提取( 1， 23 )中的参数，保存在数组中
        tmp['easingArguments'] = easing[2].slice(1, -1).replace(' ', '').split(',')
    }
}

AnimateInstance.extend(css)
AnimateInstance.extend(predefinedAnimate)
export default AnimateInstance
