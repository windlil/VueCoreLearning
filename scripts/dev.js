
const execa = require('execa')

const target = 'reactivity'

async function build(target) {
  execa('rollup',['-c','-w','--environment', `TARGET:${target}`], {
    stdio: 'inherit'
  })
}

build(target)

