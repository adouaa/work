
// gRPC Services API
//---
const _SysService = typeof window !== 'undefined' && typeof window['API'] !== 'undefined' ? window['API']['SysService'] : {};
const SysService = _SysService.SysService;
if (typeof SysService !== 'undefined') SysService.cancel = () => _SysService.cancel();


const _OrgService = typeof window !== 'undefined' && typeof window['API'] !== 'undefined' ? window['API']['OrgService'] : {};
const OrgService = _OrgService.OrgService;
if (typeof OrgService !== 'undefined') OrgService.cancel = () => _OrgService.cancel();




//++++++++++++++++++++++++++++++++++++++++++++++++
// Branch API
//++++++++++++++++++++++++++++++++++++++++++++++++
const _FormService = typeof window !== 'undefined' && typeof window['API_BRANCH_FORM'] !== 'undefined' ? window['API_BRANCH_FORM']['FormService'] : {};
const FormService = _FormService.FormService;
if (typeof FormService !== 'undefined') FormService.cancel = () => _FormService.cancel();
//---


const _ElemService = typeof window !== 'undefined' && typeof window['API_BRANCH_ELEM'] !== 'undefined' ? window['API_BRANCH_ELEM']['ElemService'] : {};
const ElemService = _ElemService.ElemService;
if (typeof ElemService !== 'undefined') ElemService.cancel = () => _ElemService.cancel();
//---

const _DocService = typeof window !== 'undefined' && typeof window['API_BRANCH_DOC'] !== 'undefined' ? window['API_BRANCH_DOC']['DocService'] : {};
const DocService = _DocService.DocService;
if (typeof DocService !== 'undefined') DocService.cancel = () => _DocService.cancel();
//---

// node & browser
module.exports = {
    SysService,
    OrgService,

    // Branch API
    FormService,
    ElemService,
    DocService,

};



