import { withTranslation } from "react-i18next"
import Rescue from "../Rescue";
import EMR from "../EMR/Index";
import { deleteRescueAPI, getRescueListAPI, getRescuePropertyAPI, getSelectRescueUserListAPI, newRescueAPI, saveRescuePropertyAPI, saveRescueUserAPI } from "../../api/rescue";
import { retrieveUserListAPI } from "../../api/user";
import List from "adou-ui/List";
import Form, { FormItem } from "adou-ui/Form";
import "./index.scss";
import useNavigateTo from "../../utils/hooks/useNavigateTo";
import Modal from "adou-ui/Modal";

import 'funda-ui/Date/index.css';
import AdouMultipleSelect from "../adou-multipleSelect";
import dayjs from "dayjs";

// EMR
import FormClient from "../FormClient";
import { useEffect, useRef, useState } from "react";
import { getSessionInfoAPI } from "../../api/emr";
import getHashSearchParam from "../../utils/getHashParams";
import { fetchPost } from "../../config/request";
import { useParams } from "react-router-dom";
import io from "../../utils/custom/io";
import InputDate from 'funda-ui/Date'
import Button from "adou-ui/Button";
import "./index.scss";
import getUrlProperty1 from "../../utils/get-property";
import Loading from "../loading";
const { name } = require("../../../package.json");


