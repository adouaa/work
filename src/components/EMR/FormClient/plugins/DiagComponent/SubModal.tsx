import { forwardRef, useEffect, useState, useRef } from 'react'
import ChangeDetails from './changedetails';

function Model(props: any) {
    const {
        onConfirmClickFn,
        setIsShowSubModel,
        setDiag,
        diag,
    } = props

    const modalRef = useRef<HTMLDivElement>(null);

    console.log('****diag', diag);

    const handleDisappearClick = () => {
        modalRef.current!.classList.remove('show');
        setTimeout(() => {
            setIsShowSubModel(false);
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
                <div className="modal-content top-50 start-50 translate-middle">
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
                            <div className='bg-body-secondary'>子诊断修改</div>
                            <div className='d-flex flex-column p-2 gap-2 '>
                                <div className='text-start'>
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
                                <ChangeDetails
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
                                />
                            </div>
                            <hr />
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