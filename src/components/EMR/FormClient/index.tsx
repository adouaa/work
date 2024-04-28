import React, { useState, useEffect, useImperativeHandle } from "react";

// API
import { fetchPost } from './config/request';

import { ControlTypes } from './data/dd-control-types';


import guid from './utils/guid';

// get section args
import { getSectionConfig } from './utils/computeds/getArgs';


// custom control
import ControlCustom from './controls/form-elements/ControlCustom';
import ControlCustomMultipleLine from './controls/form-elements/ControlCustomMultipleLine';


import { extractContentsOfBrackets } from './utils/extract';


import sectionFormTypeData from './data/section-form-type';
import sectionEntryTypeData from './data/section-entry-type';


// bootstrap components
import { Accordion, AccordionItem } from 'funda-ui/Accordion';



// inner components
import innerComponentPrefix from './data/section-inner-component-const';
import DiagComponent from "./plugins/DiagComponent";


import Section from './components/Section';


import './index.scss';


interface LinkConfig {
    link_name?: string;
    link_value?: number;
    link_data?: string;
    link_tag?: string;
    link_ext?: string;
}


type FormClientProps = {
    popupRef?: React.RefObject<any>;
    actRef?: React.RefObject<any>;
    appearanceConfig?: any;
    defaultValue?: any[];
    emrId?: string | number | undefined | null;
    visitId?: string | number;
    babyId?: string | number;
    userId?: string | number;
    formId: string | number;
    entryId?: string | number;
    linkData?: LinkConfig;
    onEntry?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, entryFuncs: any) => any;
    onChange?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => any;
    onRemove?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => any;
};


