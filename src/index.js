import './utile/compatibility'
import Animate from './core/Animate'
import BannerAnimation from './extension/extends'

var animate = new Animate()

// 安装插件
animate.extend({
    bannerFader: function (container, config = {}) {
        new BannerAnimation(container, config || {}, this)
    }
});

function init () {
    animate.animate(...arguments)
}

Object.assign(init, animate)
Object.assign(init, Animate.prototype)

if (window) {
    window.Animate = init
}

export default init
