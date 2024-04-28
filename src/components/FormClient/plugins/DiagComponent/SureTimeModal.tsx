import React, { forwardRef } from 'react'
import ChangeDetails from './changedetails';

const SureTimeModal = forwardRef(function SureTimeModal(props: any, ref: any) {
    const { onConfirmClick, diag, setDiag } = props;

    function handleDisappearClick() {
        ref.current.classList.remove('show');
        setTimeout(() => {
            ref.current.style.display = 'none';
        }, 100)
    }

    return (
        <div ref={ref}
            className="modal fade bg-black bg-opacity-25 toast" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content top-50 start-50 translate-middle">
                    <div className="modal-header justify-content-end">
                        <div
                            onClick={handleDisappearClick}
                            className='diag_check-detail-close'>
                            <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                                <g id="SVGRepo_iconCarrier">
                                    <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
                                        stroke="#1C274C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round" />
                                    <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                                        stroke="#1C274C"
                                        strokeWidth="1.5"
                                        strokeLinecap="round" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body">
                        <ChangeDetails
                            title='确诊时间：'
                            inputName='confirm_time'
                            content={diag.confirm_time?.slice(0, 16)}
                            type='datetime-local'
                            setValue={(name: string, value: string) => {
                                console.log(name, value)
                                setDiag({
                                    ...diag,
                                    [name]: value
                                })
                            }}
                        />
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={handleDisappearClick}
                        >取消</button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                onConfirmClick();
                            }}
                        >确定</button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default SureTimeModal