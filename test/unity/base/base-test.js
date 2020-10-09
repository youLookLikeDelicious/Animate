describe('Test Animate Style', function () {
    it('test width and height and marginTop and opacity', (done) => {
        Animate(document.querySelector('div'), {
            width: '120px',
            height: '120px',
            marginTop: '120px',
            opacity: 0,
            duration: 520
        }, (el) => {
            assert.equal(global.window.getComputedStyle(el)['width'], '120px')
            assert.equal(global.window.getComputedStyle(el)['height'], '120px')
            assert.equal(global.window.getComputedStyle(el)['marginTop'], '120px')
            assert.equal(global.window.getComputedStyle(el)['opacity'], 0)
            done()
        })
    })

    /**
     * 测试rem作为单位使用
     */
    it('test rem', (done) => {
        Animate(document.querySelector('div'), {
            width: '13rem',
            height: '17rem'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, (13 * Animate.REM) + 'px')
            done()
        })
    })

    /**
     * 测试延迟动画
     */
    it('test delay', function (done) {
        Animate(document.querySelector('div'), {
            width: '13rem',
            delay: 120
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, (13 * Animate.REM) + 'px')
            done()
        })
    })

    /**
     * 测试动画队列
     */
    it('test animate queue', function (done) {
        Animate(document.querySelector('div'), {
            width: '13rem',
            duration: 120
        })

        Animate(div, {
            width: '150px',
            duration: 120,
            delay: 120
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '150px')
            done()
        })
    })

    /**
     * 测试非法的参数
     */
    it('test illegal param', function (done) {
        Animate(document.querySelector('div'), 'ani: slideDown')
        assert.ok(true)
        done()
    })

    /**
     * 测试动画执行的次数
     */
    it('test animate times', function (done) {
        Animate(document.querySelector('div'), {
            width: '10px',
            times: 2
        }, (el) => {
            assert.equal(el.style.width, '10px')
            done()
        })
    })

    /**
     * 强制结束之前的动画
     */
    it('test force finish the animation in process', function (done) {
        Animate(document.querySelector('div'), {
            width: '10px',
            times: 2,
        })
        Animate(document.querySelector('div'), {
            width: '70px',
            times: 2,
            finish: true
        }, (el) => {
            assert.equal(el.style.width, '70px')
            done()
        })
    })

    /**
     * test predefined duration
     */
    it('test predefined duration', function (done) {
        Animate(document.querySelector('div'), {
            width: '70px',
            duration: 'fast'
        }, (el) => {
            assert.equal(el.style.width, '70px')
            done()
        })
    })

    /**
     * test 无限执行的动画
     */
    it('test infinite attribute', function (done) {
        Animate(document.querySelector('div'), {
            width: '70px',
            duration: 'fast',
            times: 'infinite'
        })

        assert.equal(Animate.timers.length, 1)

        Animate(document.querySelector('div'), {
            finish: true
        }, () => {
            assert.equal(Animate.timers.length, 0)
            done()
        })
    })

    /**
     * 测试非法的元素
     */
    it('test illegal element', function (done) {
        Animate('sdf', {
            width: '70px',
            duration: 'fast',
            times: 'infinite'
        })

        assert.equal(Animate.timers.length, 0)

        const HTMLElement = window.HTMLElement
        window.HTMLElement = ''

        Animate({}, {
            width: '70px',
            duration: 'fast',
            times: 'infinite'
        })

        window.HTMLElement = HTMLElement

        assert.equal(Animate.timers.length, 0)
        done()
    })

    /**
     * 测试获取display = none元素的高度
     */
    it('test none displayed element', function (done) {
        div.style.display = 'none'
        div.style.height = ''
        Animate(div, {
            height: '120px'
        }, () => {
            if (div.style.height) {
                assert.ok(true)
            }
            done()
        })
    })
})