const requireContext = require('require-context')

const assert = require('assert')

global.assert = assert

const hooks = requireContext('../../test/hooks', true)
hooks.keys().forEach(hooks)

import('../src/index').then((func) => {
    global.Animate = func.default
})

// import Animate from '../src/index'
// global.Animate = Animate
const testContext = requireContext('../../test/unity', true)
testContext.keys().forEach(testContext)