const PageIndex = () => {




    // Rescue逻辑
    // const useNavigate = useNavigateTo();

    // const { system_name, rescue_id } = useParams();

    // url参数
    const visitIdRef = useRef<any>(getHashSearchParam("visit_id") || 1);
    const linkNameRef = useRef<any>(getHashSearchParam("link_name") || "抢救");
    const linkValueRef = useRef<any>(getHashSearchParam("link_value") || "");

    const [activeId, setActiveId] = useState<number>(-1);

    // 抢救属性
    const [rescueList, setRescueList] = useState<any[]>([]);
    // const [resuceId, setRecueId] = useState<number>(-1); 换成 Ref来
    const rescueIdRef = useRef<number>(-1);
    const [rescueProperty, setRescueProperty] = useState<any>({})
    const [showDeleteRescueModal, setShowDeleteRescueModal] = useState(false);
    const [result, setResult] = useState("SUCCESS");
    const [rescueResult, setRescueResultList] = useState<any>([
        { label: "成功", value: "成功" },
        { label: "失败", value: "失败" },
        { label: "抢救中", value: "抢救中" },
        { label: "放弃", value: "放弃" },
    ])

    const [rescueGo, setRescueGo] = useState<any>([
        { label: "病房", value: "病房" },
        { label: "ICU ", value: "ICU " },
        { label: "回家", value: "回家" },
        { label: "死亡 ", value: "死亡" },
    ])

    const formRef = useRef<any>(null);

    const getUrlProperty = () => {
        visitIdRef.current = (Number(getHashSearchParam("visit_id")))
        linkNameRef.current = (getHashSearchParam("link_name"))
        linkValueRef.current = (getHashSearchParam("link_value"))
    }

    // const routerJump = (id: number) => {
    //     useNavigate(`/${system_name}/${id || "-1"}?link_name=${linkNameRef.current}&link_value=${linkValueRef.current}&visit_id=${visitIdRef.current}`)
    //     getUrlProperty();
    // }

    const getRescueList = async () => {
        const res = await getRescueListAPI(visitIdRef.current);
        if (res.code === 0) {
        } else {
            return io('BRIDGE_ALERT', {
                process: 0,
                info: res.message,
                theme: 'danger'
            })
        }
        res.row_list = res.row_list.filter((item: any) => item.valid_status === "1");
        const data = res.row_list.map((item: any) => {
            let result = "";
            if (item.rescue_result === "SUCCESS") {
                result = "成功";
            } else if (item.rescue_result === "FAIL") {
                result = "失败";
            } else if (item.rescue_result === "RESCUE") {
                result = "抢救中";
            } else if (item.rescue_result === "ABORT") {
                result = "放弃";
            }
            const dayjsTime1 = dayjs(item.start_time);
            const dayjsTime2 = dayjs(item.end_time);

            // 判断两个时间是否在同一个小时内
            let name = "";
            if (dayjsTime1.hour() === dayjsTime2.hour() && dayjsTime1.date() === dayjsTime2.date() && dayjsTime1.month() === dayjsTime2.month() && dayjsTime1.year() === dayjsTime2.year()) {
                name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
            } else if (dayjsTime1.isSame(dayjsTime2, 'day')) {
                name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
            } else if (dayjsTime1.isSame(dayjsTime2, 'year')) {
                name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.month() < 10 ? "0" + dayjsTime2.month() : dayjsTime2.month()}-${dayjsTime2.date() < 10 ? "0" + dayjsTime2.date() : dayjsTime2.date()} ${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
            } else if (!item.end_time) {
                name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}-抢救中`
            } else {
                name = `${item.start_time}-${item.end_time || "抢救中"}`
            }
            // name = `${item.start_time}-${item.end_time || "未知"}-[${result}]`
            return { ...item, name, id: item.rescue_id };
        })
        if (Number(rescueIdRef.current) === -1) {

            // routerJump(data[0]?.rescue_id);
            rescueIdRef.current = data[0]?.rescue_id;
            setActiveId(data[0]?.rescue_id);
        } else if (!data.some((item: any) => Number(item.rescue_id) === Number(rescueIdRef.current))) {
            // routerJump(data[0]?.rescue_id);
            rescueIdRef.current = data[0]?.rescue_id;
        }

        data.forEach((item: any) => {
            if (item.rescue_result === "SUCCESS") {
                item.showTag = "success-tag";
            } else if (item.rescue_result === "FAIL") {
                item.showTag = "fail-tag";
            } else if (item.rescue_result === "RESCUE") {
                item.showTag = "rescue-tag";
            } else if (item.rescue_result === "ABORT") {
                item.showTag = "abort-tag";
            }
        })
        setRescueList(data);

    }

    const handleRescueItemClick = (node: any) => {
        // formRef.current.resetForm(); // 不能随便清空，不然有些值后续赋值不上。。--那种简单值
        // routerJump(node.rescue_id);
        rescueIdRef.current = node.rescue_id;
        if (Number(rescueIdRef.current) > 0) {
            getRescueProperty();
            getSelectUserList();
            getRescueUserList("");
            getInitFormData(docInfo.doc_type, docInfo.doc_name, docInfo.doc_tag);
            multipleRef.current.clear();
        }


    }

    const getRescueProperty = async () => {
        try {
            const res = await getRescuePropertyAPI(Number(rescueIdRef.current));
            if (res.code === 0) {
            } else {
                return io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
            const rescue_property = { ...res.rescue_property }
            let result = "";
            if (rescue_property.rescue_result === "SUCCESS") {
                result = "成功";
            } else if (rescue_property.rescue_result === "FAIL") {
                result = "失败";
            } else if (rescue_property.rescue_result === "RESCUE") {
                result = "抢救中";
            } else if (rescue_property.rescue_result === "ABORT") {
                result = "放弃";
            }
            const property = { ...rescue_property, rescue_result: result };
            // formRef.current.resetForm();
            // setRescueProperty({});
            setTimeout(() => {
                setRescueProperty(property); // 有时候会出现异步问题，加个定时器即可
                setResult(property.rescue_result);
                setStartTime(rescue_property.start_time);
                setEndTime(rescue_property.end_time);
                setDeadTime(rescue_property.dead_time);
            }, 10);
        } catch (error) {

        }
    }

    const multipleRef = useRef<any>(null);

    const handleAddRescue = () => {
        // 点击新增后把 activeId置空
        setActiveId(-1);
        // routerJump(-1);
        rescueIdRef.current = -1;
        formRef.current.resetForm();
        // 这个得手动再清除一下，不然的话会出现表单赋值失败
        // 因为不清除的话，还是会还是保留上一次的值
        // 然后上一次的值如果跟保存成功后请求的值一样的话，React就不会触发重新渲染的机制，会认为是一样的
        setRescueProperty({})
        setSelectUserList([]);
        setResult("");
        multipleRef.current && multipleRef.current.clear && multipleRef.current.clear();
        setEmrList([]);

    }

    const handleSaveRescue = async () => {
        formRef.current.validate((valid: boolean) => {
            if (valid) {
                formRef.current.submitForm(async (formData: any) => {
                    let result = "";
                    formData.start_time = startTime;
                    formData.end_time = endTime;
                    formData.dead_time = deatTime;

                    let showTag = "";
                    if (formData.rescue_result?.value === "成功") {
                        result = "SUCCESS";
                        showTag = "success-tag"
                    } else if (formData.rescue_result?.value === "失败") {
                        result = "FAIL";
                        showTag = "fail-tag"
                    } else if (formData.rescue_result?.value === "抢救中") {
                        result = "RESCUE";
                        showTag = "rescue-tag"
                    } else if (formData.rescue_result?.value === "放弃") {
                        result = "ABORT";
                        showTag = "abort-tag"
                    }
                    const data = { ...formData, rescue_result: result, rescue_go: formData.rescue_go?.value }
                    try {
                        const res: any = await (Number(rescueIdRef.current) === -1 || !rescueList.length) ? await newRescueAPI(visitIdRef.current, data) : await saveRescuePropertyAPI(Number(rescueIdRef.current), data);
                        if (res.code === 0) {
                            io('BRIDGE_ALERT', {
                                process: 0,
                                info: "操作成功",
                            })
                        } else {
                            return io('BRIDGE_ALERT', {
                                process: 0,
                                info: res.message,
                                theme: 'danger'
                            })
                        }
                        let name = "";
                        const dayjsTime1 = dayjs(data.start_time);
                        const dayjsTime2 = dayjs(data.end_time);
                        if (dayjsTime1.hour() === dayjsTime2.hour() && dayjsTime1.date() === dayjsTime2.date() && dayjsTime1.month() === dayjsTime2.month() && dayjsTime1.year() === dayjsTime2.year()) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (dayjsTime1.isSame(dayjsTime2, 'day')) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (dayjsTime1.isSame(dayjsTime2, 'year')) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.month() < 10 ? "0" + dayjsTime2.month() : dayjsTime2.month()}-${dayjsTime2.date() < 10 ? "0" + dayjsTime2.date() : dayjsTime2.date()} ${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (!data.end_time) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}-抢救中`
                        } else {
                            name = `${data.start_time}-${data.end_time || "抢救中"}`
                        }
                        if ((Number(rescueIdRef.current) === -1 || !rescueList.length) && res.rescue_id > 0) {
                            // routerJump(res.rescue_id);
                            rescueIdRef.current = res.rescue_id;
                            setActiveId(res.rescue_id);
                            let result = "";
                            if (data.rescue_result === "SUCCESS") {
                                result = "成功";
                            } else if (data.rescue_result === "FAIL") {
                                result = "失败";
                            } else if (data.rescue_result === "RESCUE") {
                                result = "抢救中";
                            } else if (data.rescue_result === "ABORT") {
                                result = "放弃";
                            }
                            setRescueList([...rescueList, {
                                ...data, rescue_id: res.rescue_id, name, id: res.rescue_id,
                                showTag
                            }])
                        }
                        // 控制结束时间变化，因为不去重新获取列表
                        setRescueList((arr: any) => {
                            return arr.map((item: any) => {

                                if (item.rescue_id === Number(rescueIdRef.current)) {
                                    item.end_time = data.end_time;
                                    item.name = name;
                                    item.showTag = showTag;
                                }
                                return item;
                            })
                        })
                        /* setTimeout(() => {
                            getRescueList(); // 不再获取，手动在列表尾部添加一下
                        }, 10); */
                        // getRescueProperty(); // 不再获取，本来是什么值就直接展示即可
                    } catch (error) {
                        console.error(error);

                    }
                })
            }
        })

    }

    const handleDeleteRescue = async () => {
        setShowDeleteRescueModal(true);
    }

    // 改变结果的时候，判断后要适当地修改和删除表单数据
    const handleRsultChange = (value: any) => {
        setResult(value.value);
        setRescueProperty({ ...rescueProperty, rescue_result: value.value })
        if (value.value === "抢救中") {
            setEndTime(""); // 删除表单数据
        }
    }

    const handleGoChange = (value: any) => {
        setRescueProperty({ ...rescueProperty, rescue_go: value.value })
    }

    const handleConfirmDeleteRescue = async () => {
        handleCloseDeleteRescueModal();
        if (Number(rescueIdRef.current) > 0) {
            try {
                const res = await deleteRescueAPI(Number(rescueIdRef.current))
                if (res.code === 0) {
                    io('BRIDGE_ALERT', {
                        process: 0,
                        info: '操作成功',
                    });
                    // 要把当前删除的抢救记录的信息删除
                    setStartTime("");
                    setEndTime("");
                    setDeadTime("");
                    setSelectUserList([]);
                    setRescueProperty({});
                    getRescueList();
                } else {
                    io('BRIDGE_ALERT', {
                        process: 0,
                        info: res.message,
                        theme: 'warning'
                    });
                }
            } catch (error) {
                console.error(error);

            }
        }
    }
    const handleCloseDeleteRescueModal = () => {
        setShowDeleteRescueModal(false);
    }


    useEffect(() => {
        initUrlGetData();
        getUrlProperty();
        setStartTime(defaultVal);
        setDefaultCustomDate(defaultVal);
        window.addEventListener('hashchange', () => {
            if (name === "rescue-manage") {
                const { visit_id } = getUrlProperty1();
                visitIdRef.current = Number(visit_id);
                if (visitIdRef.current > 0) {
                    // 这两个要有 --
                    Number(rescueIdRef.current) > 0 && getRescueList();
                    Number(rescueIdRef.current) > 0 && getSelectUserList();
                }
                initUrlGetData();
                setIsHashChange(true);
                // 要把当前删除的抢救记录的信息删除--出现问题哈哈，不去获取rescueProperty
                /* setStartTime("");
                setEndTime("");
                setDeadTime("");
                setSelectUserList([]);
                setRescueProperty({});
                getRescueList(); */
            }

        })
    }, []);

    useEffect(() => {
        visitIdRef.current > 0 && getRescueList();
    }, [visitIdRef.current])

    useEffect(() => {
        // routerJump(Number(rescue_id));
        if (Number(rescueIdRef.current) > 0) {
            setActiveId(rescueIdRef.current);
            getRescueProperty();
            getSelectUserList();
            getRescueUserList("");
            getInitFormData(docInfo.doc_type, docInfo.doc_name, docInfo.doc_tag);
        }
        // rescueIdRef.current = (Number(rescue_id));
    }, [rescueIdRef.current])

    // 抢救人员
    interface UserPropertyProp {
        user_name: string;
        work_type?: "DOCTOR" | "NURSE" | "";
        work_level?: string;
        user_tag?: any;
        user_note?: string
    }
    const [selectUserList, setSelectUserList] = useState<any>([]);
    const [userList, setUserList] = useState<any>([]);
    const [showDeleteSelectUserModal, setShowDeleteSelectUserModal] = useState(false);
    const [deletUserInfo, setDeleteUserInfo] = useState<any>({});
    const [userProperty, setUserProperty] = useState<UserPropertyProp>({
        user_name: "",
        work_type: "",
        work_level: "",
        user_tag: "",
        user_note: ""
    });
    const userPropertyFormRef = useRef<any>(null);
    const userListFormRef = useRef<any>(null);
    const getSelectUserList = async () => {
        try {
            const res = await getSelectRescueUserListAPI(Number(rescueIdRef.current));
            if (res.code === 0) {
            } else {
                return io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
            const data = res.row_list.map((item: any) => {
                return {
                    ...item, id: item.user_id, rescue_id: item.rescue_id,
                    name: `${item.user_name}${item.work_type ? `-[${item.work_type}]` : ""}${item.work_level ? `-[${item.work_level}]` : ""}`
                }
            })
            setSelectUserList(data);
        } catch (error) {

        }
    }

    const getRescueUserList = async (retrieveInput: string) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem("SITE_AUTH_USER_DATA") || "");
            const org_id = userInfo.org_id;
            const res = await retrieveUserListAPI(org_id, retrieveInput)
            if (res.code === 0) {
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
            setUserList(res.user_list.map((item: any) => {
                return {
                    ...item,
                    value: item.user_id, label: `${item.user_name}${item.work_type ? `-[${item.work_type}]` : ""}${item.work_level ? `-[${item.work_level}]` : ""}`
                }
            }));
        } catch (error) {
            console.error(error);
        }


    }

    const handleRetrieveInputChange = async (value: string) => {
        getRescueUserList(value);
    }

    // 下拉框选择一个医生
    const handleUserSelect = (value: any) => {
        if (Number(rescueIdRef.current) > 0) {
            const arr = [...value, ...selectUserList]
            // 使用 reduce 方法过滤掉相同 id 的对象
            let filteredArray = arr.reduce((unique, currentObject) => {
                // 检查 unique 数组中是否已经包含相同 id 的对象
                if (!unique.some((obj: any) => obj.user_id === currentObject.user_id)) {
                    unique.push(currentObject);
                }
                return unique;
            }, []);

            updateSelectRescueUserList(filteredArray);
        } else {
            // addSelectRescueUserList(value);
        }
    }

    // 修改逻辑--直接发请求，能拿到 rescue_id
    const updateSelectRescueUserList = async (value: any) => {
        try {
            const res = await saveRescueUserAPI(Number(rescueIdRef.current), 0, value);
            if (res.code === 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '操作成功',
                })


            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
            getSelectUserList();
        } catch (error) {
            console.error(error);

        }

    }
    /* const addSelectRescueUserList = async(value: any) => {

    } */

    // 新增逻辑--不发请求，先存着一个变量，然后点保存后获取新增的 rescue_id再一起发请求保存

    // 删除逻辑
    const handleShowDeleteSelectUserModal = (type: string, data: any) => {
        setDeleteUserInfo(data);
        setShowDeleteSelectUserModal(true);
    }

    const handleConfirmDeleteSelectUser = async () => {
        try {
            const res = await saveRescueUserAPI(Number(rescueIdRef.current), deletUserInfo.row_id);
            getSelectUserList();
        } catch (error) {
            console.error(error);

        }
        handleCloseDeleteSelectUserModal();
    }

    const handleCloseDeleteSelectUserModal = () => {
        setShowDeleteSelectUserModal(false);
    }

    // 尝试使用常哥的组件
    const defaultVal = '2024-03-14 10:22:05';

    const [startTime, setStartTime] = useState<string>(rescueProperty.start_time);
    const [endTime, setEndTime] = useState<string>(rescueProperty.end_time);
    const [deatTime, setDeadTime] = useState<string>(rescueProperty.dead_time);
    const [defaultCustomDate, setDefaultCustomDate] = useState<string>('');






    // EMR逻辑

    const { visit_id, link_value, link_name, link_data, doc_tag } = getUrlProperty1();

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
        // console.log('-------------------------', JSON.stringify(data))
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
            link_value: Number(rescueIdRef.current)
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
            visit_id: Number(visitIdRef.current),
            doc_type: "抢救病历",
            doc_name: "抢救记录",
            doc_tag: "#",
            link_name: "rescue",
            link_value: Number(rescueIdRef.current),
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
                getFormList(docInfo.doc_type, docInfo.doc_name, docInfo.doc_tag);

            }
        })
    }

    //刷新
    const refreshData = () => {

        console.log('refresh-----------------');
        //console.log(emrId);

        getEmrProperty(emrId, visitId);

        fetchPost('emr/GetEmrList', {
            visit_id: Number(visitIdRef.current),
            doc_type: "抢救病历",
            doc_name: "抢救记录",
            doc_tag: "#",
            link_name: "rescue",
            link_value: Number(rescueIdRef.current),
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
            doc_type: "抢救病历",
            doc_name: "抢救记录",
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

                    setFormData(emrElemList.value_list);
                    setInitFormData(emrElemList.value_list);
                    setIsInitLoading(false);
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
                    // console.log('emr数据元数据', JSON.stringify(emrElemList));
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
            visit_id: Number(visitIdRef.current),
            form_id: form_id,
            form_version: form_version,
            link_name: "rescue",
            link_value: Number(rescueIdRef.current),
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
            handleSaveEMR();


        } else {
            handleCreateEMR();
        }
    }

    const commitBtnClick = async () => {
        //提交表单
        // stakeholderList?.filter((i: any) => i.stakeholder_type !== 'AUTHOR')?.forEach((item: any) => {

        //     attachEmrStakeholder(item.stakeholder_id, item.user_id, item.user_name);
        // });                                                    

        fetchPost('emr/SaveEmr', {
            emr_id: Number(emrId),
            emr_property: {
                emr_time: currentTime,
                emr_title: emrTitle,
                assess_result: docInfo.doc_type.includes('评估') ? assessResult : ''
            },
            elem_list: formData
        }).then((res: any) => {

            if (res.code === 0) {
                //console.log('保存成功');
                fetchPost('emr/CommitEmr', {
                    emr_id: Number(emrId)
                }).then((res: any) => {
                    //console.log('提交', res);
                    if (res.code == 0) {
                        io('BRIDGE_ALERT', {
                            process: 0,
                            info: '提交成功',
                        })

                        setIsShowPdf(false);
                        // setIsShowPdf(true);
                        setChangeToPdf(true);
                        setIsCommit(true);
                        setIsDocLoading(true);


                        if (docInfo.doc_type?.includes('评估')) getRecList(Number(visitId), docInfo.doc_type);
                        fetchPost('emr/GetEmrProperty', {
                            emr_id: Number(emrId),
                            column_user: 'create_user_id,create_user_name,create_time,commit_user_id,commit_user_name,commit_time'
                        }).then((emrProperty: any) => {
                            //console.log('***emrproperty', emrProperty);
                            setEmrTitle(emrProperty.emr_property.emr_title);
                            getEmrInit(Number(emrProperty.emr_property.form_id), Number(emrProperty.emr_property.form_version))
                            setWriter({
                                create_user_id: emrProperty.user_property.create_user_id,
                                create_user_name: emrProperty.user_property.create_user_name,
                                create_time: emrProperty.user_property.create_time,
                                commit_user_id: emrProperty.user_property.commit_user_id,
                                commit_user_name: emrProperty.user_property.commit_user_name,
                                commit_time: emrProperty.user_property.commit_time
                            });
                        })

                        let i = 0;
                        const fetchTimer = setInterval(() => {
                            i++;
                            fetchPost('doc/visit/GetVisitDocList', {
                                visit_id: Number(visitId),
                                owner_type: 'EMR',
                                // owner_id: Number(emrRes.row_list[0].emr_id)
                                owner_id: Number(emrId)
                            }).then((docListRes: any) => {
                                //console.log('******文档数据', docListRes);
                                if (docListRes.row_list && docListRes.row_list.length > 0) {
                                    clearInterval(fetchTimer);
                                    setIsDocLoading(false);
                                    const tmp: any = [];
                                    docListRes.row_list.forEach((item: any, index: number) => {
                                        const _tmp = {
                                            doc_id: item.doc_id,
                                            doc_type: item.doc_type,
                                            doc_name: item.doc_name,
                                            doc_tag: item.doc_tag
                                        }

                                        tmp.push(_tmp);

                                        // fetchPost('doc/visit/GetVisitDocContent', {
                                        //     doc_id: Number(item.doc_id),
                                        //     encode_content: false,
                                        //     add_watermark: true,
                                        // }).then((contentRes: any) => {
                                        //     console.log('脱敏，水印', contentRes);
                                        //     setIsDocLoading(false);
                                        //     setDocId(docListRes.row_list[0].doc_id);

                                        // })
                                    })
                                    setDocList(tmp);
                                    setChangeToPdf(true);
                                    setDocId(docListRes.row_list[0].doc_id);
                                    setIsDocLoading(false);
                                    // setIsShowPdf(false);
                                    // setIsShowPdf(true);
                                }
                                return;
                            })
                            if (i == 10) {
                                clearInterval(fetchTimer);
                                setIsDocLoading(false);
                            }
                        }, 1000)

                    } else {
                        io('BRIDGE_ALERT', {
                            process: 0,
                            info: res.message,
                            theme: 'danger'
                        })
                    }

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

    const handleCreateEMR = async () => {
        const tmp: any[] = [];

        fetchPost('emr/CreateEmr', {
            visit_id: Number(visitId),
            form_id: Number(formId),
            form_version: Number(formVersion),
            link_name: "rescue",
            link_value: Number(rescueIdRef.current),
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
                    visit_id: Number(visitIdRef.current),
                    doc_type: "抢救病历",
                    doc_name: "抢救记录",
                    doc_tag: "#",
                    link_name: "rescue",
                    link_value: Number(rescueIdRef.current),
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


            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

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

    }, [visitId, isHashChange]);


    return <div className="page-index">
        <div className="rescu">
            <div className="rescue-wrapper">
                <div className="rescue-list p-2">
                    <div className="header mb-2">
                        <Button onClickOK={handleAddRescue} size="sm" outlineColor="success">
                            <>
                                <i className="me-1 fa-solid fa-circle-plus"></i>
                                <span>新增</span>
                            </>
                        </Button>
                    </div>
                    <div className="content">
                        <List showTag={true} maxHeight={360} showOptIcons={false} onItemClick={(node) => handleRescueItemClick(node)} activeId={activeId} maxWidth={300} data={rescueList}>
                            <div id='success-tag' className='success-tag'>成功</div>
                            <div id='fail-tag' className='fail-tag'>失败</div>
                            <div id='abort-tag' className='abort-tag'>放弃</div>
                            <div id='rescue-tag' className='rescue-tag'>抢救中</div>
                        </List>
                    </div>
                </div>
                <div className="property p-2">
                    <div className="header mb-2 d-flex">
                        <div>抢救属性</div>
                        <div className="delete-btn text-end flex-1">
                            <Button onClickOK={handleDeleteRescue} size="sm" outlineColor="danger">
                                <>
                                    <i className="me-1 fa-regular fa-trash-can"></i>
                                    <span>删除</span>
                                </>
                            </Button>
                        </div>
                    </div>
                    <div className="content">
                        <Form ref={formRef}>
                            <FormItem label="开始时间" name="start_time">
                                <InputDate
                                    wrapperClassName="position-relative"
                                    name="name"
                                    value={rescueProperty.start_time} // Don't use customDate assignments directly
                                    type="datetime-local"
                                    truncateSeconds
                                    placeholder="yyyy/MM/dd HH:mm"
                                    onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean, allSplittingInputs: any[]) => {
                                        let _valRes = dateRes !== null && typeof dateRes !== 'string' ? dateRes.res : dateRes;
                                        _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                        if (_valRes === ':00') _valRes = '';
                                        console.log(_valRes);

                                        setStartTime(_valRes);
                                    }}
                                />
                            </FormItem>
                            {result !== "RESCUE" && result !== "抢救中" &&
                                <FormItem label="结束时间" name="end_time">
                                    <InputDate
                                        wrapperClassName="position-relative"
                                        name="name"
                                        value={rescueProperty.end_time} // Don't use customDate assignments directly
                                        type="datetime-local"
                                        truncateSeconds
                                        placeholder="yyyy/MM/dd HH:mm"
                                        onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean, allSplittingInputs: any[]) => {
                                            let _valRes = dateRes !== null && typeof dateRes !== 'string' ? dateRes.res : dateRes;
                                            _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                            if (_valRes === ':00') _valRes = '';
                                            console.log(_valRes);

                                            setEndTime(_valRes);
                                        }}
                                    />
                                </FormItem>
                            }
                            <FormItem label="抢救结果" name="rescue_result">
                                <FormItem.Select onChangeOK={(value: any) => handleRsultChange(value)} options={rescueResult} defaultValue={{ value: rescueProperty.rescue_result }}>
                                </FormItem.Select>
                            </FormItem>
                            <FormItem label="抢救去向" name="rescue_go">
                                <FormItem.Select onChangeOK={(value: any) => handleGoChange(value)} options={rescueGo} defaultValue={{ value: rescueProperty.rescue_go }}>
                                </FormItem.Select>
                            </FormItem>
                            <FormItem label="抢救备注" name="rescue_note">
                                <FormItem.Input defaultValue={rescueProperty.rescue_note}>
                                </FormItem.Input>
                            </FormItem>
                            {(rescueProperty.rescue_result === "失败" || rescueProperty.rescue_result === "放弃") &&
                                <FormItem label="死亡时间" name="dead_time">
                                    <InputDate
                                        wrapperClassName="position-relative"
                                        name="name"
                                        value={rescueProperty.dead_time} // Don't use customDate assignments directly
                                        type="datetime-local"
                                        truncateSeconds
                                        placeholder="yyyy/MM/dd HH:mm"
                                        onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean, allSplittingInputs: any[]) => {
                                            let _valRes = dateRes !== null && typeof dateRes !== 'string' ? dateRes.res : dateRes;
                                            _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                            if (_valRes === ':00') _valRes = '';
                                            console.log(_valRes);

                                            setDeadTime(_valRes);
                                        }}
                                    />
                                </FormItem>
                            }
                        </Form>
                        <Modal width="600px" title="提示" content={<div>确定删除该抢救记录(ID：{rescueIdRef.current})？</div>} type="tip" show={showDeleteRescueModal} onConfirm={handleConfirmDeleteRescue} onCancel={handleCloseDeleteRescueModal} onClose={handleCloseDeleteRescueModal}></Modal>
                    </div>
                    <div className="footer">
                        <Button onClickOK={handleSaveRescue} type="primary"><div>保存</div></Button>
                    </div>
                </div>
                <div className="user-list p-2">
                    <div className="header mb-2 d-flex">
                        <div>抢救人员</div>
                        {/* <div className="opt-btns text-end">
                        <div className="btn-add me-1">
                            <Button onClickOK={handleDeleteRescue} size="sm" outlineColor="success">
                                <>
                                    <i className="me-1 fa-solid fa-circle-plus"></i>
                                    <span>新增</span>
                                </>
                            </Button>
                        </div>
                        <div className="btn-delete">
                            <Button onClickOK={handleDeleteRescue} size="sm" outlineColor="danger">
                                <>
                                    <i className="me-1 fa-regular fa-trash-can"></i>
                                    <span>删除</span>
                                </>
                            </Button>
                        </div>
                    </div> */}
                    </div>
                    <div className="content">
                        <div className="select-user-list">
                            <List onOptIconClick={(type: string, data: any) => handleShowDeleteSelectUserModal(type, data)} showAddIcon={false} showEditIcon={false} data={selectUserList}></List>
                        </div>
                        <Modal width="600px" title="提示" content={<div>确定移除该抢救人员(姓名：{deletUserInfo.user_name})？</div>} type="tip" show={showDeleteSelectUserModal} onConfirm={handleConfirmDeleteSelectUser} onCancel={handleCloseDeleteSelectUserModal} onClose={handleCloseDeleteSelectUserModal}></Modal>
                    </div>
                    <div className="footer-user-list text-end">
                        <AdouMultipleSelect ref={multipleRef} disabled={(Number(rescueIdRef.current) <= 0 || !rescueList.length)} onMultipleSelectChangeOK={(value: any) => handleUserSelect(value)} showSelected={false} onChangeOK={(value: any) => handleRetrieveInputChange(value)} options={userList}></AdouMultipleSelect>
                    </div>
                </div>
            </div>
        </div>
        <div className="emr">
            <div className="form-client">
                <div
                    className={`formClient-box px-2 ${isShowPdf ? 'd-none' : ''}`}
                >
                    {
                        !isInitLoading ? formId ? <>
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
                                    link_value: Number(rescueIdRef.current),
                                    //link_data: linkData,
                                    link_tag: '',
                                    link_ext: ''
                                }}
                                userId={Number(userId)}
                                emrId={initFormData.length > 0 ? 1 : null}
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
                                    console.log(111, { entry_id, section_id, row_no, elem_id, value_text, value_note, elem_name, attrs, value_score });

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

                        </> : null : <Loading></Loading>
                    }
                    {!isInitLoading && <div className="btns d-flex mt-2">
                        <div className="save-btn me-1">
                            <Button type="primary" onClickOK={saveBtnClick}>
                                <div>保存</div>
                            </Button>
                        </div>
                        {emrList.length > 0 && <div className="commit-btn">
                            <Button type="success" onClickOK={commitBtnClick}>
                                <div>提交</div>
                            </Button>
                        </div>}
                    </div>}
                </div>
            </div>
        </div>
    </div>
}

export default withTranslation()(PageIndex);