/**
 * Match all image URLs from string
 *
 * @param {string} str Input text
 * @return {array} All matching images
 */
function matchAllImageUrls(str) {

    if (typeof str !== 'string') return [];

    let strGetAllUrls = str.match(/http[s]?:\/\/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig);
    // delete a query string parameter
    strGetAllUrls = strGetAllUrls.map(item => item.split('?')[0]);
    const strImagsAll = strGetAllUrls.filter(item => /\.(jpg|jpeg|png|svg|gif|webp)$/i.test(item));
    return strImagsAll;
}



function matchAllImgTagUrls(str) {

    if (typeof str !== 'string') return [];

    const allImgTags = str.match(/<img [^>]*src="[^"]*"[^>]*>/gm);
    return Array.isArray(allImgTags) ? allImgTags.map(x => x.replace(/.*src="([^"]*)".*/, '$1')) : [];

}


// node & browser
module.exports = {
    matchAllImageUrls,
    matchAllImgTagUrls
}

