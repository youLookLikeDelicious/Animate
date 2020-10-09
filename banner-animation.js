import BannerAnimation from './src/extension/extends'
import { animateInstance } from './src/index'

animateInstance.extend({
    bannerFader: function (container, config = {}) {
        return new BannerAnimation(container, config, this)
    }
})
