import BannerAnimation from './extension/extends'
import { animateInstance } from './index'

animateInstance.extend({
    bannerFader: function (container, config = {}) {
        return new BannerAnimation(container, config, this)
    }
})
