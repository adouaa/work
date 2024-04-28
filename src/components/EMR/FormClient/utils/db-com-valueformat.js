/**
 * Convert database string to component format
 * @param {String} str 
 * @returns {String} such as: 1,SYS TEM,2,POIW
 */
function databaseToComponentValue(str) {
    if (typeof str === 'undefined') return '';

    const res = str.match(/[^\[]+(?=(\[ \])|\])/g);
    return res === null ? '' : res.join(',').replace(/\,+$/, '');
}

/**
 * Convert component value to database string
 * @param {String} str 
 * @returns {String} such as: [1][SYS TEM][2][POIW]
 */
function componentValueToDatabase(str) {
    if (typeof str === 'undefined') return '';
    if ( str.length === 0 ) return '';
    return str.split(',').map((v) => v.includes('[') && v.includes(']') ? `${v}` : `[${v}]`).join('');
}

// node & browser
export {
    databaseToComponentValue,
    componentValueToDatabase
};

