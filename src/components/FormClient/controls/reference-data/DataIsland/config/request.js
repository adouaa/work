import axios from "axios";

import io from '../utils/custom/io';


/**
 * Local session utilities of child program
 * @version 0.1.0
 */

class SessionUtilLocalChildProg {
    
    constructor() {
        this.SESSION_VALID = 'SESSION_VALID';
        this.SESSION_DURATION = 'SESSION_DURATION';
        
    }

    getPivot() {
        return localStorage.getItem(this.SESSION_DURATION);
    }

    delete() {
        localStorage.removeItem(this.SESSION_DURATION);
        localStorage.removeItem(this.SESSION_VALID);
    }
   

    isExpired() {

        // check cache duration
        const sessionValid = localStorage.getItem(this.SESSION_VALID);
        const sessionStartTime = localStorage.getItem(this.SESSION_DURATION);
        if (sessionStartTime === null) {
            return true;
        } else {
            const cacheDuration = Date.now() - parseFloat(sessionStartTime);
            const cacheDurationDate = new Date(cacheDuration - 8*60*60*1000);
            const hours = cacheDurationDate.getHours();
            const minutes = cacheDurationDate.getMinutes();
            const seconds = cacheDurationDate.getSeconds();

            // time pivot (minutes)
            const m = sessionValid !== null ? Number(sessionValid) : 479;  // 8 hours
            if (minutes > m) {
                localStorage.setItem(this.SESSION_DURATION, -1);
                return true;
            }

            return false;
        }

    }

}
const SessionUtil = new SessionUtilLocalChildProg();



const localSessionExpiresAction = () => {


    if (SessionUtil.isExpired()) {

        if (SessionUtil.getPivot() == -1) {

            if (window.confirm('登录状态已过期，请重新登录')) {
                window.location.href = "/login?error=503";
            }

            // only display alert once
            SessionUtil.delete();
            document.cookie = `SITE_DATA_LOGIN_COOKIE=null;expires=${new Date(0).toUTCString()};path=/`;


            return true;
        }
        
    }

    return false;

};


const sessionExpiresAction = (data) => {
    if ( typeof data === 'undefined' ) return;

    // If the session expires, the backend will return a grpc error
    // User needs to log in again
    if ( data === null ) {
        
        // Core Communication
        io('BRIDGE_ALERT', {process: 1, modal: 1, info: '登录状态已过期，或服务出现错误无法执行数据库方法，请重新登录或联系管理员。 <br /><a href="#" id="app-err-server-back" class="btn btn-primary btn-sm mt-2">重新登录</a>'});
    }
}

const prodUrl = (myProtocol, myHostname, myPort, specifiedPort = '') => {
    if (typeof window !== 'undefined') {
        return window.location.hostname === 'localhost' ? (typeof myPort !== 'undefined' ? `${myProtocol}://${myHostname}:${myPort}` : `${myProtocol}://${myHostname}`) : typeof myPort !== 'undefined' ? (`${window.location.protocol}//${window.location.hostname}:${specifiedPort === '' ? window.location.port : specifiedPort}`) : (`${window.location.protocol}//${window.location.hostname}`);
    } else {
        return typeof myPort !== 'undefined' ? (specifiedPort === '' ? '{reqUrl}' : `{reqUrl}:${specifiedPort}`) : (specifiedPort === '' ? '{reqUrl}' : `{reqUrl}`);
    }
}


const api = window.location.hostname === 'localhost' ? prodUrl('http', 'xmhis.top', '30101', '30101') : prodUrl('', '', '30101', '30101');   // #### server (local test & domain) ####
const testApi = 'http://localhost:4005';   // #### fake data ####


// Fake API
const SITE_URL = typeof process.env.REACT_APP_FAKE_API !== 'undefined' && process.env.REACT_APP_FAKE_API.toString() === 'true' 
? testApi
: api;



function siteUrl() {
    // for CORE PROGRAM
    if (typeof window !== 'undefined' && typeof window['TEST_API'] !== 'undefined' && window['TEST_API'] != 'null') {
        return window['TEST_API'];
    } else {
        return SITE_URL;
    }
}
    

function authHeader() {
    // return authorization header with JWT(JSON Web Token) token
    let user = JSON.parse(localStorage.getItem('SITE_DATA_AUTH'));

    if (user && user.token) {
        return { 'xmhis-session-id': user.token };
    } else {
        return {};
    }
}

async function fetchLogin(url, data = {}) {
    let _data = null;
    const res = await axios.post(`${siteUrl()}/api/${url}`, data, {
        headers: {
            'xmhis-session-id': 'xmhis.session.default',
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    if (res && res.status == 200) _data = res.data;
    return _data;
}


async function fetchPost(url, data = {}) {
    let _data = null;
    const res = await axios.post(`${siteUrl()}/api/${url}`, data, {
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    // local session check
    const localSessionExpires = localSessionExpiresAction();
    

    if (!localSessionExpires && res && res.status == 200 && (res.data.message === '获取会话信息失败' || res.data.message === '没有该sessionId的信息') ) {
        // If the session expires
        sessionExpiresAction(_data);
    }

    if (res && res.status == 200) _data = res.data;
    return _data;
}

async function fetchGet(url, data = {}) {
    let _data = null;
    const res = await axios.get(`${siteUrl()}/api/${url}`, {
        params: data,
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    // local session check
    const localSessionExpires = localSessionExpiresAction();
    

    if (!localSessionExpires && res && res.status == 200 && (res.data.message === '获取会话信息失败' || res.data.message === '没有该sessionId的信息') ) {
        // If the session expires
        sessionExpiresAction(_data);
    }

    if (res && res.status == 200) _data = res.data;
    return _data;
}

export {
    siteUrl,
    authHeader,
    fetchLogin,
    fetchPost,
    fetchGet
};

