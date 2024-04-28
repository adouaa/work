import { withTranslation } from "react-i18next"
import FormClient from "./FormClient";
import { useEffect, useRef, useState } from "react";
import { getSessionInfoAPI } from "../../api/emr";
import getHashSearchParam from "../../utils/getHashParams";
import getUrlProperty from "../../utils/get-property";
import { fetchPost } from "../../config/request";
import { useParams } from "react-router-dom";
import io from "../../utils/custom/io";
import InputDate from 'funda-ui/Date'
import Button from "adou-ui/Button";
import "./index.scss";


const EMR = () => {

    const { rescue_id } = useParams();

    const { visit_id, link_value, link_name, link_data, doc_tag } = getUrlProperty();

    const doc_type = "抢救病历";
    const doc_name = "抢救记录";

    // console.log(visit_id, link_value, link_name, link_data, doc_type, doc_name, doc_tag )
    const [token, setToken] = useState<string>(''); //session_id
    const [visitId, setVisitId] = useState<number>(0); //就诊号
    const [userId, setUserId] = useState<number>(0); //登录人ID
    const [userName, setUserName] = useState<string>('')//登录人姓名

    const [isHashChange, setIsHashChange] = useState<boolean>(false);
    const [docNameList, setDocNameList] = useState<any[]>([]);

    const [emrId, setEmrId] = useState<number>(0);
    const [emrList, setEmrList] = useState<any[]>([]);
    const [emrTitle, setEmrTitle] = useState<string>('');

    const [formData, setFormData] = useState<any[]>([]);
    const [initFormData, setInitFormData] = useState<any[]>([]);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [defaultCurrentTime, setDefaultCurrentTime] = useState<string>('');

    const [docId, setDocId] = useState<number | string>('');
    const [docList, setDocList] = useState<any[]>([]);
    const [formList, setFormList] = useState<any[]>([]);
    const [recList, setRecList] = useState<any[]>([]);

    const [formId, setFormId] = useState<number>(0);
    const [formVersion, setFormVersion] = useState<string>('');


    const [docInfo, setDocInfo] = useState<{  //文档类型
        doc_type: string,
        doc_name: string,
        doc_tag: string
    }>({
        doc_type: '',
        doc_name: '',
        doc_tag: ''
    });

    const [linkInfo, setLinkInfo] = useState<{  //Link关联信息
        link_name: string,
        link_value: string
        link_data: string
    }>({
        link_name: '',
        link_value: '',
        link_data: ''
    })

    const [relevantDoctorList, setRelevantDoctorList] = useState<{ //保存相关主刀医生信息
        user_id: number,
        user_name: string
    }[]>([]);

    const [relevantNurseList, setRelevantNurseList] = useState<{ //保存相关护士信息
        user_id: number,
        user_name: string
    }[]>([]);

    const [relevantAnesList, setRelevantAnesList] = useState<{ //保存相关麻醉医生信息
        user_id: number,
        user_name: string
    }[]>([]);


    //获取初始url相关参数
    const initUrlGetData = async () => {
        //console.log('获取参数----------------');

        const currentToken = JSON.parse(localStorage.getItem('SITE_DATA_AUTH') as string).token;
        /* fetchPost('auth/GetSessionInfo', {
            session_id: Number(currentToken),
        }).then((res: any) => {
            //console.log('登录科室信息', res);
            setUserId(Number(res.session_info.user_id));
            setUserName(res.session_info.user_name);
        }) */
        const res: any = await getSessionInfoAPI(Number(currentToken));
        setUserId(Number(res.session_info.user_id));
        setUserName(res.session_info.user_name);

        //通过url获取相应参数并赋值
        const url_visit_id = getHashSearchParam('visit_id') ? getHashSearchParam('visit_id') : visit_id;
        const url_link_name = getHashSearchParam('link_name') ? getHashSearchParam('link_name') : link_name;
        const url_link_value = getHashSearchParam('link_value') ? getHashSearchParam('link_value') : link_value;
        const url_link_data = getHashSearchParam('link_data') ? getHashSearchParam('link_data') : link_data;
        const url_doc_type = getHashSearchParam('doc_type') ? getHashSearchParam('doc_type') : doc_type;
        const url_doc_name = getHashSearchParam('doc_name') ? getHashSearchParam('doc_name') : doc_name;
        const url_doc_tag = getHashSearchParam('doc_tag') ? getHashSearchParam('doc_tag') : doc_tag;

        //console.log(link_data)
        setToken(currentToken);

        setVisitId(Number(url_visit_id));

        //console.log(doc_type, doc_name, doc_tag);

        setDocInfo({
            doc_type: url_doc_type as string,
            doc_name: url_doc_name == '无' ? '' : url_doc_name as string,
            doc_tag: url_doc_tag == '无' ? '' : url_doc_tag as string
        })

        setLinkInfo({
            link_name: url_link_name as string,
            link_value: url_link_value as string,
            link_data: url_link_data == 'null' || !link_data ? '' : link_data as string
        })

        //判断手术还是麻醉界面
        if (link_name == '手术') {
            const ops_id = Number(url_link_value);
            fetchPost('anes/GetLinkAnesList', {
                link_name: '手术',
                link_value: [ops_id]
            }).then((res: any) => {
                const anes_id = Number(res.row_list[0]?.anes_id);
                //getRelevantUsersList(ops_id, anes_id);
            })
        } else if (link_name == '麻醉') {
            const anes_id = Number(url_link_value);
            fetchPost('anes/GetAnesProperty', {
                anes_id: anes_id
            }).then((res: any) => {
                const ops_id = Number(res.anes_property.link_value);
                //getRelevantUsersList(ops_id, anes_id);
            })
        }

        fetchPost('doc/GetDocNameList', {
            doc_type: url_doc_type
        }).then((res: any) => {
            // console.log('docName', res);
            setDocNameList(res.row_list);
        })
    }


    const actRef = useRef<any>(null);

    //修改字段下划线变成驼峰
    const hump = (obj: any) => {
        const tmp: { [key: string]: any } = {}
        Object.keys(obj).map((key: string) => {

            if (key.includes('_')) {
                if (key == 'value_text') {
                    tmp['value'] = obj[key];
                } else if (key == 'value_score') {
                    tmp['elemTotalScore'] = obj[key];
                } else {
                    const newKey = `${key.split('_')[0]}${key.split('_')[1][0].toUpperCase()}${key.split('_')[1].slice(1)}`;
                    tmp[newKey] = obj[key];
                }
            } else {
                tmp[key] = obj[key]
            }
        })
        return tmp;
    }

    //修改字段下划线变成驼峰
    const changeKeys = (data: any[]) => {
        //console.log('-------------------------', data)
        const tmp: any = [];

        data.forEach((item: any) => {
            delete item.value_code_system;
            const _tmp = hump(item);
            tmp.push(_tmp)
        })

        return tmp;
    }

    // const [isShowEmrListSidebar, setIsShowEmrListSidebar] = useState<boolean>(false);
    const [isInitLoading, setIsInitLoading] = useState<boolean>(true);
    const [isCommit, setIsCommit] = useState<boolean>(false);
    const [isShowPdf, setIsShowPdf] = useState<boolean>(false);
    const [isShowSignPad, setIsShowSignPad] = useState<boolean>(false);
    const [isDocLoading, setIsDocLoading] = useState<boolean>(false);
    const [changeToPdf, setChangeToPdf] = useState<boolean>(false);
    const [isNew, setIsNew] = useState<boolean>(false);
    const [isShowModal, setIsShowModal] = useState<boolean>(false);

    const [emrConsentList, setEmrConsentList] = useState<any[]>([]);
    const [emrConsentProperty, setEmrConsentProperty] = useState<any>({}); //同意书属性
    const [emrConsentSignList, setEmrConsentSignList] = useState<any[]>([]); //签名板列表

    const [isPc, setIsPc] = useState<boolean>(false); //判断平台

    const [writer, setWriter] = useState<{ //提交，保存人
        create_user_id: number,
        create_user_name: string,
        create_time: string,
        commit_user_id: number,
        commit_user_name: string,
        commit_time: string
    }>({
        create_user_id: 0,
        create_user_name: '',
        create_time: '',
        commit_user_id: 0,
        commit_user_name: '',
        commit_time: ''
    });

    const [totalScore, setTotalScore] = useState<number>(0); //总分
    const [assessResult, setAssessResult] = useState<string>(''); //评估结果
    const [scoreList, setScoreList] = useState<{  //分数
        entry_id: string | number,
        section_id: string | number,
        elem_id: string | number,
        row_no: string | number,
        value_score: string | number
    }[]>([]);

    const passwordRef = useRef<HTMLDivElement>(null);


    //表单组件
    const [entryFuncs, setEntryFuncs] = useState<any[]>([]);
    const itemExist = (arr: any[], entry_id: string | number, section_id: string | number, row_no: string | number, elem_id: string | number) => {
        return arr.some((o: any) => {
            return o.entry_id == entry_id && o.section_id == section_id && o.row_no == row_no && o.elem_id == elem_id
        });
    };

    const getRecList = (visit_id: number, doc_type: string) => {

        fetchPost('emr/GetRecList', {
            visit_id: visit_id,
            doc_type: doc_type,
            link_name: "rescue",
            link_value: Number(rescue_id)
        }).then((res: any) => {
            //console.log('getRecList', res);
            if (res.row_list.length > 0) {
                setRecList(res.row_list);
            } else {
                setRecList([]);
            }
        })
    }

    //获取初始表单数据
    const getInitFormData = (doc_type: string, doc_name: string, doc_tag: string) => {
        //重置状态-------------------
        setEmrId(0);
        setEmrList([]);
        setFormData([]);
        setInitFormData([]);
        setFormId(0);
        setFormVersion('');
        setIsCommit(false);
        setIsInitLoading(true);
        setAssessResult('');
        setScoreList([]);
        setChangeToPdf(false);
        setDocId('');
        setEmrTitle('');
        // setIsShowEmrListSidebar(false);

        localStorage.removeItem('FORM_CLIENT_TEMP_DATA'); // 删除临时默认值

        //获取已创建表单
        fetchPost('emr/GetEmrList', {
            visit_id: visitId,
            doc_type: doc_type,
            doc_name: doc_name,
            doc_tag: doc_tag,
            link_name: "rescue",
            link_value: Number(rescue_id),
            // link_data: linkData
        }).then((emrRes: any) => {
            //console.log('获取emr列表', emrRes);

            //判断是否已存在病历
            if (emrRes.row_list?.length > 0) {
                // if (emrRes.row_list?.length > 1) {
                //     setIsShowEmrListSidebar(true)
                // }
                setEmrList(emrRes.row_list);
                getEmrProperty(Number(emrRes.row_list[0].emr_id), visitId);
                if (docInfo.doc_type?.includes('评估')) getRecList(Number(visitId), doc_type);
            } else {
                const today = new Date();
                const yyyy = today.getFullYear();
                const MM = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
                const DD = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
                const hh = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
                const mm = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
                setCurrentTime(`${yyyy}-${MM}-${DD} ${hh}:${mm}:00`);
                setDefaultCurrentTime(`${yyyy}-${MM}-${DD} ${hh}:${mm}:00`);
                setIsShowPdf(false);
                if (doc_name == '' || doc_tag == '') { //如果没传doc_name和doc_tag，就是评估或同意书，去获取doc_name

                    fetchPost('doc/GetDocNameList', {
                        doc_type: docInfo.doc_type
                    }).then((nameRes: any) => {
                        //console.log('名称', nameRes)
                        if (nameRes.row_list.length === 1) { //如果只有一个doc_name，直接获取doc_tag
                            setTotalScore(nameRes.row_list[0].assess_score);
                            fetchPost('doc/GetDocTagList', {
                                name_id: Number(nameRes.row_list[0].name_id)
                            }).then((res: any) => {
                                //console.log('标签', res)
                                if (res.row_list) {
                                    if (res.row_list.length == 1) { //如果只有一个doc_tag，直接获取form_id和form_version
                                        setDocInfo({
                                            ...docInfo,
                                            doc_name: nameRes.row_list[0].doc_name,
                                            doc_tag: res.row_list[0].doc_tag
                                        })
                                        getFormList(docInfo.doc_type, nameRes.row_list[0].doc_name, res.row_list[0].doc_tag);
                                    }
                                }
                            })
                        } else { //存在多份就弹窗让用户选择
                            setIsNew(true);
                        }
                    })

                } else {
                    getFormList(docInfo.doc_type, docInfo.doc_name, docInfo.doc_tag);
                }
            }
        })
    }

    //刷新
    const refreshData = () => {

        console.log('refresh-----------------');
        //console.log(emrId);

        getEmrProperty(emrId, visitId);

        fetchPost('emr/GetEmrList', {
            visit_id: Number(visitId),
            doc_type: docInfo.doc_type,
            doc_name: docInfo.doc_type.includes('同意书') || docInfo.doc_type.includes('评估') ? '' : docInfo.doc_name,
            doc_tag: docInfo.doc_type.includes('同意书') || docInfo.doc_type.includes('评估') ? '' : docInfo.doc_tag,
            link_name: "rescue",
            link_value: Number(rescue_id),
            // link_data: linkData
        }).then((emrRes: any) => {
            // console.log('获取表单列表', emrRes);

            //判断是否已存在病历
            if (emrRes.row_list?.length > 0) {
                // if (emrRes.row_list?.length > 1) {
                //     setIsShowEmrListSidebar(true)
                // }
                setEmrList(emrRes.row_list);
            }

        })
    }

    //获取表单模板
    const getFormList = (docType: string, docName: string, docTag: string) => {

        //获取相关人

        fetchPost('form/GetFormList', {
            doc_type: docType,
            doc_name: docName,
            doc_tag: "#"
        }).then((res: any) => {
            //console.log('***表单列表', res);
            if (res.row_list && res.row_list.length > 1) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '存在多个表单',
                    theme: 'warning'
                });
            } else {

                // setFormName(res.row_list[0].form_name)
                setFormId(res.row_list[0]?.form_id);
                setFormVersion(res.row_list[0]?.form_version);

                //自动创建病历
                // fetchPost('emr/CreateEmr', {
                //     visit_id: Number(visitId),
                //     form_id: Number(res.row_list[0].form_id),
                //     form_version: Number(res.row_list[0].form_version),
                //     link_name: linkName,
                //     link_value: Number(linkValue),
                //     link_data: linkData,
                // }).then((res: any) => {
                //     if (res.code == 0) {
                //         if (docInfo.doc_type?.includes('同意书') || docInfo.doc_type?.includes('评估')) getEmrList(docInfo.doc_type, '', '')
                //         getEmrProperty(Number(res.emr_id), Number(visitId));
                //     }
                // })
                getEmrInit(Number(res.row_list[0]?.form_id), Number(res.row_list[0]?.form_version));
                setIsInitLoading(false);
            }
        })
    }

    //获取单份emr数据
    const getEmrProperty = (emr_id: number, visit_id: number) => {
        setEmrId(emr_id);
        setDocList([]);
        setIsInitLoading(true);
        setIsCommit(false);
        setIsShowPdf(false);
        setIsDocLoading(true);
        setDocId('');
        setChangeToPdf(false);
        setWriter({
            create_user_id: 0,
            create_time: '',
            create_user_name: '',
            commit_user_id: 0,
            commit_user_name: '',
            commit_time: '',
        })
        setFormData([]);
        setInitFormData([]);

        //获取病历相关人

        fetchPost('emr/GetEmrProperty', {
            emr_id: Number(emr_id),
            column_user: 'create_user_id,create_user_name,create_time,commit_user_id,commit_user_name,commit_time'
        }).then((emrProperty: any) => {
            //console.log('***emrproperty', emrProperty);
            setEmrTitle(emrProperty.emr_property.emr_title);
            getEmrInit(Number(emrProperty.emr_property.form_id), Number(emrProperty.emr_property.form_version))
            setDocInfo({
                doc_type: emrProperty.emr_property.doc_type,
                doc_name: emrProperty.emr_property.doc_name,
                doc_tag: emrProperty.emr_property.doc_tag
            })

            setTotalScore(emrProperty.emr_property.assess_total);

            //获取保存、提交人信息
            setWriter({
                create_user_id: emrProperty.user_property.create_user_id,
                create_user_name: emrProperty.user_property.create_user_name,
                create_time: emrProperty.user_property.create_time,
                commit_user_id: emrProperty.user_property.commit_user_id,
                commit_user_name: emrProperty.user_property.commit_user_name,
                commit_time: emrProperty.user_property.commit_time
            });

            setFormId(Number(emrProperty.emr_property.form_id));
            setFormVersion(emrProperty.emr_property.form_version);
            setCurrentTime(emrProperty.emr_property.emr_time);
            setDefaultCurrentTime(emrProperty.emr_property.emr_time);

            //如果已提交获取提交相关数据
            if (emrProperty.emr_property.emr_status == 'COMMIT') {
                setIsCommit(true);

                //获取表单数据元数据
                fetchPost('emr/GetEmrElemList', {
                    emr_id: Number(emr_id),
                }).then((emrElemList: any) => {
                    //console.log('emr数据元数据', JSON.stringify(emrElemList));
                    setFormData(emrElemList.value_list);
                    setInitFormData(emrElemList.value_list);

                    if (docInfo.doc_type.includes('同意书') || docInfo.doc_type.includes('评估')) {
                    }
                })


            } else {
                setIsShowPdf(false);
                setIsDocLoading(false);
                //获取表单数据元数据
                fetchPost('emr/GetEmrElemList', {
                    emr_id: Number(emr_id),
                }).then((emrElemList: any) => {
                    //console.log('emr数据元数据', JSON.stringify(emrElemList));
                    setFormData(emrElemList.value_list);
                    setInitFormData(emrElemList.value_list);
                    setIsInitLoading(false);
                })
            }
        })
    }

    //获取初始化病历时间
    const getEmrInit = (form_id: number, form_version: number) => {

        fetchPost('emr/GetEmrInit', {
            visit_id: Number(visitId),
            form_id: form_id,
            form_version: form_version,
            link_name: "rescue",
            link_value: Number(rescue_id),
            // link_data: linkData
        }).then((res: any) => {
            //console.log('初始化病历时间', res);
            if (res.emr_time) {
                setCurrentTime(res.emr_time);
                setDefaultCurrentTime(res.emr_time);
                setEmrTitle(res.emr_title);
            }
        })
    }


    const { name } = require('../../../package.json');

    const saveBtnClick = () => {
        if (emrList.length) {
            console.log("准备保存");
            console.log(formData);
            handleSaveEMR();


        } else {
            console.log("准备新创建");
            console.log(formData);
            handleCreateEMR();
        }
    }

    const handleCreateEMR = async () => {
        const tmp: any[] = [];

        fetchPost('emr/CreateEmr', {
            visit_id: Number(visitId),
            form_id: Number(formId),
            form_version: Number(formVersion),
            link_name: "rescue",
            link_value: Number(rescue_id),
            //link_data: linkData,
            emr_property: {
                emr_time: currentTime,
                emr_title: emrTitle
            },
            elem_list: formData,
            stakeholder_list: tmp,
        }).then((res: any) => {
            //console.log('***新建', res);
            if (res.code === 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '保存成功',
                })

                fetchPost('emr/GetEmrList', {
                    visit_id: Number(visitId),
                    doc_type: docInfo.doc_type,
                    doc_name: docInfo.doc_type.includes('同意书') || docInfo.doc_type.includes('评估') ? '' : docInfo.doc_name,
                    doc_tag: docInfo.doc_type.includes('同意书') || docInfo.doc_type.includes('评估') ? '' : docInfo.doc_tag,
                    link_name: "rescue",
                    link_value: Number(rescue_id),
                    //link_data: linkData
                }).then((emrList: any) => {
                    // if (emrList.row_list?.length > 1) {
                    //     setIsShowEmrListSidebar(true)
                    // }
                    setEmrList(emrList.row_list);
                    setEmrId(emrList.row_list[0].emr_id);
                    fetchPost('emr/GetEmrProperty', {
                        emr_id: Number(emrList.row_list[0].emr_id),
                        column_user: 'create_user_id,create_user_name,create_time,commit_user_id,commit_user_name,commit_time'
                    }).then((emrProperty: any) => {
                        //console.log('***emrproperty', emrProperty);
                        setEmrTitle(emrProperty.emr_property.emr_title);
                        //getEmrInit(Number(emrProperty.emr_property.form_id), Number(emrProperty.emr_property.form_version))
                        setWriter({
                            create_user_id: emrProperty.user_property.create_user_id,
                            create_user_name: emrProperty.user_property.create_user_name,
                            create_time: emrProperty.user_property.create_time,
                            commit_user_id: emrProperty.user_property.commit_user_id,
                            commit_user_name: emrProperty.user_property.commit_user_name,
                            commit_time: emrProperty.user_property.commit_time
                        });
                    })
                })


            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })

    }

    const handleSaveEMR = async () => {
        //保存病历
        console.log("save emr", emrId);
        console.log("save emr", currentTime);
        console.log("save emr", emrTitle);
        console.log("save emr", formData);
        fetchPost('emr/SaveEmr', {
            emr_id: Number(emrId),
            emr_property: {
                emr_time: currentTime,
                emr_title: emrTitle,
                assess_result: docInfo.doc_type.includes('评估') ? assessResult : ''
            },
            elem_list: formData
        }).then((res: any) => {
            //console.log('***保存', res)
            if (res.code === 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '保存成功',
                })

                // stakeholderList?.filter((i: any) => i.stakeholder_type !== 'AUTHOR')?.forEach((item: any) => {

                //     if (item.user_id) {
                //         attachEmrStakeholder(item.stakeholder_id, item.user_id, item.user_name);
                //     }
                // })

            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }


    // 监听hash是否改变了，改变了就重新发请求获取数据
    useEffect(() => {
        initUrlGetData();
        window.addEventListener('hashchange', () => {
            console.log(555);
            
                initUrlGetData();
                setIsHashChange(true);
        })
    }, []);

    useEffect(() => {

        //重置状态-------------------
        setEmrId(0);
        setEmrList([]);
        setFormData([]);
        setInitFormData([]);
        setIsCommit(false);
        setIsInitLoading(true);
        setAssessResult('');
        setChangeToPdf(false);
        // setIsShowEmrListSidebar(false);

        //获取数据-------------------
        if (visitId != 0 && docInfo.doc_type != '') {
            //console.log(docInfo)
            getInitFormData(docInfo.doc_type, docInfo.doc_name, docInfo.doc_tag);

        }

        const appTabsEnabled = localStorage.getItem('SITE_APP_TABS');
        if (appTabsEnabled == null) {
            setIsPc(true);
        }

        if (isHashChange) {
            setIsHashChange(false);
        }

    }, [visitId, isHashChange, rescue_id]);



    return <div className="emr-wrapper">
        <div className="form-client">
            <div
                className={`formClient-box px-2 ${isShowPdf ? 'd-none' : ''}`}
            >
                {
                    formId ? <>
                        <div className='d-inline-flex align-items-center'>
                            <span className='text-primary text-nowrap'>时间：</span>
                            <InputDate
                                value={defaultCurrentTime}
                                wrapperClassName=''
                                type='datetime-local'
                                localization="zh_CN"
                                onChange={(input: HTMLInputElement, dateRes: any) => {
                                    let _valRes = dateRes !== null && typeof dateRes !== 'string' ? dateRes.res : dateRes;
                                    _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                    if (_valRes === ':00') _valRes = '';

                                    // onchange 的结果（如果用户手动输入，则自动加上秒数）：
                                    //console.log(_valRes);
                                    setCurrentTime(_valRes);
                                }}
                                truncateSeconds
                            />
                        </div>
                        <FormClient
                            actRef={actRef}
                            appearanceConfig={{
                                scoreParentheses: {
                                    before: '【',
                                    after: '】',
                                    divideLine: ' | ',
                                    totalLabel: '分值：',
                                    obtainedLabel: '得分：',
                                    optLabel: '分值：',
                                    optBefore: '（',
                                    optAfter: '）',
                                },
                                btns: {
                                    optSingleLabel: '单选',
                                    optMultipleLabel: '多选',
                                    entryLabel: '结构化',
                                    entryCancelLabel: '取消',
                                    entryConfirmLabel: '确定',
                                    modalCancelLabel: '取消',
                                    modalConfirmLabel: '确定',
                                    referenceDataConfirmLabel: '结构化引用',
                                    referenceDataLabel: '引用',
                                    initSectionLabel: '重新获取',
                                    sync: '同步',
                                    initAlert: '重新获取数据会将当前块的所有数据重置（包含现有数据），如果有默认值，它将会重新赋值，确定？'
                                },
                                referenceDataPanel: {
                                    between: '到',
                                    begin: '开始时间',
                                    end: '结束时间',
                                    sortReverse: '倒序',
                                    noData: '暂无数据，您可以切换开始结束时间筛选',
                                    anomalyOnly: '<span class="text-danger">异常</span>'
                                },
                                others: {
                                    formInit: '表单初始化中...',
                                    sectionInit: '加载中...',
                                    selectLabel: '请选择',
                                    referenceDataPanelTitle: '数据岛',
                                    placeholderNote: '备注',
                                    otherGroupLabel: '其它',
                                    syncSuccess: '同步成功',
                                    syncFailure: '同步失败'
                                }
                            }}
                            defaultValue={changeKeys(formData)}
                            visitId={visitId}
                            formId={formId}
                            linkData={{
                                link_name: "rescue",
                                link_value: Number(rescue_id),
                                //link_data: linkData,
                                link_tag: '',
                                link_ext: ''
                            }}
                            userId={Number(userId)}
                            emrId={initFormData?.length > 0 ? 1 : null}
                            onEntry={(entry_id: string | number, section_id: string | number, row_no: string | number, elem_id: string | number, entryFuncs: any) => {

                                setEntryFuncs((prevState: any) => {

                                    const _val = {
                                        entry_id,
                                        section_id,
                                        row_no,
                                        elem_id,
                                        entryFuncs
                                    };

                                    let res: any[] = Array.from(new Set(prevState));
                                    const currentItemIndex = prevState.findIndex((o: any) => o.entry_id == entry_id && o.section_id == section_id && o.row_no == row_no && o.elem_id == elem_id);

                                    if (itemExist(prevState, entry_id, section_id, row_no, elem_id)) {
                                        res.splice(currentItemIndex, 1);
                                    }
                                    res.push(_val);

                                    // filter entry_id
                                    let _allData = res;
                                    _allData = _allData.reverse().filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.entry_id === item.entry_id)));

                                    return _allData;
                                });
                            }}
                            onChange={(entry_id: string | number, section_id: string | number, row_no: string | number, elem_id: string | number, value_text: string, value_code: string | number, value_note: string, elem_name: string, value_score: number, attrs: any) => {
                                //console.log(111, { entry_id, section_id, row_no, elem_id, value_text, value_note, elem_name, attrs, value_score });

                                setScoreList((prevList) => {
                                    const tmp = [...prevList];
                                    const currentIndex = tmp.findIndex(item => item.entry_id == entry_id && item.section_id == section_id && item.elem_id == elem_id && item.row_no == row_no);
                                    if (currentIndex == -1) {
                                        const _tmp = {
                                            entry_id: entry_id,
                                            section_id: section_id,
                                            elem_id: elem_id,
                                            row_no: row_no,
                                            value_score: value_score,

                                        }
                                        tmp.push(_tmp);
                                    } else {
                                        tmp[currentIndex].value_score = value_score
                                    }

                                    return tmp;
                                })

                                setFormData((prevState: any[]) => {

                                    const currentIndex = prevState.findIndex((item: any) => item.entry_id == entry_id && item.section_id == section_id && item.elem_id == elem_id && item.row_no == row_no)
                                    const tmp = prevState;

                                    if (currentIndex !== -1) {

                                        tmp.splice(currentIndex, 1, {
                                            entry_id: Number(entry_id),
                                            section_id: Number(section_id),
                                            row_no: Number(row_no),
                                            elem_id: Number(elem_id),
                                            value_text: value_text ? value_text.toString()?.replace(/^\s+|\s+$/g, '')?.replace(/\\n$/g, '') : '',
                                            value_code: value_code && value_code != null ? value_code.toString() : '',
                                            value_note: value_note && value_note != null ? value_note.toString() : '',
                                            elem_name: elem_name && elem_name != null ? elem_name.toString() : '',
                                            value_score: Number(value_score),
                                            attrs,
                                        });

                                    } else {

                                        tmp.push({
                                            entry_id: Number(entry_id),
                                            section_id: Number(section_id),
                                            row_no: Number(row_no),
                                            elem_id: Number(elem_id),
                                            value_text: value_text ? value_text.toString()?.replace(/^\s+|\s+$/g, '') : '',
                                            value_code: value_code && value_code != null ? value_code.toString() : '',
                                            value_note: value_note && value_note != null ? value_note.toString() : '',
                                            elem_name: elem_name && elem_name != null ? elem_name.toString() : '',
                                            value_score: Number(value_score),
                                            attrs,
                                        })
                                    }
                                    return tmp;
                                })

                            }}
                            onRemove={(entry_id: string | number, section_id: string | number, row_no: string | number, elem_id: string | number, value_text: string, value_note: string, elem_name: string) => {
                                // console.log({ entry_id, section_id, row_no, elem_id, value_text, value_note, elem_name });
                            }}
                        />
                        {/* <ChangeDetails
                                                title='时间：'
                                                type='date'
                                                content={currentTime}
                                                setValue={setCurrentTime}
                                            /> */}

                    </> : null
                }
                <Button type="primary" onClickOK={saveBtnClick}>
                    <div>保存</div>
                </Button>
            </div>
        </div>
    </div>
}

export default withTranslation()(EMR);