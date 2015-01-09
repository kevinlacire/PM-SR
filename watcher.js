var exec        = require('child_process').exec;
var portscanner = require('portscanner');
console.log('SARTING ETERNAL SERVER');

setInterval(function(){
    portscanner.checkPortStatus(8080, '127.0.0.1', function(error, status) {
        // Status is 'open' if currently in use or 'closed' if available
        //console.log(status);
        if(status == 'closed'){
            exec('npm start', function (error, stdout, stderr) {
                console.info("SERVER RESTARTED");
                //clearInterval(loop);
            });
        }
    })
}, 1000);
