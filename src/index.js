import './utile/compatibility'
import Animate from './core/Animate'

var animateInstance = new Animate()

function init () {
    animateInstance.animate(...arguments)
}

animateInstance.bind(init)

if (window) {
    window.Animate = init
}

export { animateInstance }
export default init