const FormClient = (props: FormClientProps) => {

    const {
        popupRef,
        actRef,
        appearanceConfig,
        defaultValue,
        linkData,
        emrId,
        visitId,
        userId,
        babyId,
        formId,
        entryId,
        onEntry,
        onChange,
        onRemove
    } = props;

    

    // ENTRY or FORM
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const isEntry = url.indexOf('entry=1') !== -1;

    const [tempDefaultValue, setTempDefaultValue] = useState<any[] | null>(null);
    const [data, setData] = useState<any[] | null>(null);
    const [dataFirstLoaded, setDataFirstLoaded] = useState<boolean>(false);
    const [initVar, setInitVar] = useState<any>({
        sectionIndex: 0,
        dyNum: 0
    });


    function hierarchicalData(inputData: any[], mergeIdKey: string = 'sectionId', rowNoKey: string = 'rowNo') {
        if (typeof inputData === 'undefined') return undefined;


        const bucket: any = {};
        inputData.map((item: any) => {
            const merged = bucket[item[mergeIdKey]];
            if (!merged) {
                bucket[item[mergeIdKey]] = item;
                return;
            }
        });


        const res = [];
        for (const key in bucket) {
            const _val = bucket[key];
            const _currentId = _val[mergeIdKey];


            // merge fields
            const _fields: any[] = [];
            inputData.map((item) => {
                if (_currentId == item[mergeIdKey]) {
                    _fields.push(item);
                }
            });


            const _orderedFields = _fields.sort((a, b) => {
                if (Number(a[rowNoKey]) < Number(b[rowNoKey])) {
                    return -1;
                }
                if (Number(a[rowNoKey]) > Number(b[rowNoKey])) {
                    return 1;
                }
                return 0;
            });


            const _rowsAmout = _orderedFields.map((v) => v[rowNoKey]).reduce(
                (obj, key) => {
                    obj['col-' + key] = key;
                    return obj;
                }, {});

            // console.log(_currentId, _rowsAmout);
            /*
            30041 {col-0: 0}
            30042 {col-0: 0, col-1: 1, col-2: 2}
            30043 {col-0: 0}
            */

            // 
            const _formattedFields: any[] = [];
            Object.values(_rowsAmout).map((colNum) => {

                const _perRowItem: any[] = [];
                _fields.forEach((item) => {
                    if (item[rowNoKey] == colNum) {
                        _perRowItem.push(item);
                    }
                });

                _formattedFields.push(_perRowItem);
            });

            //
            res.push({
                sectionIndex: _currentId,
                fields: _formattedFields
            });
        }

        return res;
    }





    async function getSectionListData() {
        //parent_type :  固定值： FORM，ENTRY
        //parent_id :  form_id, entry_id

        // from database
        let type: string;
        let currentId: string | number;
        
        if (typeof entryId !== 'undefined') {
            type = sectionEntryTypeData; 
            currentId = entryId;
        } else {
            type = sectionFormTypeData; 
            currentId = formId;
        }


        const res = await fetchPost('form/GetSectionList', {
            parent_type: type,
            parent_id: Number(currentId),
            parent_version: null
        });

        
        const resList: any = typeof res.row_list === 'undefined' ? [] : res.row_list;
        setData(resList);

    }




    // exposes the following methods
    useImperativeHandle(
        actRef,
        () => ({
            initAll: () => {

                if (Array.isArray(data)) {
                    data.forEach((v: any, sindex: number) => {
                        setTimeout(() => {
                            setInitVar((prevState: any) => {
                                const _dyNum = prevState.dyNum;

                                return {
                                    sectionIndex: sindex,
                                    dyNum: _dyNum + 1
                                }


                            });
                        }, 50 * sindex);

                    });
                }
            }
        }),
        [actRef, data],
    );




    useEffect(() => {

        // initialize default falue
        if (defaultValue && !dataFirstLoaded && defaultValue.length > 0) {
            localStorage.setItem('FORM_CLIENT_TEMP_DATA', JSON.stringify(defaultValue));
            setTempDefaultValue(defaultValue);
            setDataFirstLoaded(true);
        }


    }, [defaultValue]);



    useEffect(() => {
        getSectionListData();
    }, []);

    return (
        <>
            
            <div className="app-builder-form-container">

                {/* //////////////////////////// */}

                <Accordion
                    triggerType="click"
                    alternateCollapse={false}
                    easing="easeInOut"
                >
                    {data ? data.map((item: any, sindex: number) => {

                        const sectionTag = extractContentsOfBrackets(item.section_tag);
                        const sectionName = item.section_title;
                        const sectionId = item.section_id;
                        const __MULTIPLE_LINE = sectionTag.includes('多行');
                        const __MANUAL_INIT = sectionTag.includes('重新初始化');


                        return <AccordionItem
                            key={sindex}
                            title={sectionName !== '' ? <>

                                {/* ICON */}
                                {item.icon_name !== '' && item.icon_name !== null && item.icon_name !== 'null' ? <>

                                    {item.icon_system !== 'svg' ? <><i className={item.icon_name}></i></> : <><span className="app-builder-num--icon" dangerouslySetInnerHTML={{ __html: `${item.icon_name}` }}></span></>}
                                </> : <>
                                    <span className="app-builder-num--circle"></span>

                                </>}
                                {/* /ICON */}
                                
                                {sectionName} 

                                {!__MULTIPLE_LINE && __MANUAL_INIT ? <>
                                    <a
                                        tabIndex={-1}
                                        href="#"
                                        className="btn bg-warning text-black btn-link btn-sm text-decoration-none me-1 d-flex align-items-center app-builder-initbtn" dangerouslySetInnerHTML={{
                                            __html: appearanceConfig ? appearanceConfig.btns.initSectionLabel : '初始化'
                                        }}
                                        onClick={(e: React.MouseEvent) => {

                                            e.preventDefault();
                                            e.stopPropagation();

                                            // Manual initialization
                                            //if (window.confirm(appearanceConfig.btns.initAlert || '')) {
                                                setInitVar((prevState: any) => {
                                                    const _dyNum = prevState.dyNum;

                                                    return {
                                                        sectionIndex: sindex,
                                                        dyNum: _dyNum + 1
                                                    }


                                                });
                                            //}
                      
                                        }}
                                    ></a>
                                </> : null}

                            </> : ''}
                            itemClassName="accordion-item border-0 bg-transparent"
                            itemHeaderClassName={`app-builder-section__title accordion-header position-relative ${sectionName !== '' ? '' : 'd-none'}`}
                            itemTriggerClassName="accordion-button mt-1 px-3 py-1 text-body"
                            itemContentClassName="pt-3"
                            defaultActive={true}
                        >

                            <Section
                                key={sindex}
                                actRef={actRef}
                                popupRef={popupRef}
                                orginalDefaultData={(tempDefaultValue !== null ? tempDefaultValue : undefined)}
                                defaultValue={hierarchicalData((tempDefaultValue !== null ? tempDefaultValue : undefined) as any[])}
                                appearanceConfig={appearanceConfig}
                                dataFirstLoaded={dataFirstLoaded}
                                sectionId={sectionId}
                                sectionConfig={item}
                                sectionIndex={sindex}
                                initVar={initVar}
                                emrId={emrId}
                                visitId={visitId}
                                linkData={linkData}
                                babyId={babyId}
                                multipleLine={__MULTIPLE_LINE}
                                manualInit={__MANUAL_INIT}
                                onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                    const latestValue = localStorage.getItem('FORM_CLIENT_TEMP_DATA');
                                    onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, latestValue !== null ? JSON.parse(latestValue) : null);

                                }}
                                onRemove={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                    const latestValue = localStorage.getItem('FORM_CLIENT_TEMP_DATA');
                                    onRemove?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, latestValue !== null ? JSON.parse(latestValue) : null);
                                }}
                                onUpdateTempDefaultValue={setTempDefaultValue}
                            />

                        </AccordionItem>
                    }) : null}


                </Accordion>
                {/* //////////////////////////// */}

            </div>



        </>
    );


}



export default FormClient;


