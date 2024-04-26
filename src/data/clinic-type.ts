import i18next from '../lang/i18n';
const data = `[
    {
        "label": "${i18next.t('个人出诊')}",
        "value": "DOCTOR",
        "queryString": ""
    },
    {
        "label": "${i18next.t('科室出诊')}",
        "value": "DEPT",
        "queryString": ""
    }

]
`;
export default JSON.parse(data);
