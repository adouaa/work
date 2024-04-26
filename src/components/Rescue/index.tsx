import { useEffect, useRef, useState } from "react";
import { withTranslation } from "react-i18next"
import getHashSearchParam from "../../utils/getHashParams";
import { deleteRescueAPI, getRescueListAPI, getRescuePropertyAPI, getSelectRescueUserListAPI, newRescueAPI, saveRescuePropertyAPI, saveRescueUserAPI } from "../../api/rescue";
import { retrieveUserListAPI } from "../../api/user";
import List from "adou-ui/List";
import Button from "adou-ui/Button";
import Form, { FormItem } from "adou-ui/Form";
import "./index.scss";
import useNavigateTo from "../../utils/hooks/useNavigateTo";
import { useParams } from "react-router-dom";
import Modal from "adou-ui/Modal";

import Date from 'funda-ui/Date';
import 'funda-ui/Date/index.css';
import AdouMultipleSelect from "../adou-multipleSelect";
import dayjs from "dayjs";

const Rescue = () => {

    const useNavigate = useNavigateTo();

    const { system_name, rescue_id } = useParams();

    // url参数
    const visitIdRef = useRef<any>(getHashSearchParam("visit_id") || 1);
    const linkNameRef = useRef<any>(getHashSearchParam("link_name") || "抢救");
    const linkValueRef = useRef<any>(getHashSearchParam("link_value") || "");

    const [activeId, setActiveId] = useState<number>(-1);

    // 抢救属性
    const [rescueList, setRescueList] = useState<any[]>([]);
    const [resuceId, setRecueId] = useState<number>(-1);
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

    const routerJump = (id: number) => {
        useNavigate(`/${system_name}/${id || "-1"}?link_name=${linkNameRef.current}&link_value=${linkValueRef.current}&visit_id=${visitIdRef.current}`)
    }

    const getRescueList = async () => {
        const res = await getRescueListAPI(visitIdRef.current);
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
                name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}-未知`
            } else {
                name = `${item.start_time}-${item.end_time || "未知"}`
            }
            // name = `${item.start_time}-${item.end_time || "未知"}-[${result}]`
            return { ...item, name, id: item.rescue_id };
        })
        if (Number(rescue_id) === -1) {
            routerJump(data[0]?.rescue_id);
            setActiveId(data[0]?.rescue_id);
        } else if (!data.some((item: any) => Number(item.rescue_id) === Number(rescue_id))) {
            routerJump(data[0]?.rescue_id);
        }


        setRescueList(data);

    }

    const handleRescueItemClick = (node: any) => {
        console.log(node);

        formRef.current.resetForm();
        routerJump(node.rescue_id);
        setRecueId(node.rescue_id);
    }

    const getRescueProperty = async () => {
        try {
            const res = await getRescuePropertyAPI(Number(rescue_id));
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

    const handleAddRescue = () => {
        routerJump(-1);
        formRef.current.resetForm();
        // 这个得手动再清除一下，不然的话会出现表单赋值失败
        // 因为不清除的话，还是会还是保留上一次的值
        // 然后上一次的值如果跟保存成功后请求的值一样的话，React就不会触发重新渲染的机制，会认为是一样的
        setRescueProperty({})
        setSelectUserList([]);
        setResult("");
    }

    const handleSaveRescue = async () => {
        formRef.current.validate((valid: boolean) => {
            if (valid) {
                formRef.current.submitForm(async (formData: any) => {
                    let result = "";
                    formData.start_time = startTime;
                    formData.end_time = endTime;
                    formData.dead_time = deatTime;
                    console.log(formData);

                    if (formData.rescue_result?.value === "成功") {
                        result = "SUCCESS";
                    } else if (formData.rescue_result?.value === "失败") {
                        result = "FAIL";
                    } else if (formData.rescue_result?.value === "抢救中") {
                        result = "RESCUE";
                    } else if (formData.rescue_result?.value === "放弃") {
                        result = "ABORT";
                    }
                    const data = { ...formData, rescue_result: result, rescue_go: formData.rescue_go?.value }
                    try {
                        const res = await Number(rescue_id) === -1 ? await newRescueAPI(visitIdRef.current, data) : await saveRescuePropertyAPI(Number(rescue_id), data);
                        if (res.code !== 0) {
                            // 弹窗警告
                            console.log("失败啦");

                            return;
                        }
                        let name = "";
                        console.log(data);

                        const dayjsTime1 = dayjs(data.start_time);
                        const dayjsTime2 = dayjs(data.end_time);
                        if (dayjsTime1.hour() === dayjsTime2.hour() && dayjsTime1.date() === dayjsTime2.date() && dayjsTime1.month() === dayjsTime2.month() && dayjsTime1.year() === dayjsTime2.year()) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (dayjsTime1.isSame(dayjsTime2, 'day')) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (dayjsTime1.isSame(dayjsTime2, 'year')) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}~${dayjsTime2.month() < 10 ? "0" + dayjsTime2.month() : dayjsTime2.month()}-${dayjsTime2.date() < 10 ? "0" + dayjsTime2.date() : dayjsTime2.date()} ${dayjsTime2.hour() < 10 ? "0" + dayjsTime2.hour() : dayjsTime2.hour()}:${dayjsTime2.minute() < 10 ? "0" + dayjsTime2.minute() + "分" : dayjsTime2.minute() + "分"}`
                        } else if (!data.end_time) {
                            name = `${dayjsTime1.format("YYYY-MM-DD HH:mm")}-未知`
                        } else {
                            name = `${data.start_time}-${data.end_time || "未知"}`
                        }
                        if (Number(rescue_id) === -1 && res.rescue_id > 0) {
                            routerJump(res.rescue_id);
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
                                ...data, rescue_id: res.rescue_id, name, id: res.rescue_id
                            }])
                        }
                        console.log(data);

                        // 控制结束时间变化，因为不去重新获取列表
                        setRescueList((arr: any) => {
                            return arr.map((item: any) => {
                                console.log(item.rescue_id);
                                console.log(Number(rescue_id));

                                if (item.rescue_id === Number(rescue_id)) {
                                    item.end_time = data.end_time;
                                    item.name = name;
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
        if (Number(rescue_id) > 0) {
            try {
                const res = await deleteRescueAPI(Number(rescue_id))
                getRescueList();
            } catch (error) {
                console.error(error);

            }
        }
    }
    const handleCloseDeleteRescueModal = () => {
        setShowDeleteRescueModal(false);
    }

    useEffect(() => {
        getUrlProperty();

    }, [])

    useEffect(() => {
        visitIdRef.current > 0 && getRescueList();
    }, [visitIdRef.current])

    useEffect(() => {
        setActiveId(Number(rescue_id))
        // routerJump(Number(rescue_id));
        if (Number(rescue_id) > 0) {
            getRescueProperty();
            getSelectUserList();
            getRescueUserList("");
        }
        setRecueId(Number(rescue_id));
    }, [rescue_id])

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
            const res = await getSelectRescueUserListAPI(Number(rescue_id));
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
        if (Number(rescue_id) > 0) {
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
            const res = await saveRescueUserAPI(Number(rescue_id), 0, value);
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
        console.log(rescueProperty);
        setTimeout(() => {
            console.log(rescueProperty);
        }, 1000);
        setDeleteUserInfo(data);
        setShowDeleteSelectUserModal(true);
    }

    const handleConfirmDeleteSelectUser = async () => {
        try {
            const res = await saveRescueUserAPI(Number(rescue_id), deletUserInfo.row_id);
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


    useEffect(() => {

        // "setDefaultCustomDate" is generally used to assign values after http requests 
        // (usually used for real business APIs needs)
        setStartTime(defaultVal);
        setDefaultCustomDate(defaultVal);
    }, []);


    return (
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
                    <List maxHeight={300} showOptIcons={false} onItemClick={(node) => handleRescueItemClick(node)} activeId={activeId} maxWidth={300} data={rescueList}></List>
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
                            <Date
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
                                <Date
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
                                <Date
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
                    <Modal width="600px" title="提示" content={<div>确定删除该抢救记录(ID：{rescue_id})？</div>} type="tip" show={showDeleteRescueModal} onConfirm={handleConfirmDeleteRescue} onCancel={handleCloseDeleteRescueModal} onClose={handleCloseDeleteRescueModal}></Modal>
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
                    <AdouMultipleSelect disabled={Number(resuceId) <= 0} onMultipleSelectChangeOK={(value: any) => handleUserSelect(value)} showSelected={false} onChangeOK={(value) => handleRetrieveInputChange(value)} options={userList}></AdouMultipleSelect>
                </div>
            </div>
        </div>
    )
}

export default withTranslation()(Rescue);