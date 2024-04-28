import React from "react";


// bootstrap components
import { Tabs, TabList, TabPanel } from 'funda-ui/Tabs';

// component styles
import 'funda-ui/Table/index.css';

//
import {
    getValueNote,
    optionsMergeStr
} from '../../utils/control/tools';


const ModalOptions = (props: any) => {

    const {
        appearanceConfig,
        sectionRealId,
        visitId,
        elemId,
        elemName,
        optionsGroupList,
        optionsList,
        data,
        handleSelectMultipleChecked,
        handleSelectAll,
        handleAddOptionsResHasBreak,
        handleAddOptionsResHasNum,
        handleAddOptionsResHasSplit,
        handleAddOptionsResConfirm,
        handleSelectSingleChecked,
        optionsListCloseFunc,
        addOptionsResHasBreakBtnChecked,
        addOptionsResHasNumBtnChecked,
        addOptionsResHasSplitBtnChecked,
        selectMultipleSplitBtnRef,
        dyRow
    } = props;


    

    return (
        <>

            <div className="list-group app-builder-optionslist">

                {/*================= MULTIPLE OPTIONS (HAS GROUP) =================*/}
                {data && data.multiSelect && optionsGroupList.length > 0 ? <>
                    <Tabs
                        animTransitionDuration={150}
                        navClassName="nav nav-tabs position-sticky top-0 pt-2 px-3 z-2 bg-body"
                        wrapperClassName="mb-3 position-relative h-100"
                        panelClassName="tab-content	h-100 position-relative z-1"
                    >

                        {optionsGroupList.map((groupItem: any, groupIndex: number) => {
                            return <TabList key={`tab-list-${groupIndex}`} defaultActive={groupIndex === 0 ? true : false}><button className={`nav-link ${groupItem.disabled ? 'disabled d-none' : ''} ${groupIndex === 0 ? 'active nav-link' : ''}`} type="button" role="tab">{groupItem.group_name}</button></TabList>
                        })}

                        {optionsGroupList.map((groupItem: any, groupIndex: number) => {

                            return <TabPanel key={`tab-panel-${groupIndex}`} tabpanelClass="fs-6" defaultActive={groupIndex === 0 ? true : false}><div>

                                {optionsList.map((item: any, i: number) => {

                                    if (typeof item.optgroup !== 'undefined' && item.value == groupItem.group_id) {
                                        return <div className="app-builder-option-group__wrapper" key={'optgroup-' + i}>
                                            {item.optgroup.map((opt: any, optIndex: number) => {

                                                return <div key={'option-' + optIndex} className="ps">
                                                    <a
                                                        tabIndex={-1}
                                                        key={'option-' + i}
                                                        data-elem-id={opt.elem_id}
                                                        data-group={opt.group}
                                                        data-option-code={opt.option_code}
                                                        data-option-text={opt.option_text}
                                                        data-option-score={typeof opt.option_score !== 'undefined' ? opt.option_score : 0}
                                                        href="#"
                                                        className={`list-group-item d-flex justify-content-between align-items-start list-group-item-action border-0 ${item.checked ? 'selected' : ''} ${optIndex === item.optgroup.length - 1 ? 'rounded-bottom' : ''}`}
                                                        style={{ borderRadius: 0, border: 'none', borderBottom: i < optionsList.length - 1 ? '1px dotted rgba(0,0,0,.1)' : 'none' }}
                                                        onClick={handleSelectMultipleChecked}
                                                    >
                                                        <div className="ms-2 me-auto">

                                                            {opt.checked ? <>
                                                                <small>
                                                                    <svg className="app-builder-optionslist__check" width="1.2em" height="1.2em" fill="#333" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg> {opt.option_text}{typeof opt.option_score !== 'undefined' && opt.option_score != 0 && opt.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{opt.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                                                </small>

                                                            </> : <>
                                                                <small>
                                                                    <svg className="app-builder-optionslist__uncheck" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
                                                                        <path d="M4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002Z" stroke="#ddd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                    </svg> {opt.option_text}{typeof opt.option_score !== 'undefined' && opt.option_score != 0 && opt.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{opt.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                                                </small>

                                                            </>}



                                                        </div>
                                                    </a>
                                                </div>;

                                            })}

                                        </div>;


                                    }


                                })}

                            </div></TabPanel>;
                        })}



                    </Tabs>





                    {/* TOOLBOX */}
                    <div className="border-top position-sticky bottom-0 px-3 z-2 bg-body pb-2">

                        <div className="text-start pt-2">

                            <div className="row g-3 align-items-center">
                                <div className="col-auto text-start">
                                    <button tabIndex={-1} type="button" className="btn btn-secondary my-1 btn-sm" onClick={handleSelectAll}>全选</button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ms-2 ${addOptionsResHasBreakBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasBreak}><small>附带换行</small></button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ${addOptionsResHasNumBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasNum}><small>附带序号</small></button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ${addOptionsResHasSplitBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasSplit}><small>分隔符</small></button>
                                </div>
                                <div className="col-auto">
                                    <input ref={selectMultipleSplitBtnRef} type="text" placeholder="输入分割符" className={`form-control form-control-sm  ${addOptionsResHasSplitBtnChecked ? '' : 'd-none'}`} style={{ width: '100px' }} />
                                </div>
                                <div className="col text-end">
                                    <button tabIndex={-1} type="button" className="btn btn-outline-secondary btn-sm text-decoration-none" onClick={(e: React.MouseEvent) => {
                                        optionsListCloseFunc?.();
                                    }}>{appearanceConfig ? appearanceConfig.btns.modalCancelLabel : '取消'}</button>
                                    <button tabIndex={-1} type="button" className="btn btn-primary btn-sm text-decoration-none ms-2" onClick={handleAddOptionsResConfirm}>{appearanceConfig ? appearanceConfig.btns.modalConfirmLabel : '确定'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /TOOLBOX */}


                </> : null}
                {/*================= /MULTIPLE OPTIONS (HAS GROUP) =================*/}


                {/*================= SINGLE OPTIONS (HAS GROUP) =================*/}
                {data && !data.multiSelect && optionsGroupList.length > 0 ? <>
                    <Tabs
                        animTransitionDuration={150}
                        navClassName="nav nav-tabs position-sticky top-0 pt-2 px-3 z-2 bg-body"
                        wrapperClassName="mb-3 position-relative h-100"
                        panelClassName="tab-content	h-100 position-relative z-1"
                    >

                        {optionsGroupList.map((groupItem: any, groupIndex: number) => {
                            return <TabList key={`tab-list-${groupIndex}`} defaultActive={groupIndex === 0 ? true : false}><button className={`nav-link ${groupItem.disabled ? 'disabled d-none' : ''} ${groupIndex === 0 ? 'active nav-link' : ''}`} type="button" role="tab">{groupItem.group_name}</button></TabList>
                        })}

                        {optionsGroupList.map((groupItem: any, groupIndex: number) => {

                            return <TabPanel key={`tab-panel-${groupIndex}`} tabpanelClass="fs-6" defaultActive={groupIndex === 0 ? true : false}><div>

                                {optionsList.map((item: any, i: number) => {

                                    if (typeof item.optgroup !== 'undefined' && item.value == groupItem.group_id) {
                                        return <div className="app-builder-option-group__wrapper" key={'optgroup-' + i}>
                                            {item.optgroup.map((opt: any, optIndex: number) => {

                                                return <div key={'option-' + optIndex} className="ps">
                                                    <a
                                                        tabIndex={-1}
                                                        data-elem-id={opt.elem_id}
                                                        data-group={opt.group}
                                                        data-option-code={opt.option_code}
                                                        data-option-text={opt.option_text}
                                                        data-option-score={typeof opt.option_score !== 'undefined' ? opt.option_score : 0}
                                                        href="#"
                                                        className={`list-group-item d-flex justify-content-between align-items-start list-group-item-action border-0 ${optIndex === item.optgroup.length - 1 ? 'rounded-bottom' : ''}`}
                                                        style={{ border: 'none', borderBottom: i < optionsList.length - 1 ? '1px dotted rgba(0,0,0,.1)' : 'none' }}
                                                        onClick={handleSelectSingleChecked}
                                                    >
                                                        <div className="ms-2 me-auto">
                                                            <small>
                                                                <svg className="app-builder-optionslist_item" fill="#ddd" width="1em" height="1em" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg> {opt.option_text}{typeof opt.option_score !== 'undefined' && opt.option_score != 0 && opt.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{opt.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                                            </small>
                                                        </div>
                                                    </a>
                                                </div>;

                                            })}

                                        </div>;


                                    }


                                })}

                            </div></TabPanel>;
                        })}



                    </Tabs>


                </> : null}
                {/*================= /SINGLE OPTIONS (HAS GROUP) =================*/}



                {/*================= MULTIPLE OPTIONS =================*/}
                {data && data.multiSelect && optionsGroupList.length === 0 ? <>

                    {optionsList.map((item: any, i: number) => {

                        return <a
                            tabIndex={-1}
                            key={'option-' + i}
                            data-elem-id={item.elem_id}
                            data-group={item.group}
                            data-option-code={item.option_code}
                            data-option-text={item.option_text}
                            data-option-score={typeof item.option_score !== 'undefined' ? item.option_score : 0}
                            href="#"
                            className={`list-group-item d-flex justify-content-between align-items-start list-group-item-action border-0 ${item.checked ? 'selected' : ''}`}
                            style={{ borderRadius: 0, border: 'none', borderBottom: i < optionsList.length - 1 ? '1px dotted rgba(0,0,0,.1)' : 'none' }}
                            onClick={handleSelectMultipleChecked}
                        >
                            <div className="ms-2 me-auto">

                                {item.checked ? <>
                                    <small>
                                        <svg className="app-builder-optionslist__check" width="1.2em" height="1.2em" fill="#333" viewBox="0 0 24 24"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg> {item.option_text}{typeof item.option_score !== 'undefined' && item.option_score != 0 && item.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{item.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                    </small>

                                </> : <>
                                    <small>
                                        <svg className="app-builder-optionslist__uncheck" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none">
                                            <path d="M4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002Z" stroke="#ddd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg> {item.option_text}{typeof item.option_score !== 'undefined' && item.option_score != 0 && item.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{item.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                    </small>

                                </>}



                            </div>
                        </a>;
                    })}

                    {/* TOOLBOX */}
                    <div className="border-top position-sticky bottom-0 px-3 z-2 bg-body pb-2">

                        <div className="text-start pt-2">

                            <div className="row g-3 align-items-center">
                                <div className="col-auto text-start">
                                    <button tabIndex={-1} type="button" className="btn btn-secondary my-1 btn-sm" onClick={handleSelectAll}>全选</button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ms-2 ${addOptionsResHasBreakBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasBreak}><small>附带换行</small></button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ${addOptionsResHasNumBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasNum}><small>附带序号</small></button>
                                    <button tabIndex={-1} type="button" className={`btn mx-1 my-1 btn-sm ${addOptionsResHasSplitBtnChecked ? 'btn-success' : 'btn-outline-secondary'}`} onClick={handleAddOptionsResHasSplit}><small>分隔符</small></button>
                                </div>
                                <div className="col-auto">
                                    <input ref={selectMultipleSplitBtnRef} type="text" placeholder="输入分割符" className={`form-control form-control-sm  ${addOptionsResHasSplitBtnChecked ? '' : 'd-none'}`} style={{ width: '100px' }} />
                                </div>
                                <div className="col text-end">
                                    <button tabIndex={-1} type="button" className="btn btn-outline-secondary btn-sm text-decoration-none" onClick={(e: React.MouseEvent) => {
                                        optionsListCloseFunc?.();
                                    }}>{appearanceConfig ? appearanceConfig.btns.modalCancelLabel : '取消'}</button>
                                    <button tabIndex={-1} type="button" className="btn btn-primary btn-sm text-decoration-none ms-2" onClick={handleAddOptionsResConfirm}>{appearanceConfig ? appearanceConfig.btns.modalConfirmLabel : '确定'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /TOOLBOX */}


                </> : null}
                {/*================= /MULTIPLE OPTIONS =================*/}


                {/*================= SINGLE OPTIONS =================*/}
                {data && !data.multiSelect && optionsGroupList.length === 0 ? <>

                    <div className="pb-2">
                        {optionsList.map((item: any, i: number) => {

                            return <a
                                tabIndex={-1}
                                key={'option-' + i}
                                data-elem-id={item.elem_id}
                                data-group={item.group}
                                data-option-code={item.option_code}
                                data-option-text={item.option_text}
                                data-option-score={typeof item.option_score !== 'undefined' ? item.option_score : 0}
                                href="#"
                                className={`list-group-item d-flex justify-content-between align-items-start list-group-item-action border-0`}
                                style={{ border: 'none', borderBottom: i < optionsList.length - 1 ? '1px dotted rgba(0,0,0,.1)' : 'none' }}
                                onClick={handleSelectSingleChecked}
                            >
                                <div className="ms-2 me-auto">
                                    <small>
                                        <svg className="app-builder-optionslist_item" fill="#ddd" width="1em" height="1em" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg> {item.option_text}{typeof item.option_score !== 'undefined' && item.option_score != 0 && item.option_score != null ? <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}{appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}{item.option_score}{appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small> : null}
                                    </small>
                                </div>
                            </a>;
                        })}
                    </div>



                </> : null}
                {/*================= /SINGLE OPTIONS =================*/}


            </div>


        </>
    );

}


export default ModalOptions;

