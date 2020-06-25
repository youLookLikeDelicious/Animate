describe('easing test', function () {
    it('test swing', function (done) {
        Animate(document.querySelector('div'), {
            width: '126px',
            easing: 'swing'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '126px')
            done()
        })
    })

    it('test liner', function (done) {
        Animate(document.querySelector('div'), {
            width: '120px',
            easing: 'liner'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '120px')
            done()
        })
    })

    it('test easeIn', function (done) {
        Animate(document.querySelector('div'), {
            width: '123px',
            easing: 'easeIn'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '123px')
            done()
        })
    })

    it('test bezier2', function (done) {
        Animate(document.querySelector('div'), {
            width: '124px',
            easing: 'bezier(0.7)'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '124px')
            done()
        })
    })

    it('test bezier3', function (done) {
        Animate(document.querySelector('div'), {
            width: '125px',
            easing: 'bezier(0.4, 0.8)'
        }, (el) => {
            assert.equal(window.getComputedStyle(el).width, '125px')
            done()
        })
    })
})