const cluster = require('cluster');
const os = require('os');

if(cluster.isMaster){
    const cpus = os.cpus().length;

    for(let i=0;i<cpus-1;i++){
        cluster.fork();
    }
    cluster.on('exit',()=>{
        console.log('process is droped');
        cluster.fork();
    })
}else{
    require('./app')();
    console.log('forking');
}