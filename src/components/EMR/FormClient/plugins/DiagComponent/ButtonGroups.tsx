import React, { ChangeEventHandler, MouseEventHandler, useEffect, useRef } from 'react';

interface ButtonGroupsProps {
    readonly: boolean
    item: any,
    diag: any,
    setDiag: React.Dispatch<any>,
    onVerifyClick: Function,
    onVerifyConfirmClick: Function,
    onSureClick: Function,
    onSureConfirmClick: Function,
    onMoveUpClick: Function,
    onMoveDownClick: Function,
    onInsertClick: Function,
    onLevel1EditClick: Function,
    onLevel2EditClick: Function,
    onDelectClick: Function
}

function ButtonGroups({
    readonly,
    item,
    onVerifyClick,
    onSureClick,
    onMoveDownClick,
    onMoveUpClick,
    onInsertClick,
    onLevel1EditClick,
    onLevel2EditClick,
    onDelectClick
}: ButtonGroupsProps) {

    return (
        <div className='diag_edit d-flex gap-2 align-items-center'>
            {
                !readonly ? <>
                    <div
                        onClick={(e) => {
                            onVerifyClick();
                        }}
                        className='btn btn-sm btn-success position-relative'
                    >
                        审核

                    </div>
                    {
                        item.diag_status == 'DOUBT' ? <div
                            onClick={(e) => {
                                onSureClick();
                            }}
                            className='btn btn-sm btn-primary'
                        >
                            确诊
                        </div> : null
                    }
                    {
                        item.diag_level == 1 ? <>
                            <i
                                onClick={() => {
                                    onMoveUpClick();
                                }}
                                title='上移' className="diag_edit-icon fa-solid fa-arrow-up text-success"
                            ></i>
                            <i
                                onClick={() => {
                                    onMoveDownClick();
                                }}
                                title='下移' className="diag_edit-icon fa-solid fa-arrow-down text-success"
                            ></i>
                            <i
                                onClick={() => {
                                    onInsertClick();
                                }}
                                title='在前一位插入新数据' className="diag_edit-icon fa-solid fa-circle-plus text-primary"
                            ></i>
                            <i
                                title='修改'
                                onClick={() => {
                                    onLevel1EditClick();
                                }}
                                className="diag_edit-icon fa-solid fa-pen text-warning"
                            ></i>

                        </> : null
                    }
                    {
                        item.diag_level == 2 ? <i
                            title='修改'
                            onClick={() => {
                                onLevel2EditClick();
                            }}
                            className="diag_edit-icon fa-solid fa-pen text-warning"
                        ></i> : null
                    }
                    <i
                        title='删除'
                        onClick={() => {
                            onDelectClick();
                        }}
                        className="diag_edit-icon fa-solid fa-trash-can text-danger"
                    ></i>

                </> : null
            }
        </div>
    )
}

export default ButtonGroups