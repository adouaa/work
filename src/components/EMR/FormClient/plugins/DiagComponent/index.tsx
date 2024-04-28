import React, { useEffect, useState, useRef } from 'react'
import './DiagComponent.scss';
import io from './utils/custom/io';
import { fetchPost } from '../../config/request'
import Modal from './Modal';
import AddModal from './AddModal';
import DeleteMask from './DeleteMask';
import SubModal from './SubModal';
import ChangeDetails from './changedetails';
import ButtonGroups from './ButtonGroups';
import CheckTimeModal from './CheckTimeModal';
import SureTimeModal from './SureTimeModal';


interface DiagProps {
    visitId?: number,
    customProps: string
}

function DiagComponent({
    visitId,
    customProps

}: DiagProps) {

    const {
        diagType,
        diagTypeText,
        readonly,
    } = JSON.parse(customProps);

    // console.log(JSON.parse(customProps))

    const [diagList, setDiagList] = useState<any[]>([]);
    const [mainItemList, setMainItemList] = useState<any[]>([]);
    const [subItemList, setSubItemList] = useState<any[]>([]);
    const [subDiagList, setSubDiagList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isShowModel, setIsShowModel] = useState<boolean>(false);
    const [isShowSubModel, setIsShowSubModel] = useState<boolean>(false);
    const [isShowAddModel, setIsShowAddModel] = useState<boolean>(false);
    const [isShowTooltips, setIsShowTooltips] = useState<boolean>(false);
    const [subList, setSubList] = useState<{
        item_id: number,
        diag_name: string,
        diag_code: string,
        diag_status: 'CONFIRM'
    }[]>([]);
    const [modalType, setModalType] = useState<'insert' | 'add'>();
    const [diagId, setDiagId] = useState<number>(0);
    const [diag, setDiag] = useState<any>({});
    const [selectedDiag, setSelectedDiag] = useState<string>('');

    const deleteModal = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const checkTooltipsRef = useRef<HTMLDivElement>(null);
    const confirmTooltipsRef = useRef<HTMLDivElement>(null);

    const buildTree = (data: any[]) => {
        let temp: any[] = [];
        let tree: { [key: string]: any } = {};

        data.forEach((item: any) => {
            if (item.diag_level == 1) {
                temp.push(item)
            }
        });
        console.log(data);
        for (let i = data.length - 1; i > 0; i--) {
            if (data[i].diag_level == 2) {
                // temp[data[i].serial_no.slice(0, 2)]
                temp.splice(temp.findIndex((item: any) => item.serial_no == data[i].serial_no.slice(0, 2)) + 1, 0, data[i])
            }
        }

        return temp;
    }

    //获取诊断列表
    const getDiagList = (refresh: boolean) => {

        fetchPost('diag/GetDiagList', {
            visit_id: visitId,
            diag_type: diagType
        }).then((res: any) => {
            console.log(res)
            setIsLoading(false);
            if (refresh) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '已刷新',
                })
            }
            if (res.diag_list && res.diag_list.length > 0) {
                const tmp = buildTree(res.diag_list);
                console.log(tmp)
                setDiagList(tmp);
            } else {
                setDiagList([]);
            }
        })
    }

    //上移
    const moveUp = (diagId: number) => {

        fetchPost('diag/MoveDiagUp', {
            diag_id: diagId
        }).then((res: any) => {
            console.log(res)
            if (res.code == 0) {
                setIsLoading(true);
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //下移
    const moveDown = (diagId: number) => {


        fetchPost('diag/MoveDiagDown', {
            diag_id: diagId
        }).then((res: any) => {
            console.log(res)
            if (res.code == 0) {
                setIsLoading(true);
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })

    }

    //删除诊断
    const deleteDiag = () => {

        fetchPost('diag/DeleteDiag', {
            diag_id: diagId
        }).then((res: any) => {
            console.log(res)
            if (res.code == 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '删除成功'
                })
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //搜索主诊断字典
    const retrieveMainItemList = (input: string) => {

        fetchPost('diag/RetrieveItemList', {
            org_id: 0,
            retrieve_input: input
        }).then((res: any) => {
            console.log(res);
            setMainItemList(res.row_list);
        })

    }

    //搜索子诊断字典
    const retrieveSubItemList = (input: string) => {

        fetchPost('diag/RetrieveItemList', {
            org_id: 0,
            retrieve_input: input
        }).then((res: any) => {
            console.log(res);
            setSubItemList(res.row_list);
        })

    }

    //插入诊断
    const insertDiag = () => {
        fetchPost('diag/InsertDiag', {
            diag_id: diagId,
            diag_data: diag,
            sub_list: subList
        }).then((res: any) => {
            console.log(res);
            if (res.code == 0) {
                setIsShowAddModel(false);
                setIsLoading(true);
                getDiagList(false);
            }
        })
    }

    //新增诊断
    const addDiag = () => {
        fetchPost('diag/AddDiag', {
            visit_id: visitId,
            diag_type: diagType,
            diag_data: diag,
            sub_list: subList
        }).then((res: any) => {
            console.log(res);
            if (res.code == 0) {
                setIsShowAddModel(false);
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '添加成功'
                })
                setIsLoading(true);
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //插入确认按钮
    const onInsertConfirmClickFn = () => {
        console.log(diag, subList);
        insertDiag();
    }

    //新增确认按钮
    const onAddConfirmClickFn = () => {
        console.log(diag, subList);

        addDiag()
    }

    //修改确认按钮
    const onSaveConfirmClickFn = () => {
        console.log(diag, subList);

        saveDiag()
    }

    const onSaveOneSubConfirmClickFn = () => {
        console.log(diag);

        saveOneSubDiag()
    }

    //修改主诊断
    const saveDiag = () => {

        fetchPost('diag/SaveDiag', {
            diag_id: diagId,
            diag_property: diag,
            sub_list: subList
        }).then((res: any) => {
            console.log(res);
            if (res.code == 0) {
                setIsShowModel(false);
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '修改成功'
                })
                setIsLoading(true);
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //修改子诊断
    const saveOneSubDiag = () => {

        fetchPost('diag/SaveDiag', {
            diag_id: diagId,
            diag_property: diag,
        }).then((res: any) => {
            console.log(res);
            if (res.code == 0) {
                setIsShowSubModel(false);
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '修改成功'
                })
                // setIsLoading(true);
                getDiagList(false);
            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //获取子诊断
    const getSubDiagList = (diagId: number) => {

        fetchPost('diag/GetSubDiagList', {
            diag_id: diagId,
        }).then((res: any) => {
            console.log(res);

            const tmp: any[] = [];
            if (res.code === 0) {
                res.diag_list.forEach((item: any) => {
                    tmp.push({
                        item_id: item.diag_id,
                        diag_name: item.diag_name,
                        diag_code: item.diag_code,
                    })
                })
            }
            setSubList(tmp);

        })
    }

    //审核诊断
    const checkDiag = (diagId: number, checkTime: string) => {

        fetchPost('diag/CheckDiag', {
            diag_id: Number(diagId),
            check_time: checkTime
        }).then((res: any) => {
            if (res.code == 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '审核成功'
                })
                setIsLoading(true);
                getDiagList(false);
                if (checkTooltipsRef.current) checkTooltipsRef.current.classList.remove('show');
                setTimeout(() => {
                    if (checkTooltipsRef.current) checkTooltipsRef.current.style.display = 'none';
                }, 100)

            } else {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: res.message,
                    theme: 'danger'
                })
            }
        })
    }

    //确诊诊断
    const confirmDiag = (diagId: number, confirmTime: string) => {

        fetchPost('diag/ConfirmDiag', {
            diag_id: Number(diagId),
            confirm_time: confirmTime
        }).then((res: any) => {
            if (res.code == 0) {
                io('BRIDGE_ALERT', {
                    process: 0,
                    info: '已确诊'
                })
                setIsLoading(true);
                getDiagList(false);
                if (confirmTooltipsRef.current) confirmTooltipsRef.current.classList.remove('show');
                setTimeout(() => {
                    if (confirmTooltipsRef.current) confirmTooltipsRef.current.style.display = 'none';
                }, 100)
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
        getDiagList(false);
    }, [])

    return (
        <div
            ref={cardRef}
            className="card h-100">
            <div className="card-body">
                <div className='diag_main'>
                    <div className="diag_header d-flex align-items-center justify-content-between border-bottom pb-1">
                        <span className='diag_type text-nowrap fs-5'>
                            {diagTypeText || '类型'}
                        </span>
                        <div className='d-flex gap-2'>
                            <button
                                onClick={() => {
                                    getDiagList(true);
                                }}
                                title='刷新'
                                type='button'
                                className='btn btn-sm btn-light'
                            >
                                <i className="diag-refresh-icon fa-solid fa-arrows-rotate"></i>
                            </button>
                            {
                                readonly ? null : <div>
                                    <button
                                        title='新增'
                                        onClick={() => {
                                            setModalType('add');
                                            setIsShowAddModel(true);
                                            setDiag({});
                                            setSubList([]);
                                            setMainItemList([]);
                                            setSubItemList([]);
                                        }}
                                        className='btn btn-sm btn-primary'
                                        type="button"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            }
                        </div>

                    </div>
                    <div
                        ref={listRef}
                        className='diag_list mt-1 text-nowrap'>
                        {
                            isLoading ? <div className="text-center mt-3">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : <div className="list-group">
                                {
                                    diagList.length > 0 ? diagList?.map((item: any, index: number) => {
                                        return <button
                                            key={item.diag_id}
                                            onMouseEnter={(e) => {
                                                const editBox = e.currentTarget.querySelector('.diag_edit') as HTMLElement;
                                                editBox.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                const editBox = e.currentTarget.querySelector('.diag_edit') as HTMLElement;
                                                if (!editBox.classList.contains('is-focus')) {
                                                    editBox.style.opacity = '0';
                                                }
                                            }}
                                            type="button"
                                            className={`list-group-item list-group-item-action text-start rounded mb-1 border d-flex align-items-center justify-content-between 
                                            ${item.diag_level == 1 ? 'bg-body-secondary' : 'diag_child'}
                                            `}
                                        >
                                            <div className='d-flex align-items-center gap-2'>
                                                <span>
                                                    {item.diag_level == 1 ? item.serial_no : <i className="fa-solid fa-diamond fa-2xs text-primary"></i>}
                                                </span>
                                                <span>
                                                    {item.diag_name}
                                                    {item.diag_status == 'DOUBT' ? <span className="badge text-bg-warning ms-2">疑似</span> : null}
                                                    {item.check_time ? <span className="badge text-bg-success ms-2">已审核</span> : null}
                                                </span>
                                            </div>
                                            <ButtonGroups
                                                readonly={readonly || false}
                                                item={item}
                                                diag={diag}
                                                setDiag={setDiag}
                                                onVerifyClick={() => {
                                                    setDiag(() => item);
                                                    if (checkTooltipsRef.current) checkTooltipsRef.current.style.display = 'block';
                                                    setTimeout(() => {
                                                        if (checkTooltipsRef.current) checkTooltipsRef.current.classList.add('show');
                                                    }, 100)
                                                }}
                                                onVerifyConfirmClick={() => {
                                                    console.log(diag)
                                                    if (diag.check_time) {
                                                        const time = `${diag.check_time.split('T')[0]} ${diag.check_time.split('T')[1]}:00`
                                                        checkDiag(diag.diag_id, time);
                                                    } else {
                                                        io('BRIDGE_ALERT', {
                                                            process: 0,
                                                            info: '时间不能为空',
                                                            theme: 'warning'
                                                        })
                                                    }
                                                }}
                                                onSureClick={() => {
                                                    setDiag(item);
                                                    if (confirmTooltipsRef.current) confirmTooltipsRef.current.style.display = 'block';
                                                    setTimeout(() => {
                                                        if (confirmTooltipsRef.current) confirmTooltipsRef.current.classList.add('show');
                                                    }, 100)
                                                }}
                                                onSureConfirmClick={() => {
                                                    console.log(diag)
                                                    if (diag.confirm_time) {
                                                        const time = `${diag.confirm_time.split('T')[0]} ${diag.confirm_time.split('T')[1]}:00`
                                                        confirmDiag(diag.diag_id, time);
                                                    } else {
                                                        io('BRIDGE_ALERT', {
                                                            process: 0,
                                                            info: '时间不能为空',
                                                            theme: 'warning'
                                                        })
                                                    }
                                                }}
                                                onMoveUpClick={() => {
                                                    moveUp(item.diag_id);
                                                }}
                                                onMoveDownClick={() => {
                                                    moveDown(item.diag_id);
                                                }}
                                                onInsertClick={() => {
                                                    setModalType('insert');
                                                    setDiagId(item.diag_id);
                                                    setIsShowAddModel(true);
                                                    setDiag({});
                                                    setSubList([]);
                                                    setMainItemList([]);
                                                    setSubItemList([]);
                                                }}
                                                onDelectClick={() => {
                                                    setDiagId(item.diag_id);
                                                    setSelectedDiag(item.diag_name);
                                                    deleteModal.current!.style.display = 'block';
                                                    setTimeout(() => {
                                                        deleteModal.current!.classList.add('show');
                                                    })
                                                }}
                                                onLevel1EditClick={() => {
                                                    setDiag(item);
                                                    setDiagId(item.diag_id);
                                                    setIsShowModel(true);
                                                    getSubDiagList(item.diag_id);
                                                    setMainItemList([]);
                                                    setSubItemList([]);
                                                }}
                                                onLevel2EditClick={() => {
                                                    setDiag(item);
                                                    setDiagId(item.diag_id);
                                                    setIsShowSubModel(true);
                                                }}
                                            />
                                        </button>
                                    }) : <div className='mt-3'><i className="fa-solid fa-circle-exclamation text-warning"></i>{" "}暂无数据</div>
                                }
                            </div>
                        }
                    </div>
                    {/* 审核窗口 */}
                    <CheckTimeModal
                        diag={diag}
                        setDiag={setDiag}
                        onConfirmClick={() => {
                            console.log(diag)
                            if (diag.check_time) {
                                const time = `${diag.check_time.split('T')[0]} ${diag.check_time.split('T')[1]}:00`
                                checkDiag(diag.diag_id, time);
                            } else {
                                io('BRIDGE_ALERT', {
                                    process: 0,
                                    info: '时间不能为空',
                                    theme: 'warning'
                                })
                            }
                        }}
                        ref={checkTooltipsRef}
                    />
                    {/* 确认窗口  */}
                    <SureTimeModal
                        diag={diag}
                        setDiag={setDiag}
                        onConfirmClick={() => {
                            console.log(diag)
                            if (diag.confirm_time) {
                                const time = `${diag.confirm_time.split('T')[0]} ${diag.confirm_time.split('T')[1]}:00`
                                confirmDiag(diag.diag_id, time);
                            } else {
                                io('BRIDGE_ALERT', {
                                    process: 0,
                                    info: '时间不能为空',
                                    theme: 'warning'
                                })
                            }
                        }}
                        ref={confirmTooltipsRef}
                    />
                    {
                        isShowAddModel ? <AddModal
                            modalType={modalType}
                            setIsShowAddModel={setIsShowAddModel}
                            mianItemList={mainItemList}
                            subItemList={subItemList}
                            setSubList={setSubList}
                            subList={subList}
                            onConfirmClickFn={modalType === 'add' ? onAddConfirmClickFn : onInsertConfirmClickFn}
                            setDiag={setDiag}
                            diag={diag}
                            retrieveMainItemList={retrieveMainItemList}
                            retrieveSubItemList={retrieveSubItemList}
                        /> : null
                    }
                    {
                        isShowModel ? <Modal
                            setIsShowModel={setIsShowModel}
                            // mianItemList={mainItemList}
                            subItemList={subItemList}
                            subDiagList={subDiagList}
                            setSubList={setSubList}
                            subList={subList}
                            onConfirmClickFn={onSaveConfirmClickFn}
                            setDiag={setDiag}
                            diag={diag}
                            // retrieveMainItemList={retrieveMainItemList}
                            retrieveSubItemList={retrieveSubItemList}
                        /> : null
                    }
                    {
                        isShowSubModel ? <SubModal
                            setIsShowSubModel={setIsShowSubModel}
                            setDiag={setDiag}
                            diag={diag}
                            onConfirmClickFn={onSaveOneSubConfirmClickFn}
                        /> : null
                    }
                    <DeleteMask
                        ref={deleteModal}
                        selectName={selectedDiag}
                        onConfirmClickFn={deleteDiag}
                    />
                </div>
            </div>
        </div>
    )
}

export default DiagComponent