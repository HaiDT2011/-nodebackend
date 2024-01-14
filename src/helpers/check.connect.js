'use strict'

const { default: mongoose } = require("mongoose")
const os =  require('os')
const process = require('process')
const _SECONDS = 5000


const countConnect = () => {
    const numConnecttion = mongoose.connections.length
    console.log('Number of connection  ', numConnecttion)
}

const checkOverload = () =>{
    setInterval(() => {
        const numConnecttion = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        const maxConnects = numCores * 5

        if(numConnecttion > maxConnects){
            console.log('=======>')
        }
    }, _SECONDS);
}

module.exports = {
    countConnect,
    checkOverload
}