const userData = () => {

    const userDataCache = localStorage.getItem('SITE_AUTH_USER_DATA');
    if ( userDataCache !== null ) {
        return JSON.parse(userDataCache);
    } else {
        return null;
    }
}

export default userData;

