import React, { useState, useEffect, useRef, useMemo, useImperativeHandle } from "react";
import axios from "axios";

// API
import { fetchPost } from './config/request';

import apiUrls from './config/apiUrls';

// bootstrap components
import Radio from 'funda-ui/Radio';
import Input from 'funda-ui/Input';
import Textarea from 'funda-ui/Textarea';
import Checkbox from 'funda-ui/Checkbox';
import Table from 'funda-ui/Table';

// component styles
import 'funda-ui/Table/index.css';




import { getTodayDate, getSpecifiedDate } from './utils/custom/date';

// tips
import Tips from './components/Tips';
import ReportChart from './components/ReportChart';


//
import reportTypeData from "./data/report-type";

import io from './utils/custom/io';


import './index.scss';


function authHeader() {
    // return authorization header with JWT(JSON Web Token) token
    let user = JSON.parse(localStorage.getItem('SITE_DATA_AUTH') as never);

    if (user && user.token) {
        return { 'xmhis-session-id': user.token };
    } else {
        return {};
    }
}


//convert HTML text to plain text
function htmlToPlain(input: string) {
    return input.replace(/(<([^>]+)>)/ig, '');
}


// DO NOT move `useMemo` to component
function ChildCom(props: any) {
    const { callback, callback2, callback3, data, tableCheckRef } = props;
    return useMemo(() => {
        return <Table
            tableCheckRef={tableCheckRef}
            checkable={true}
            sortable
            onClick={(el: any, val: any) => {
                callback3(val.content.at(-1));
            }}
            onCheck={(val) => {

                const text = val.map((v: any) => {
                    return `${v.content[2]} ${v.content[3]} ${v.content[5]} ${v.content[4] !== '-' ? htmlToPlain(v.content[4]) : ''}，`
                });

                callback2(val);

                callback(text.join('').replace(/，\s*$/, ''));

            }}
            headClassName="table-light text-center"
            tableClassName="table table-hover table-bordered table-striped"
            data={{
                "headers": [
                    { "type": false, "style": { padding: '.5rem .1rem', width: '18px' }, "content": '' },
                    { "type": "number", "style": { minWidth: '55px' }, "content": '序号' },
                    { "type": "text", "content": '项目' },
                    { "type": "number", "content": '结果' },
                    { "type": false, "content": '提示' },
                    { "type": false, "content": '单位' },
                    { "content": '参考范围' },
                    { "content": '方法' },
                    { "style": { display: 'none' }, "content": '' }
                ],
                "fields": data.map((item: any, i: number) => {


                    let bg = item.item_value_tip === null || item.item_value_tip === '' ? 'none' : '#fdd4cf';

                    if (item.item_value_tip === '↑↑') bg = '#f00';


                    const type = item.report_type;
                    let typeName: any[] = [];
                    let valueRes: any = item.item_value === null || item.item_value === '' ? '-' : item.item_value;
                    let unitRes: any = item.item_unit === null || item.item_unit === '' ? '-' : item.item_unit;

                    if (type.indexOf('[DETAIL]') >= 0) {
                        typeName.push(<>常规</>);
                    }
                    if (type.indexOf('[BACT]') >= 0) {
                        typeName.push(<><span className="badge rounded-pill bg-info">（细菌）</span></>);
                    }
                    if (type.indexOf('[AST]') >= 0) {
                        valueRes = item.item_mic === null || item.item_mic === '' ? '-' : item.item_mic;
                        unitRes = item.item_sir === null || item.item_sir === '' ? '-' : item.item_sir;
                        typeName.push(<><span className="badge rounded-pill bg-success">（药敏）</span></>);
                    }


                    return [
                        { "cols": 1, className: bg === 'none' ? '' : 'is-unusual', "style": { padding: '.5rem .1rem' }, "content": '' },
                        { "cols": 1, "style": { minWidth: '55px', background: bg }, "content": item.serial_no },
                        { "cols": 1, "style": { minWidth: '65px', background: bg }, "content": <>{item.item_name === null || item.item_name === '' ? '-' : item.item_name}{typeName.map((v: any, i: number) => <React.Fragment key={i}>{v}</React.Fragment>)}</> },
                        { "cols": 1, "style": { minWidth: '65px', background: bg }, "content": valueRes },
                        { "cols": 1, "style": { minWidth: '65px', background: bg }, "content": item.item_value_tip === null || item.item_value_tip === '' ? '' : <><span className="text-danger">{item.item_value_tip}</span></> },
                        { "cols": 1, "style": { minWidth: '65px', background: bg }, "content": unitRes },
                        { "cols": 1, "style": { minWidth: '85px', background: bg }, "content": item.value_range === null || item.value_range === '' ? '-' : item.value_range },
                        { "cols": 1, "style": { minWidth: '85px', background: bg }, "content": item.item_method === null || item.item_method === '' ? '-' : item.item_method },
                        { "cols": 1, "style": { display: 'none' }, "content": item.item_code }
                    ];
                })
            }}
        />
    }, [data]);
}

