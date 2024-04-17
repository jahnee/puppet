
//'use strict'

const that = { hello: 'world' }
const queue = require('fastq')(that, worker, 1)

queue.push(42, function (err, result) {
  if (err) { throw err }
 // console.log(this)
  console.log('the result is', result)
})
queue.push(15, function (err, result) {
  if (err) { throw err } 
  //console.log(this)
  console.log('the result is', result)
})

queue.unshift(52, function (err, result) {
  if (err) { throw err }
  //console.log(this)
  console.log('the result is', result)
})

function worker(arg, cb) {
  console.log(this)
  setTimeout(() => {
    cb(null, arg * 2)
  }, 2000)
}