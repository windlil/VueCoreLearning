const fs = require('fs')
const execa = require('execa')


// const stayFile = ['package.josn', 'README.md']

const targets = fs.readdirSync('packages')
.filter((file) => {
  if (fs.statSync(`packages/${file}`).isDirectory()) {
    return true
  }
  return false
})


async function build(target) {
  execa('rollup', ['-c', '--environment', `TARGET:${target}`],{
    stdio: 'inherit'
  })
}

function runParallel(targets, iteratorFn) {
  const p = []
  for (let i = 0; i < targets.length; i++) {
    p.push(iteratorFn(targets[i]))
  }
  return Promise.all(p)
}

runParallel(targets, build)