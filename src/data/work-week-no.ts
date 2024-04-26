import i18next from '../lang/i18n';
const data = `[
    {
        "label": "${i18next.t('周一')}",
        "value": "1",
        "queryString": ""
    },   
    {
        "label": "${i18next.t('周二')}",
        "value": "2",
        "queryString": ""
    },
    {
        "label": "${i18next.t('周三')}",
        "value": "3",
        "queryString": ""
    },
    {
        "label": "${i18next.t('周四')}",
        "value": "4",
        "queryString": ""
    },
    {
        "label": "${i18next.t('周五')}",
        "value": "5",
        "queryString": ""
    },
    {
        "label": "${i18next.t('周六')}",
        "value": "6",
        "queryString": ""
    },
    {
        "label": "${i18next.t('周日')}",
        "value": "7",
        "queryString": ""
    }
]
`;
export default JSON.parse(data);
