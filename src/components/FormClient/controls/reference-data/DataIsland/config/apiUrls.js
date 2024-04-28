const prodUrl = (myProtocol, myHostname, myPort, specifiedPort = '') => {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' ? (typeof myPort !== 'undefined' ? `${myProtocol}://${myHostname}:${myPort}` : `${myProtocol}://${myHostname}`) : typeof myPort !== 'undefined' ? (`${window.location.protocol}//${window.location.hostname}:${specifiedPort === '' ? window.location.port : specifiedPort}`) : (`${window.location.protocol}//${window.location.hostname}`);
    } else {
        return typeof myPort !== 'undefined' ? (specifiedPort === '' ? '{reqUrl}' : `{reqUrl}:${specifiedPort}`) : (specifiedPort === '' ? '{reqUrl}' : `{reqUrl}`);
    }
};



const taskConfig = {
    /*
     TYPE: Nodejs Services (fixed port:30076)
     ------------------------------------------
    */
    "REPORT_SYNC_LAB": `${prodUrl('http','192.168.1.170','30076','30076')}/taskservice/zhiy/SyncReportLab`,

    // image folder
    "REPORT_SYNC_EXAM": `${prodUrl('http','192.168.1.170','30076','30076')}/taskservice/zhiy/SyncReportPacs`


};

// node & browser
module.exports = taskConfig;

