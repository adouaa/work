import React, { forwardRef, useEffect, useState, useRef } from 'react'

function Model(props: any) {
    const {
        modalType,
        onConfirmClickFn,
        mianItemList,
        subItemList,
        subList,
        setSubList,
        setIsShowAddModel,
        setDiag,
        diag,
        retrieveMainItemList,
        retrieveSubItemList,
    } = props

    const modalRef = useRef<HTMLDivElement>(null);
    const itemListRef = useRef<HTMLDivElement>(null);
    const [inputMainValue, setInputMainValue] = useState<string>('');
    const [inputSubValue, setInputSubValue] = useState<string>('');

    const handleDisappearClick = () => {
        modalRef.current!.classList.remove('show');
        setTimeout(() => {
            setIsShowAddModel(false);
        }, 100)
    }

    useEffect(() => {
        if (modalRef.current) {
            setTimeout(() => {
                modalRef.current!.classList.add('show');
            }, 100);
        }
    }, [])

    return (
        <div ref={modalRef}
            className="modal fade bg-black bg-opacity-25 toast"
            tabIndex={-1}
            role="dialog"
            style={{ display: 'block' }}
        >
            <div className="modal-dialog modal-dialog-scrollable ">
                <div className="modal-content top-50 start-50 translate-middle" style={{ width: '80vw', height: '90vh' }}>
                    <div className="modal-header mb-3 z-3">
                        <h1 className="modal-title fs-5">
                            {modalType === 'add' ? '新增' : '插入'}诊断项目
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            onClick={handleDisappearClick}>
                        </button>
                    </div>
                    <div className='modal-body'>
                        <form
                            id='my-form'
                            className="my-form"
                        >
                            <div className='bg-body-secondary'>主诊断选择（单选）</div>
                            <div className='d-flex p-2 align-items-center'>
                                <span>已选诊断：</span>
                                {
                                    diag?.diag_name ? <div className='d-flex align-items-center gap-2'>
                                        <div
                                            className='diag_modal-item rounded border p-1 '>
                                            {diag.diag_name}
                                        </div>
                                        <div className="form-check mt-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={diag.diag_status}
                                                id='疑似'
                                                onChange={(e) => {
                                                    if(e.currentTarget.checked) {
                                                        setDiag({
                                                            ...diag,
                                                            diag_status: 'DOUBT'
                                                        })
                                                    } else {
                                                        setDiag({
                                                            ...diag,
                                                            diag_status: 'CONFIRM'
                                                        })
                                                    }
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor='疑似'>
                                                疑似
                                            </label>
                                        </div>
                                    </div>
                                        : <div>无</div>
                                }
                            </div>
                            <div
                                ref={itemListRef}
                                className=" d-flex flex-column gap-2 p-2 rounded border">
                                <div className='d-flex align-items-center gap-2'>
                                    <span className='text-primary'><i className="fa-solid fa-magnifying-glass"></i></span>
                                    <input
                                        value={inputMainValue}
                                        placeholder='查找主诊断'
                                        className='form-control'
                                        type="text"
                                        onChange={(e) => {
                                            setInputMainValue(e.currentTarget.value);
                                            retrieveMainItemList(e.currentTarget.value);
                                        }}
                                    />
                                </div>
                                <div className='diag_mainList-search-box p-3 pt-2'>
                                    {
                                        mianItemList?.length > 0 ? mianItemList?.map((item: any) => {
                                            return <div
                                                onClick={(e) => {
                                                    const itemList = itemListRef.current?.children;
                                                    if (itemList) {
                                                        for (let i = 0; i < itemList.length; i++) {
                                                            itemList[i].classList.remove('bg-primary', 'text-white')
                                                        }
                                                    }
                                                    e.currentTarget.classList.remove('bg-body-secondary');
                                                    e.currentTarget.classList.add('bg-primary', 'text-white');
                                                    setDiag({
                                                        item_id: item.item_id,
                                                        diag_name: item.item_name,
                                                        diag_code: item.item_code
                                                    });
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!e.currentTarget.classList.contains('bg-primary')) {
                                                        e.currentTarget.classList.add('bg-body-secondary');
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.classList.remove('bg-body-secondary');
                                                }}
                                                className='diag_modal-item rounded border p-1 text-start mb-1'
                                                key={item.item_id}
                                            >
                                                {item.item_name}
                                            </div>
                                        }) : <div className='p-1 text-start'>
                                            暂无数据
                                        </div>
                                    }
                                </div>

                            </div>
                            <hr />
                            <div className='bg-body-secondary'>子诊断选择（多选）</div>
                            <div
                                className="d-flex gap-2 p-2 "
                            >
                                <div className='d-flex flex-column rounded p-2 border w-50'>
                                    <span className='text-start text-nowrap mb-1'>已选诊断：</span>
                                    <div>
                                        {
                                            subList.length > 0 ? subList?.map((item: any) => {
                                                return <div
                                                    className='d-flex gap-2 align-items-center'
                                                    key={item.item_id}
                                                >
                                                    <div
                                                        onClick={(e) => {
                                                            const tmp = [...subList];
                                                            const i = tmp.findIndex((t: any) => t.item_id === item.item_id);
                                                            tmp.splice(i, 1);
                                                            setSubList(tmp);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.classList.add('bg-body-secondary');
                                                            const badge = e.currentTarget.querySelector('.diag_current-child') as HTMLElement;
                                                            badge.style.opacity = '1';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            const badge = e.currentTarget.querySelector('.diag_current-child') as HTMLElement;
                                                            e.currentTarget.classList.remove('bg-body-secondary');
                                                            badge.style.opacity = '0';
                                                        }}
                                                        className='diag_modal-item rounded border p-1 position-relative text-start mb-1 flex-grow-1'

                                                    >
                                                        {item.diag_name}
                                                        <span className="diag_current-child position-absolute top-0 start-100 translate-middle badge">
                                                            <i className="fa-solid fa-circle-xmark text-danger"></i>
                                                        </span>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            value={item.diag_status}
                                                            id={item.item_id}
                                                            onChange={(e) => {
                                                                if (e.currentTarget.checked) {
                                                                    const tmp = [...subList];
                                                                    const i = tmp.findIndex((t: any) => t.item_id === item.item_id);
                                                                    tmp[i].diag_status = 'DOUBT';
                                                                    setSubList(tmp);
                                                                } else {
                                                                    const tmp = [...subList];
                                                                    const i = tmp.findIndex((t: any) => t.item_id === item.item_id);
                                                                    tmp[i].diag_status = 'CONFIRM';
                                                                    setSubList(tmp);
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={item.item_id}>
                                                            疑似
                                                        </label>
                                                    </div>
                                                </div>
                                            }) : <div className='text-start text-nowrap'>无</div>
                                        }
                                    </div>

                                </div>
                                <div
                                    className=" d-flex flex-column gap-2 p-2 rounded border w-50">
                                    <div className='d-flex align-items-center gap-2'>
                                        <span className='text-primary'><i className="fa-solid fa-magnifying-glass"></i></span>
                                        <input
                                            value={inputSubValue}
                                            placeholder='查找子诊断'
                                            className='form-control'
                                            type="text"
                                            onChange={(e) => {
                                                setInputSubValue(e.currentTarget.value);
                                                retrieveSubItemList(e.currentTarget.value);
                                            }}
                                        />
                                    </div>
                                    <div className='diag_subList-search-box p-3 pt-2'>
                                        {
                                            subItemList?.length > 0 ? subItemList?.map((item: any) => {
                                                return <div
                                                    onClick={(e) => {
                                                        const badge = e.currentTarget.querySelector('.diag_add-child');
                                                        const tmp = [...subList];
                                                        if (badge?.classList.contains('d-none')) {
                                                            badge?.classList.remove('d-none');
                                                            tmp.push({
                                                                item_id: item.item_id,
                                                                diag_name: item.item_name,
                                                                diag_code: item.item_code,
                                                                diag_status: 'CONFIRM'
                                                            })
                                                            setSubList(tmp);
                                                        }
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.classList.add('bg-body-secondary');
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.classList.remove('bg-body-secondary');
                                                    }}
                                                    className='diag_modal-item rounded border p-1 mb-1 position-relative text-start'
                                                    key={item.item_id}
                                                >
                                                    {item.item_name}
                                                    <span className={`diag_add-child position-absolute top-0 start-100 translate-middle badge 
                                            ${subList.some((s: any) => s.diag_name == item.item_name) ? '' : 'd-none'}`}>
                                                        <i className="fa-solid fa-circle-check fa-lg text-success"></i>
                                                    </span>
                                                </div>
                                            }) : <div className='p-1 text-start'>
                                                暂无数据
                                            </div>
                                        }
                                    </div>

                                </div>
                            </div>

                        </form>
                    </div>
                    <div className='modal-footer'>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={handleDisappearClick}
                        >
                            取消
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                // console.log(diag, subList);
                                onConfirmClickFn();
                            }}
                        >
                            确认
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Model;