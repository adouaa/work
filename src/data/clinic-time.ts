import i18next from '../lang/i18n';
const data = `[
    {
        "label": "${i18next.t('上午')}",
        "value": "AM",
        "queryString": ""
    },
    {
        "label": "${i18next.t('中午')}",
        "value": "MM",
        "queryString": ""
    },
    {
        "label": "${i18next.t('下午')}",
        "value": "PM",
        "queryString": ""
    },
    {
        "label": "${i18next.t('晚上')}",
        "value": "NT",
        "queryString": ""
    }

]
`;
export default JSON.parse(data);
