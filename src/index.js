import Animate from './Animate'
import {BannerAnimation} from "./extends";
import './compatibility'


const animate = new Animate();

// 安装插件
animate.extend({
    bannerFader: function (container, config = {}) {
        new BannerAnimation(container, config);
    }
});
if (window) {
    window.Animate = animate
}
export default animate
