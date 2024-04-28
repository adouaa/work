

function autopCustom(str) {

    str = str.replace(/<p>/gmi, '');
    str = str.replace(/<\/p>/gmi, '');
    str = str.replace(/[<]br[^>]*[>]/gi, "");
    return str;
}


export {
    autopCustom
}