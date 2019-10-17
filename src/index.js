import Animate from './core/Animate'
import './utile/compatibility'
import BannerAnimation from "./extension/extends"

const animate = new Animate();

// 安装插件
animate.extend({
    bannerFader: function (container, config = {}) {
        let arg = Array.prototype.slice.call(arguments,0)
        arg.push(this)
        new BannerAnimation(...arg);
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
