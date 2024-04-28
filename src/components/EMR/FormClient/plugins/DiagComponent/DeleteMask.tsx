import { forwardRef, useEffect } from 'react'

const DeleteMask = forwardRef(function DeleteMask(props: any, ref: any) {

    const { selectName, onConfirmClickFn } = props

    useEffect(() => {

    }, [selectName])

    const handleDisappearClick: React.MouseEventHandler<HTMLButtonElement> = () => {
        ref.current.classList.remove('show');
        setTimeout(() => {
            ref.current.style.display = 'none';
        }, 100)
    }

    return (
        <div ref={ref} className="modal fade bg-black bg-opacity-25 toast" id="exampleModalLive" tabIndex={-1} aria-labelledby="exampleModalLiveLabel" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content top-50 start-50 translate-middle">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLiveLabel">温馨提示</h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={handleDisappearClick}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <div>
                            是否删除&nbsp;
                            <span style={{ color: 'red' }}>{selectName}</span>
                            &nbsp;项目
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleDisappearClick}
                        >
                            取消
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => {
                                ref.current.style.display = 'none'
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
)


export default DeleteMask