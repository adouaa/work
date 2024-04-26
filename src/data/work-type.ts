import i18next from '../lang/i18n';
const data = `[
    {
        "label": "${i18next.t('医疗')}",
        "value": "DOCTOR",
        "queryString": "yl"
    },
    {
        "label": "${i18next.t('护理')}",
        "value": "NURSE",
        "queryString": "hl"
    },
    {
        "label": "${i18next.t('其他')}",
        "value": "OTHER",
        "queryString": "qt"
    }

]
`;



export default JSON.parse(data);








