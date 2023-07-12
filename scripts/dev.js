
const execa = require('execa')

const target = 'reactivity'

async function build(target) {
  execa('rollup',['-c', '--environment', `TARGET:${target}`], {
    stdio: 'inherit'
  })
}

build(target)