import '../../../src/banner-animation'
describe('test banner animation', function () {
    before(function () {
        window.addHandler = Animate.addHandler
    })

    it('test banner animation', function (done) {
        const canvas = document.querySelector('.canvas')
        const banner = Animate.bannerFader(canvas, {speed: 12, interval: 20})
        assert.ok(true)

        window.setTimeout(function () {
            done()
        }, 1800)

        const mouseOverEvent = document.createEvent('HTMLEvents')
        mouseOverEvent.initEvent('mouseover', false, false)

        const mouseOutEvent = document.createEvent('HTMLEvents')
        mouseOutEvent.initEvent('mouseout', false, false)

        // 获取lis, 测试相关的事件
        const lis = document.querySelectorAll('li')

        window.setTimeout(function () {
            lis.forEach((li, index) => {
                li.dispatchEvent(mouseOverEvent)
                assert.equal(banner.curIndex, index)
                li.dispatchEvent(mouseOutEvent)
            })
        }, 30)

        // 获取img标签，测试相关的事件
        const aTags = document.querySelectorAll('a')

        aTags.forEach((a) => {
            a.dispatchEvent(mouseOverEvent)
            a.dispatchEvent(mouseOutEvent)
        })
    })

    /**
     * 测试非法的HTML结构
     */
    it('test illegal constructor of html', function (done) {
        const canvas = document.querySelector('div')
        const banner = Animate.bannerFader(canvas, {speed: 12, interval: 20})
        assert.equal(banner.timer, undefined)
        done()
    })
})