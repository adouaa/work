import { forwardRef, useEffect, useState, useRef } from 'react'
import ChangeDetails from './changedetails';

function Model(props: any) {
    const {
        onConfirmClickFn,
        // mianItemList,
        subItemList,
        subList,
        setSubList,
        setIsShowModel,
        setDiag,
        diag,
        // retrieveMainItemList,
        retrieveSubItemList,
    } = props

    const modalRef = useRef<HTMLDivElement>(null);
    const itemListRef = useRef<HTMLDivElement>(null);
    const [inputMainValue, setInputMainValue] = useState<string>('');
    const [inputSubValue, setInputSubValue] = useState<string>('');

    console.log('****diag', diag);

    const handleDisappearClick = () => {
        modalRef.current!.classList.remove('show');
        setTimeout(() => {
            setIsShowModel(false);
        }, 100)
    }

    const onChangeFn = (name: string, value: string) => {
        console.log(name, value);

        if (name === 'confirm_time') {
            value = `${value.split('T')[0]} ${value.split('T')[1]}`
        }

        setDiag({
            ...diag,
            [name]: value,
        })

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
                    <div className="modal-header z-3">
                        <h1 className="modal-title fs-5">
                            修改诊断
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
                            <div className='bg-body-secondary'>主诊断修改</div>
                            <div className='d-flex flex-column px-2'>
                                <div className='d-flex gap-2 align-items-center'>
                                    <div>
                                        <span className='text-primary text-nowrap'>诊断名称：</span>
                                        <span>{diag.diag_name}</span>
                                    </div>
                                    <ChangeDetails
                                        type='text'
                                        inputName='diag_desc'
                                        title='诊断描述：'
                                        content={diag.diag_desc}
                                        setValue={onChangeFn}
                                    />
                                    <div>
                                        <span className='text-primary text-nowrap'>编码：</span>
                                        <span>{diag.diag_code}</span>
                                    </div>
                                </div>
                                {/* <ChangeDetails
                                    type='datetime-local'
                                    inputName='confirm_time'
                                    title='确诊时间：'
                                    content={diag.confirm_time}
                                    setValue={onChangeFn}
                                /> */}

                                {/* <ChangeDetails
                                    type='text'
                                    inputName='diag_tag'
                                    title='诊断标签：'
                                    content={diag.diag_tag}
                                    setValue={onChangeFn}
                                />
                                <ChangeDetails
                                    type='text'
                                    inputName='diag_note'
                                    title='诊断标签：'
                                    content={diag.diag_note}
                                    setValue={onChangeFn}
                                /> */}
                                <div className='d-flex gap-2 align-items-center'>
                                    <div className="d-flex align-items-center gap-2">
                                        <input
                                            onChange={(e) => {
                                                let value: string = '';
                                                if (e.currentTarget.checked) {
                                                    value = 'DOUBT'
                                                } else {
                                                    value = 'CONFIRM'
                                                }
                                                onChangeFn(e.currentTarget.name, value)
                                            }}
                                            className="form-check-input m-0"
                                            type="checkbox"
                                            name='diag_status'
                                            checked={diag.diag_status == 'DOUBT'}
                                            value={diag.diag_status || ''}
                                            id="diag_status"
                                        />
                                        <label className="form-check-label text-primary" htmlFor="diag_status">
                                            疑似诊断
                                        </label>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <span className='text-primary text-end text-nowrap' style={{ width: '70px' }}>
                                            入院情况：
                                        </span>
                                        <select
                                            onChange={(e) => {
                                                onChangeFn(e.currentTarget.name, e.currentTarget.value)
                                            }}
                                            name='admission_issue'
                                            value={diag.admission_issue || ''}
                                            className="form-select"
                                        >
                                            <option value="" disabled>请选择</option>
                                            <option value="无">无</option>
                                            <option value="有">有</option>
                                            <option value="临床未确定">临床未确定</option>
                                            <option value="情况不明">情况不明</option>
                                        </select>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <span className='text-primary text-end text-nowrap' style={{ width: '70px' }}>
                                            是否治疗：
                                        </span>
                                        <select
                                            onChange={(e) => {
                                                onChangeFn(e.currentTarget.name, e.currentTarget.value)
                                            }}
                                            name='treat_issue'
                                            value={diag.treat_issue || ''}
                                            className="form-select"
                                        >
                                            <option value="" disabled>请选择</option>
                                            <option value="是">是</option>
                                            <option value="否">否</option>
                                        </select>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <span className='text-primary text-end text-nowrap' style={{ width: '70px' }}>
                                            出院转归：
                                        </span>
                                        <select
                                            onChange={(e) => {
                                                onChangeFn(e.currentTarget.name, e.currentTarget.value)
                                            }}
                                            name='discharge_issue'
                                            value={diag.discharge_issue || ''}
                                            className="form-select"
                                        >
                                            <option value="" disabled>请选择</option>
                                            <option value="治愈">治愈</option>
                                            <option value="好转">好转</option>
                                            <option value="未愈">未愈</option>
                                            <option value="死亡">死亡</option>
                                            <option value="其他">其他</option>
                                        </select>
                                    </div>
                                </div>

                                {/* <div className='d-flex align-items-center'>
                                    <span className='text-primary text-end text-nowrap' style={{ width: '100px' }}>
                                        相关医技检查：
                                    </span>
                                    <select
                                        onChange={(e) => {
                                            onChangeFn(e.currentTarget.name, e.currentTarget.value)
                                        }}
                                        name='link_name'
                                        value={diag.link_name || ''}
                                        className="form-select"
                                    >
                                        <option value="" disabled>请选择</option>
                                        <option value="病理号">病理号</option>
                                        <option value="影像号">影像号</option>
                                        <option value="超声号">超声号</option>
                                        <option value="内镜号">内镜号</option>
                                        <option value="心电号">心电号</option>
                                        <option value="脑电号">脑电号</option>
                                    </select>
                                </div> */}
                            </div>
                            <hr />
                            <div className='bg-body-secondary'>子诊断选择</div>
                            <div
                                className="d-flex py-2"
                                style={{ height: 'calc(90vh - 23rem)' }}
                            >
                                <div className='d-flex flex-column rounded border w-50'>
                                    <div className='text-start m-3 text-primary'>当前诊断：</div>
                                    <div className='diag_list-overflow py-2 px-3'>
                                        <div className='list-group '>
                                            {
                                                subList.length > 0 ? subList?.map((item: any) => {
                                                    return <button
                                                        type='button'
                                                        onClick={(e) => {
                                                            const tmp = [...subList];
                                                            const i = tmp.findIndex((t: any) => t.item_id === item.item_id);
                                                            tmp.splice(i, 1);
                                                            setSubList(tmp);
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            // e.currentTarget.classList.add('bg-body-secondary');
                                                            const badge = e.currentTarget.querySelector('.diag_current-child') as HTMLElement;
                                                            badge.style.opacity = '1';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            const badge = e.currentTarget.querySelector('.diag_current-child') as HTMLElement;
                                                            // e.currentTarget.classList.remove('bg-body-secondary');
                                                            badge.style.opacity = '0';
                                                        }}
                                                        className='diag_modal-item list-group-item list-group-item-action rounded border mb-1 position-relative text-start'
                                                        key={item.item_id}
                                                    >
                                                        {item.diag_name}
                                                        <span className="diag_current-child position-absolute top-0 start-100 translate-middle badge">
                                                            <i className="fa-solid fa-circle-xmark text-danger"></i>
                                                        </span>
                                                    </button>
                                                }) : <div>无</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="d-flex flex-column gap-2 p-2 rounded border w-50">
                                    <input
                                        value={inputSubValue}
                                        placeholder='搜索诊断字典'
                                        className='form-control'
                                        type="text"
                                        onChange={(e) => {
                                            setInputSubValue(e.currentTarget.value);
                                            retrieveSubItemList(e.currentTarget.value);
                                        }}
                                    />
                                    {/* <div className='text-start'>搜索内容：</div> */}
                                    <div className='diag_list-overflow px-3 py-2'>
                                        <div className="list-group ">
                                            {
                                                subItemList?.length > 0 ? subItemList?.map((item: any) => {
                                                    return <button
                                                        type='button'
                                                        onClick={(e) => {
                                                            const badge = e.currentTarget.querySelector('.diag_add-child');
                                                            const tmp = [...subList];
                                                            if (badge?.classList.contains('d-none')) {
                                                                badge?.classList.remove('d-none');
                                                                tmp.push({
                                                                    item_id: item.item_id,
                                                                    diag_name: item.item_name,
                                                                    diag_code: item.item_code
                                                                })
                                                                setSubList(tmp);
                                                            }
                                                        }}
                                                        className='diag_modal-item list-group-item list-group-item-action text-start mb-1 rounded border position-relative'
                                                        key={item.item_id}
                                                    >
                                                        {item.item_name}
                                                        <span className={`diag_add-child position-absolute top-0 start-100 translate-middle  badge 
                                            ${subList.some((s: any) => s.diag_name == item.item_name) ? '' : 'd-none'}`}
                                                        >
                                                            <i className="fa-solid fa-circle-check fa-lg text-success"></i>
                                                        </span>
                                                    </button>
                                                }) : <div className='p-1 text-start'>
                                                    暂无数据
                                                </div>
                                            }
                                        </div>
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
                                onConfirmClickFn();
                            }}
                        >
                            保存
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Model;