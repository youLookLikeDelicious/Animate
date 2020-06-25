describe('test predefined animation', function () {
    /**
     * 测试渐显
     */
    it('test fade in', function (done) {
        const div = document.querySelector('div')
        div.style.opacity = 0

        Animate(div, {
            ani: 'fadeIn'
        }, () => {
            assert.equal(div.style.opacity, '1')
            done()
        })
    })

    /**
     * 测试渐隐
     */
    it('test fade out', function (done) {
        const div = document.querySelector('div')
        div.style.opacity = 1

        Animate(div, {
            ani: 'fadeOut'
        }, () => {
            assert.equal(div.style.opacity, '0')
            done()
        })
    })

    /**
     * 测试display 为none的向下滑动
     */
    it('test slide down animation of element that has style of none display', function (done) {
        div.style.display = 'none'
        Animate(div, {
            ani: 'slideDown'
        }, (el) => {
            assert.equal(div.style.height, '12px')
            // 清除 el的slideTo自定义属性
            div.removeAttribute('slideTo')
            done()
        })
    })

    /**
     * 测试自动渐隐渐显
     */
    it('test toggle fade', function (done) {
        Animate(div, {
            ani: 'fadeToggle'
        }, () => {
            assert.equal(div.style.opacity, '0')
            Animate(div, {
                ani: 'fadeToggle'
            }, () => {
                assert.equal(div.style.opacity, '1')
                done()
            })
        })        
    })

    /**
     * 测试自动上下滑动
     */
    it ('test slide toggle', function (done) {
        Animate(div, {
            ani: 'slideToggle'
        }, () => {
            assert.equal(div.style.height, '0px')
            Animate(div, {
                ani: 'slideToggle'
            }, () => {
                assert.equal(div.style.height, '12px')
                done()
            })
        })   
    }, 'slide toggle--')

    /**
     * 测试输入非法的自定义动画
     */
    it('test illegal ani property', function (done) {
        Animate(div, {
            ani: ''
        }, () => {
            assert.ok(true)
            done()
        })
    })

})