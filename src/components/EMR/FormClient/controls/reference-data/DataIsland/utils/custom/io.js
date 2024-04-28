import getSessionId from './get-session-id';

/**
 * Core Communication with socket.io
 * 
 * @param {String} event 
 * @param {*} data 
 * @param {Function} callback 
 */

let ioQueueTimer = null;
const io = (event, data, callback = (param1, param2 = undefined) => { }) => {
    clearTimeout(ioQueueTimer);

    //
    const appId = window.location.href.split('//')[1].split('/')[1];
    const sendData = {
        appId: appId,
        sid: getSessionId(),
        data: data
    };

    if (!window['CORE_PROGRAM']) {
        console.warn('You are currently in the "independent debugging" state and have not been mounted under the CORE PROGRAM. The io interface cannot be triggered, and the information will be output using the "console" panel.');

        console.log('\x1b[36m%s\x1b[0m', `${JSON.stringify(sendData)}`);
    } else {
        if (typeof window.io !== 'undefined') {


            if (event === 'BRIDGE_ALERT') {

                // notifications
                //=====================
                const msgCache = sessionStorage.getItem('IO_MESSAGE_LIST_BRIDGE_ALERT');
                if (msgCache !== null) {
                    const _data = JSON.parse(msgCache);
                    _data.push(sendData);
                    sessionStorage.setItem('IO_MESSAGE_LIST_BRIDGE_ALERT', JSON.stringify(_data));
                } else {
                    sessionStorage.setItem('IO_MESSAGE_LIST_BRIDGE_ALERT', JSON.stringify([sendData]));
                }

                // if message exists in sessionStorage in 5 seconds
                ioQueueTimer = setTimeout(() => {

                    if (msgCache !== null) {
                        const latestMsgCache = sessionStorage.getItem('IO_MESSAGE_LIST_BRIDGE_ALERT');
                        const latestData = JSON.parse(latestMsgCache);
                        const msgExist = latestData.every((item, index) => {
                            if (item.appId == sendData.appId && item.sid == sendData.sid && JSON.stringify(item.data) == JSON.stringify(sendData.data)) {
                                console.log('io message is already exists');
                                return false;
                            }
                            return true;
                        });

                        if (!msgExist) {
                            alert(sendData.data.info);
                        }
                    }
                }, 5000);

                
                if (typeof window['IO_WITHOUT_SOCKET_BRIDGE_ALERT'] !== 'undefined') {
                    window['IO_WITHOUT_SOCKET_BRIDGE_ALERT'](sendData);
                }  else {
                    const serverPort = window['WEBSOCKET_SERVER_PORT'];
                    const socket = window.io(typeof serverPort !== 'undefined' ? `${window.location.hostname}:${serverPort}` : window.location.host);
                    socket.emit(event, sendData, callback);
                }
   

            } else {
                
                // others
                //=====================     
                const serverPort = window['WEBSOCKET_SERVER_PORT'];
                const socket = window.io(typeof serverPort !== 'undefined' ? `${window.location.hostname}:${serverPort}` : window.location.host);
                socket.emit(event, sendData, callback);

            }


        } else {
            console.warn('The io interface does not exist, please make sure "socket.io.min.js" has been loaded in CORE PROGRAM.');

        }
    }

}

export default io;
