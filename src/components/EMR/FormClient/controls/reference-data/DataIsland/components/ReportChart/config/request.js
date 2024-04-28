import axios from "axios";
import io from "../utils/custom/io";

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

const SITE_URL = window.location.hostname === 'localhost' ? prodUrl('http', 'xmhis.top', '30101', '30101') : prodUrl('', '', '30101', '30101');   // #### server (local test & domain) ####

function siteUrl() {
    return SITE_URL;
}

function authHeader() {
    // return authorization header with JWT(JSON Web Token) token
    let user = JSON.parse(localStorage.getItem('SITE_DATA_AUTH'));

    if (user && user.token) {
        return {
            'xmhis-session-id': user.token
        };
    } else {
        return {};
    }
}

async function fetchLogin(url, data = {}) {
    let _data = null;
    const res = await axios.post(`${SITE_URL}/api/${url}`, data, {
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
    const res = await axios.post(`${SITE_URL}/api/${url}`, data, {
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    if (res && res.status == 200 && (res.data.message === '获取会话信息失败' || res.data.message === '没有该sessionId的信息') ) {
        // If the session expires
        sessionExpiresAction(_data);
    }

    if (res && res.status == 200) _data = res.data;
    return _data;
}

async function fetchGet(url, data = {}) {
    let _data = null;
    const res = await axios.get(`${SITE_URL}/api/${url}`, {
        params: data,
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    if (res && res.status == 200 && (res.data.message === '获取会话信息失败' || res.data.message === '没有该sessionId的信息') ) {
        // If the session expires
        sessionExpiresAction(_data);
    }

    if (res && res.status == 200) _data = res.data;
    return _data;
}

async function getList(url, data = {}) {
    let _data = null;
    const res = await axios.post(`${SITE_URL}/api/${url}`, data, {
        headers: {
            ...authHeader(),
            'Content-Type': 'application/json'
        }
    }).catch(function (error) {
        console.log(error);
    });

    if (res && res.status == 200) _data = res.data;
    return _data;
}

export {
    siteUrl,
    authHeader,
    fetchPost,
    fetchGet
};