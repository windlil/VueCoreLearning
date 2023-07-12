const fs = require('fs')
const execa = require('execa')


// const stayFile = ['package.josn', 'README.md']

const targets = fs.readdirSync('packages')
.filter((file:string) => {
  if (fs.statSync(`packages/${file}`).isDirectory()) {
    return true
  }
  return false
})


type fn = (target:string) => Promise<any>

async function build(target:string) {
  execa('rollup', ['-c', '--environment', `TARGET:${target}`],{
    stdio: 'inherit'
  })
}

function runParallel(targets:string[], iteratorFn:fn) {
  const p = []
  for (let i = 0; i < targets.length; i++) {
    p.push(iteratorFn(targets[i]))
  }
  return Promise.all(p)
}

runParallel(targets, build)