import i18next from '../lang/i18n';
const data = `[
    {
        "label": "${i18next.t('USER')}",
        "value": "USER",
        "queryString": ""
    },
    {
        "label": "${i18next.t('DEPT')}",
        "value": "DEPT",
        "queryString": ""
    },   
    {
        "label": "${i18next.t('MDT')}",
        "value": "MDT",
        "queryString": ""
    }

]
`;
export default JSON.parse(data);