const PageIndex = (props: any) => {

    const _dateStart = getSpecifiedDate(getTodayDate(), -180);
    const _dateEnd = getTodayDate();


    const {
        referenceDataRef,
        controlId,
        appearanceConfig,
        sectionRealId,
        elemId,
        visitId,
        dyRow,
        onConfirm,
        onConfirmTextarea1,
        onConfirmTextarea2,
        editEnterStatus,
        closeEnterEv
    } = props;


    const LABEL_WIDTH = '100px';
    const [reportType, setReportType] = useState<string>('lab');
    const [reportDate, setReportDate] = useState<any[]>([_dateStart, _dateEnd]);
    const [targetId, setTargetId] = useState<string>('');
    const [syntheticText1, setSyntheticText1] = useState<string>('');
    const [syntheticText2, setSyntheticText2] = useState<string>('');
    const [list, setList] = useState<any[]>([]);
    const [orginalDetailList, setOrginalDetailList] = useState<any[]>([]);
    const [detailList, setDetailList] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any[]>([]);
    const [syncReportBtnDisabled, setSyncReportBtnDisabled] = useState<boolean>(false);
    const [examContent, setExamContent] = useState<any>(null);


    // chart
    const [itemCode, setItemCode] = useState<string>('');

    // checkboxes
    const [chkUnusual, setChkUnusual] = useState<boolean>(false);
    const [chkBact, setChkBact] = useState<boolean>(false);
    const [chkAst, setChkAst] = useState<boolean>(false);
    
    
    // list
    const tableCheckRef = useRef<any>(null);


    // exam
    const copyDiv1Ref = useRef<HTMLInputElement>(null);
    const copyDiv2Ref = useRef<HTMLInputElement>(null);

    const orderType = useRef<boolean>(true);


    // exposes the following methods
    useImperativeHandle(
        referenceDataRef,
        () => ({
            reset: () => {
                resetReferenceDataStatus();
            }
        }),
        [referenceDataRef],
    );



    const orderData = (data: any[], field: string, desc: boolean = false) => {
        const compareByAge = (a: any, b: any) => {
            if (new Date(a[field]).getTime() < new Date(b[field]).getTime()) {
                return -1;
            }
            if (new Date(a[field]).getTime() > new Date(b[field]).getTime()) {
                return 1;
            }
            return 0;
        }

        if (desc) {
            data.sort(compareByAge).reverse();
        } else {
            data.sort(compareByAge);
        }

        return data;
    }


    const copyContent = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            io('BRIDGE_ALERT', { process: 0, info: '复制成功' });
        } catch (err) {
            io('BRIDGE_ALERT', { process: 0, info: '复制失败：' + err });
        }
    };

    const unsecuredCopyToClipboard = (text: string, ref: any) => {
        if (ref.current === null) {
            io('BRIDGE_ALERT', { process: 0, info: '复制失败：' });
            return;
        }

        ref.current.focus();
        ref.current.select();

        try {
            document.execCommand('copy');
            io('BRIDGE_ALERT', { process: 0, info: '复制成功' });
        } catch (err) {
            io('BRIDGE_ALERT', { process: 0, info: '复制失败：' + err });
        }
    };

    /**
     * Copies the text passed as param to the system clipboard
     * Check if using HTTPS and navigator.clipboard is available
     * Then uses standard clipboard API, otherwise uses fallback
    */
    const copyToClipboard = (content: string, ref: any) => {
        if (window.isSecureContext && navigator.clipboard) {
            copyContent(content);
        } else {
            unsecuredCopyToClipboard(content, ref);
        }
    };


    function handleConfirm(e: React.MouseEvent) {
        const _val = `${syntheticText1}${syntheticText2}`;
        onConfirm?.(controlId, _val, dyRow);
    }

    function handleConfirmExam1(e: React.MouseEvent) {
        if (copyDiv1Ref.current === null) return;
        copyToClipboard(copyDiv1Ref.current.value, copyDiv1Ref);

        onConfirmTextarea1?.(controlId, copyDiv1Ref.current.value, dyRow);
        
        copyDiv1Ref.current.focus();
        copyDiv1Ref.current.select();
    }

    function handleConfirmExam2(e: React.MouseEvent) {
        if (copyDiv2Ref.current === null) return;
        copyToClipboard(copyDiv2Ref.current.value, copyDiv2Ref);

        onConfirmTextarea2?.(controlId, copyDiv2Ref.current.value, dyRow);

        copyDiv2Ref.current.focus();
        copyDiv2Ref.current.select();
    }
    

    function updateList(latestDate: string[], type: string = 'lab', curVisitId: any) {
        switch (type) {
            case 'lab':

                // 报告类型：report_type: [DETAIL]-常规，[BACT]-细菌培养, [AST]-药敏 
                // [DETAIL] ==>  lab/report/GetReportDetail
                // [AST] ==>  lab/report/GetReportAst
                // [BACT] ==>  lab/report/GetReportBact

                fetchPost('lab/report/GetReportList', {
                    visit_id: Number(curVisitId),
                    report_start: latestDate[0],
                    report_end: latestDate[1]
                }).then((res: any) => {
                    const resList: any = typeof res.row_list === 'undefined' ? [] : res.row_list;
                    setList(orderData(resList, 'report_time', true));
                });
                break;

            case 'exam':
                fetchPost('exam/report/GetReportList', {
                    visit_id: Number(curVisitId),
                    report_start: latestDate[0],
                    report_end: latestDate[1]
                }).then((res: any) => {
                    const resList: any = typeof res.row_list === 'undefined' ? [] : res.row_list;
                    setList(orderData(resList, 'report_time', true));
                });

                break;
        }



    }

    function updateDetail(id: string, type: string) {
        switch (reportType) {
            case 'lab':

                let api = 'lab/report/GetReportDetail';
                let reportTypeAttr: string[] = [];;


                if (type.indexOf('[DETAIL]') >= 0) {
                    api = 'lab/report/GetReportDetail';
                    reportTypeAttr.push('[DETAIL]');
                }
                if (type.indexOf('[BACT]') >= 0 ) {
                    api = 'lab/report/GetReportBact ';
                    reportTypeAttr.push('[BACT]');
                }
                if (type.indexOf('[AST]') >= 0 ) {
                    api = 'lab/report/GetReportAst';
                    reportTypeAttr.push('[AST]');
                }


                fetchPost(api, {
                    report_no: id
                }).then((res: any) => {
                    const resList: any = typeof res.row_list === 'undefined' ? [] : res.row_list;
                    resList.forEach((item: any) => {
                        item.report_type = reportTypeAttr.join('');
                    });

                    setOrginalDetailList(resList);
                    setDetailList(resList);
                });
                break;

            case 'exam':

                fetchPost('exam/report/GetReportContent', {
                    report_no: id
                }).then((res: any) => {
                    const resInfo = res.report_content;
                    if (typeof resInfo === 'undefined') return;

                    if (resInfo.report_no === null) {
                        setExamContent(null);
                    } else {
                        setExamContent(resInfo);
                    }
                   

                    
                });
                break;
        }


    }


    function resetReferenceDataStatus() {
        // checkboxes
        setChkUnusual(false);
        setChkBact(false);
        setChkAst(false);


        // reset type
        setReportType('lab');

    }



    useEffect(() => {

        if (editEnterStatus) updateList(reportDate, 'lab', visitId);

    }, [controlId, editEnterStatus]);





    return (
        <>
            {/* 
            //=============================
            // CONTENT
            //============================= 
            */}

            <div
                className="app-builder-reference-data__inner h-100"
                data-name="reference-data-inner"
                data-row={dyRow}
            >
                <div className="container-fluid h-100">

                    {/* ROW */}
                    <div className="row">
                        <div className="col-12">

                            {/*----------- BEGIN content  ---------*/}

                            <div className="row g-0">


                                <div className="col-auto">
                                    {/* <!-- ROW --> */}
                                    <div className={`row g-2 align-items-center mb-3 ms-2 app-builder-reference-data__radio-checkbox`}>

                                        <div className="col-auto">

                                            <Radio
                                                wrapperClassName=""
                                                inline={true}
                                                tabIndex={-1}
                                                value={reportType}
                                                options={reportTypeData}
                                                onChange={(e: any, val: any) => {
                                                    setReportType(val);

                                                    setTimeout(() => {
                                                        updateList(reportDate, val, visitId);
                                                    }, 0);
                                                }}
                                            />

                                        </div>

                                    </div>
                                    {/* <!-- ROW END --> */}



                                </div>

                                <div className="col-auto">
                                    {/* <!-- ROW --> */}
                                    <div className={`row g-0 align-items-center mb-3`}>

                                        <div className="col-auto">
                                            <Input
                                                tabIndex={-1}
                                                wrapperClassName="position-relative"
                                                value={reportDate[0]}
                                                type="date"
                                                onChange={(e) => {
                                                    setReportDate((prevState: string[]) => {
                                                        const _data = prevState;
                                                        _data[0] = e.target.value;

                                                        updateList(_data, reportType, visitId);
                                                        return _data;
                                                    });

                                                    
                                                }}
                                            />
                                        </div>

                                        <div className="col-auto app-text fw-bold me-2 ms-2">
                                            {appearanceConfig ? appearanceConfig.referenceDataPanel.between : '到'}
                                        </div>
                                        <div className="col-auto">
                                            <Input
                                                tabIndex={-1}
                                                wrapperClassName="position-relative"
                                                value={reportDate[1]}
                                                type="date"
                                                onChange={(e) => {
                                                    setReportDate((prevState: string[]) => {
                                                        const _data = prevState;
                                                        _data[1] = e.target.value;

                                                        updateList(_data, reportType, visitId);
                                                        return _data;
                                                    });


                                                }}
                                            />
                                        </div>

                                    </div>
                                    {/* <!-- ROW END --> */}
                                </div>



                                <div className="col-auto">

                                    {/* <!-- ROW --> */}
                                    <div className={`row g-2 align-items-center mb-3 ms-2`}>



                                        <div className="col-auto d-none">

                                            <Checkbox
                                                wrapperClassName="position-relative mt-2"
                                                value="ok"
                                                label={<><small className="p-1 rounded">{appearanceConfig ? appearanceConfig.btns.listSortLabel : '倒序'}</small></>}
                                                onChange={(e: any, val: boolean) => {
                                                    const oldList = list;
                                                    const _data = orderData(oldList, 'report_time', !orderType.current);
                                                    setList([]);
                                                    setTimeout(() => {
                                                        setList(_data);
                                                        orderType.current = !orderType.current;
                                                    }, 0);
                                                }}
                                                checked={false}
                                            />

                                        </div>

                                        <div className={`col-auto ${reportType !== 'lab' ? 'd-none' : ''}`}>

                                            <Checkbox
                                                wrapperClassName="position-relative mt-2"
                                                value="ok"
                                                label={<><small className="text-danger">异常</small></>}
                                                onChange={(e: any, val: boolean) => {
                                                    setChkUnusual(val);

                                                    const targetTr = document.querySelectorAll('.app-builder-reference-data__list tbody > tr');
                                                    const specIds: any[] = [];
                                                    [].slice.call(targetTr).forEach((node: any, i: number) => {
                                                        const checkboxDiv = node.querySelector('th');
                                                        if (checkboxDiv !== null && checkboxDiv.classList.contains('is-unusual')) {
                                                            specIds.push({
                                                                index: i,
                                                                value: val
                                                            });
                                                        }
                                                    });

                                                    // trigger target checkbox
                                                    if (tableCheckRef.current !== null) {
                                                        tableCheckRef.current.check(specIds, (res: any[]) => {

                                                            const text = res.map((v: any) => {
                                                                return `${v.content[2]} ${v.content[3]} ${v.content[5]} ${v.content[4] !== '-' ? htmlToPlain(v.content[4]) : ''}，`
                                                            });
                                            
                                          
                                                            setSelectedItem(res);
                                                            setSyntheticText2(text.join('').replace(/，\s*$/, ''));

                                                        });
                                                    }

                                                    
                                                }}
                                                checked={chkUnusual}
                                            />

                                        </div>

                                        <div className={`col-auto ${reportType !== 'lab' ? 'd-none' : ''}`}>

                                            <Checkbox
                                                wrapperClassName="position-relative mt-2"
                                                value="ok"
                                                label={<><small className="text-info">细菌</small></>}
                                                onChange={(e: any, val: boolean) => {
                                                    setChkBact(val);

                                                    if (val) {
                                                        setDetailList((prevState: any[]) => {
                                                            let _data = orginalDetailList;
                                                            _data = _data.filter((item: any) => item.report_type.indexOf('[BACT]') >= 0);

                                                            return _data;
                                                        });
                                                    } else {
                                                        setDetailList((prevState: any[]) => {
                                                            let _data = orginalDetailList;
                                                            return _data;
                                                        });
                                                    }
                                                }}
                                                checked={chkBact}
                                            />

                                        </div>

                                        <div className={`col-auto ${reportType !== 'lab' ? 'd-none' : ''}`}>

                                            <Checkbox
                                                wrapperClassName="position-relative mt-2"
                                                value="ok"
                                                label={<><small className="text-success">药敏</small></>}
                                                onChange={(e: any, val: boolean) => {
                                                    setChkAst(val);

                                                    if (val) {
                                                        setDetailList((prevState: any[]) => {
                                                            let _data = orginalDetailList;
                                                            _data = _data.filter((item: any) => item.report_type.indexOf('[AST]') >= 0);

                                                            return _data;
                                                        });
                                                    } else {
                                                        setDetailList((prevState: any[]) => {
                                                            let _data = orginalDetailList;
                                                            return _data;
                                                        });
                                                    }
                                                }}
                                                checked={chkAst}
                                            />

                                        </div>




                                        <div className="col-auto">
                                            <a
                                                tabIndex={-1}
                                                href="#"
                                                className={`btn bg-warning text-black btn-link btn-sm text-decoration-none me-s d-flex align-items-center ${syncReportBtnDisabled ? 'disabled app-button-state--waiting' : ''}`}
                                                dangerouslySetInnerHTML={{
                                                    __html: appearanceConfig ? appearanceConfig.btns.sync : '同步'
                                                }}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.preventDefault();

                                                    setSyncReportBtnDisabled(true);

                                                    Promise.all([
                                                        axios.post(apiUrls.REPORT_SYNC_EXAM, {
                                                            visit: Number(visitId),
                                                            param1: '',
                                                            param2: '',
                                                            param3: '',
                                                            param4: ''
                                                        }, {
                                                            headers: {
                                                                ...authHeader(),
                                                                'Content-Type': 'application/json'
                                                            } as never
                                                        }),
                                                        axios.post(apiUrls.REPORT_SYNC_LAB, {
                                                            visit: Number(visitId),
                                                            param1: '',
                                                            param2: '',
                                                            param3: '',
                                                            param4: ''
                                                        }, {
                                                            headers: {
                                                                ...authHeader(),
                                                                'Content-Type': 'application/json'
                                                            } as never
                                                        })
                                                    ]).then((values) => {
                                                        const res1 = values[0].status;
                                                        const res2 = values[1].status;

                                                        if (res1 == 200 && res2 == 200) {

                                                            const resData1 = values[0].data.code;
                                                            const resData2 = values[1].data.code;

                                                            if (resData1 == 0 && resData2 == 0) {
                                                                alert(appearanceConfig ? appearanceConfig.others.syncSuccess : '同步成功');
                                                                setSyncReportBtnDisabled(false);
                                                            } else {
                                                                alert(appearanceConfig ? appearanceConfig.others.syncFailure : '同步失败');
                                                                setSyncReportBtnDisabled(false);
                                                            }

                                                        } else {
                                                            alert(appearanceConfig ? appearanceConfig.others.syncFailure : '同步失败');
                                                            setSyncReportBtnDisabled(false);
                                                        }
                                                    }).catch(() => {
                                                        alert(appearanceConfig ? appearanceConfig.others.syncFailure : '同步失败');
                                                        setSyncReportBtnDisabled(false);
                                                    });



                                                }}
                                            ></a>

                                        </div>
                                          



                                        <div className="col-auto">

                                            <div className={`z-2 ${reportType === 'lab' ? '' : 'd-none'}`}>

                                                <button tabIndex={-1} type="button" className="btn btn-primary btn-sm text-decoration-none ms-2" onClick={handleConfirm}>{appearanceConfig ? appearanceConfig.btns.referenceDataConfirmLabel : '结构化复制'}</button>
                                            </div>

                                        </div>

                                    </div>
                                    {/* <!-- ROW END --> */}

                                </div>

                            </div>


                            {/*----------- END content -------------*/}
                        </div>

                    </div>
                    {/* /ROW */}



                    {/* ROW */}
                    <div className={`row g-0 h-100 position-relative z-1 ${list.length === 0 ? 'd-none' : ''}`}>

                        <div className="col-3">
                            {/*----------- BEGIN content  ---------*/}
                            <div className={`h-100`}>

                                <div className="pe-3">
                                    <div className="app-dataisland-container-autoheight app-dataisland-container-autoheight--side bg-body border rounded position-relative">

                                        <div className="list-group">
                                            {list.map((item: any, i: number) => {
                                                return <a
                                                    key={'item-' + i}
                                                    href="#"
                                                    data-slug={item.report_no}
                                                    data-name={item.report_title}
                                                    data-time={item.report_time}
                                                    data-type={item.report_type}  
                                                    tabIndex={-1}
                                                    className={`list-group-item  border-0 rounded-0 list-group-item-action bg-transparent ${targetId == item.report_no ? "active bg-primary-subtle text-dark" : ""}`}
                                                    onClick={(e: React.MouseEvent) => {
                                                        e.preventDefault();
                                                        const tid = (e.currentTarget as any).dataset.slug;
                                                        const name = (e.currentTarget as any).dataset.name;
                                                        const time = (e.currentTarget as any).dataset.time;
                                                        const type = (e.currentTarget as any).dataset.type;

                                                        updateDetail(tid, type);
                                                        setTargetId(tid);
                                                        setSyntheticText1(`${name}（${time}）：`);


                                                        // checkboxes
                                                        setChkUnusual(false);
                                                        setChkBact(false);
                                                        setChkAst(false);

                                                        //
                                                        setItemCode('');
                                   

                                                    }}
                                                >
                                                    <div className="d-flex w-100 justify-content-between">
                                                        <h6 className="mb-1">{item.report_title}</h6>
                                                    </div>
                                                    <small className="text-muted">{item.report_time}</small>


                                                </a>
                                            })}
                                        </div>
                                    </div>


                                </div>


                            </div>


                            {/*----------- END content -------------*/}
                        </div>

                        <div className="col-9">

                            <div className={`app-builder-reference-data__list ${reportType === 'lab' ? 'app-dataisland-container-autoheight' : 'app-dataisland-container-autoheight--full'} ${itemCode === '' ? 'app-dataisland-container-autoheight--full' : ''}`}>
                                {/*----------- BEGIN content  ---------*/}

                                {reportType === 'exam' ? <>
          
                                    <div className="row g-0">
                                        <div className="text-end" style={{ width: LABEL_WIDTH }}>
                                            检查所见：
                                            <br />
                                            {examContent ? <button tabIndex={-1} type="button" className="btn btn-primary btn-sm text-decoration-none ms-2 py-0 me-2 mt-1" onClick={handleConfirmExam1}>复制</button> : null}
                                            
                                        </div>
                                        <div className="col">
                                            <Textarea
                                                ref={copyDiv1Ref}
                                                rows={3}
                                                value={examContent ? examContent.exam_observe : ''}
                                                autoSize
                                            />
                                        </div>
                                    </div>
                                    {/* ///////////// */}

                                    <div className="row g-0">
                                        <div className="text-end" style={{ width: LABEL_WIDTH }}>
                                            检查提示：
                                            <br />
                                            {examContent ? <button tabIndex={-1} type="button" className="btn btn-primary btn-sm text-decoration-none ms-2 py-0 me-2 mt-1" onClick={handleConfirmExam2}>复制</button> : null}
                                        </div>
                                        <div className="col">
                                                <Textarea
                                                    ref={copyDiv2Ref}
                                                    rows={3}
                                                    value={examContent ? examContent.exam_result : ''}
                                                    autoSize
                                                />
                                        </div>
                                    </div>
                                    {/* ///////////// */}

                                </> : <>
                                    <ChildCom tableCheckRef={tableCheckRef} data={detailList} callback={setSyntheticText2} callback2={setSelectedItem} callback3={setItemCode} />
                                    
                                    {detailList.length === 0 ? <p className="p-0 m-0 mb-2" style={{transform: 'translateY(-1rem)'}}>请先选择选项后再点击按钮生成和复制内容</p> : null}
                                </>}


                                {/*----------- END content -------------*/}
                            </div>



                            {itemCode === '' ? null : <>
                                {reportType === 'lab' ? <>
                                    <div className="app-dataisland-chart border shadow bg-body">
                                        {/*----------- BEGIN content  ---------*/}


                                        <ReportChart
                                            visit_id={visitId}
                                            report_start={reportDate[0]}
                                            report_end={reportDate[1]}
                                            item_code={itemCode as any}
                                        />


                                        {/*----------- END content -------------*/}
                                    </div>
                                </> : null}

                            </>}





                        </div>


                    </div>
                    {/* /ROW */}


                    {/* ROW */}
                    <div className="row">
                        <div className="col-12">
                            {list.length === 0 ? <>
                                <Tips
                                    center
                                    fullWidth
                                    shape="none" // info,none,error,success,wait,warning
                                    title={appearanceConfig ? appearanceConfig.referenceDataPanel.noData : '暂无数据，您可以切换开始结束时间筛选'}
                                    content={<></>}
                                />

                            </> : null}
                        </div>
                    </div>
                    {/* /ROW */}


                </div>

            </div>



        </>
    );

}


export default PageIndex;

