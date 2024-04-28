import React, { useState, useEffect, useRef } from "react";

// API
import { fetchPost } from '../../config/request';

import { ControlTypes } from '../../data/dd-control-types';


import guid from '../../utils/guid';

// custom control
import ControlCustom from '../../controls/form-elements/ControlCustom';
import ControlCustomMultipleLine from '../../controls/form-elements/ControlCustomMultipleLine';


import { extractContentsOfBrackets } from '../../utils/extract';


// inner components
import innerComponentPrefix from '../../data/section-inner-component-const';
import DiagComponent from "../../plugins/DiagComponent";


interface LinkConfig {
    link_name?: string;
    link_value?: number;
    link_data?: string;
    link_tag?: string;
    link_ext?: string;
}


type SectionProps = {
    popupRef?: React.RefObject<any>;
    actRef?: React.RefObject<any>;
    sectionConfig?: any;
    sectionId?: number;
    sectionIndex: number;
    onUpdateTempDefaultValue: any;

    //
    manualInit?: boolean;
    multipleLine?: boolean;
    dataFirstLoaded?: boolean;
    initVar: number;
    appearanceConfig?: any;
    orginalDefaultData?: any[];
    defaultValue?: any[];
    emrId?: string | number | undefined | null;
    visitId?: string | number;
    babyId?: string | number;
    userId?: string | number;
    entryId?: string | number;
    linkData?: LinkConfig;
    onEntry?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, entryFuncs: any) => any;
    onChange?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => any;
    onRemove?: (entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => any;

};


const Section = (props: SectionProps) => {

    const {
        popupRef,
        actRef,
        sectionConfig,
        sectionId,
        sectionIndex,
        onUpdateTempDefaultValue,

        //
        manualInit,
        multipleLine,
        dataFirstLoaded,
        initVar,
        appearanceConfig,
        orginalDefaultData,
        defaultValue,
        linkData,
        emrId,
        visitId,
        userId,
        babyId,
        entryId,
        onEntry,
        onChange,
        onRemove
    } = props;

    
    const [data, setData] = useState<any>(null);

    // entry
    const itemExist = (arr: any[], entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number) => {
        return arr.some((o: any) => {
            return o.entryId == entryId && o.sectionId == sectionId && o.rowNo == rowNo && o.elemId == elemId
        });
    };


    const getSectionProps = async () => {
        const resElem = await fetchPost('form/GetSectionElemList', {
            section_id: Number(sectionId),
            section_version: null
        });

        const resSectionElemList: any = typeof resElem.row_list === 'undefined' ? [] : resElem.row_list;
        const _columnsData = resSectionElemList ? resSectionElemList.map((moduleField: any, j: number) => {

            return {
                "id": `app-builder-draggable__item-module-${guid()}`,
                "moduleFields": [
                    {
                        "controlType": ControlTypes.CUSTOM_INPUT,
                        "args": {
                            "sheet_id": 0,
                            "elem_id": moduleField.elem_id,
                            "elem_name": moduleField.elem_title,
                            "elem_width": moduleField.elem_width,
                            "elem_tag": moduleField.elem_tag,
                            "elem_note": moduleField.elem_note,
                            "entry_id": moduleField.entry_id,
                            "entry_name": moduleField.entry_name,
                            "entry_tag": moduleField.entry_tag,
                            "sort_no": moduleField.sort_no
                        }
                    }
                ],
                "moduleSlug": "module_custom_elem",
                "moduleTitle": moduleField.elem_title
            }
        }) : [];


        const _data = {
            "ratio": [
                [
                    12,
                    "col-12"
                ]
            ],
            "sectionConfig": sectionConfig,
            "id": `app-builder-draggable__item-grid-${guid()}`,
            "columnsData": [
                _columnsData
            ]
        };


     
        const sectionRatio = _data.ratio;
        const columnsData = _data.columnsData;
        let sectionPureComponentArgs = _data.sectionConfig.section_arg;
        if (sectionPureComponentArgs === '') sectionPureComponentArgs = '{}';


        const sectionName = sectionConfig.section_title;
        const columnRatio = sectionConfig.column_width?.split(' ');


        setData({
            sectionName,
            sectionId,
            sectionConfig,
            sectionRatio,
            columnsData,
            columnRatio,
            sectionIndex,
            sectionPureComponentArgs,
            multipleLine,
            manualInit
        });


    };


    useEffect(() => {
        getSectionProps();
    }, []);

    return (
        <>

            {data === null ? <>
                <p>{appearanceConfig ? appearanceConfig.others.sectionInit : '加载中...'}</p>
            </> : <>
                <div className={`app-builder-section container-fluid g-0 ps-2`}>
                    <div className="row">

                        {data.sectionRatio?.map((perRow: any, i: number) => {
                            const [colNum, colClassName] = perRow;
                            const currentColumnData = typeof data.columnsData !== 'undefined' && (data.columnsData as any)[i] !== null ? (data.columnsData as any)[i] : null;
                            const colsData = Array.isArray(currentColumnData) ? currentColumnData : [currentColumnData];


                            return <React.Fragment key={'col-' + i}>


                                {/*----------- BEGIN  Builder Area   ---------*/}
                                <div
                                    className={`app-builder-columnarea__preview ${colClassName}`}
                                    data-grid={`${colClassName}`}
                                >

                                    {data.sectionConfig.section_code?.indexOf(innerComponentPrefix) >= 0 ? <>
                                        {/* INNER COMPONENT */}

                                        {data.sectionConfig.section_code === innerComponentPrefix + "__DIAGNOSIS_WESTERN_MEDICINE" ? <>
                                            <DiagComponent
                                                visitId={Number(visitId)}
                                                customProps={data.sectionPureComponentArgs.replace('{userId}', userId as any)}
                                            />
                                        </> : null}



                                        {/* /INNER COMPONENT */}
                                    </> : <>

                                        {data.multipleLine ? <>

                                            <div className={`app-builder-section__item-group`}>


                                                {/* MODULE */}
                                                <div className="app-builder-section__item-moudle-component">

                                                    {/* CONTROL */}
                                                    <ControlCustomMultipleLine
                                                        popupRef={popupRef}
                                                        actRef={actRef}
                                                        appearanceConfig={appearanceConfig}
                                                        orginalDefaultData={orginalDefaultData}
                                                        defaultValue={defaultValue}
                                                        initVar={initVar}
                                                        sectionName={data.sectionName}
                                                        sectionIndex={data.sectionIndex}
                                                        sheetId={0}
                                                        sectionRealId={data.sectionId}
                                                        emrId={emrId}
                                                        visitId={visitId}
                                                        linkData={linkData}
                                                        babyId={babyId}
                                                        manualInit={data.manualInit}
                                                        colIndex={0}
                                                        moduleFields={colsData.map(v => v.moduleFields[0])}
                                                        onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                                            const latestValue = localStorage.getItem('FORM_CLIENT_TEMP_DATA');
                                                            onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, latestValue !== null ? JSON.parse(latestValue) : null);

                                                        }}
                                                        onRemove={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                                            const latestValue = localStorage.getItem('FORM_CLIENT_TEMP_DATA');
                                                            onRemove?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, latestValue !== null ? JSON.parse(latestValue) : null);
                                                        }}
                                                    />
                                                    {/* /CONTROL */}


                                                </div>
                                                {/* /MODULE */}


                                            </div>



                                        </> : <>

                                            <div className={`app-builder-section__item-group`}>


                                                <div className={`app-builder-section__preview-row ${data.sectionConfig.column_split == 0 ? 'ex-row' : 'row g-2'}`}>
                                                    {colsData.map((colCmponentData: any, colIndex: number) => {
                                                        if (colCmponentData === null) return null;

                                                        const moduleFields = colCmponentData?.moduleFields;

                                        
                                                        let _divisor: number = 1;
                                                        switch (data.sectionConfig.column_split.toString()) {
                                                            case '12':  // 一列
                                                                _divisor = 1;
                                                                break;

                                                            case '6': // 两列
                                                                _divisor = 2;
                                                                break;

                                                            case '4': // 三列
                                                                _divisor = 3;
                                                                break;

                                                            case '3':  // 四列
                                                                _divisor = 4;
                                                                break;

                                                            case '2': // 六列
                                                                _divisor = 6;
                                                                break;
                                                        }


                                                        // if use element width to calculate column width
                                                        const perColClassName = data.sectionConfig.column_split != 0 ? '' : (moduleFields[0].args.elem_width !== null ? moduleFields[0].args.elem_width : 'ex-col-auto');

                                                        return <div key={`${colCmponentData?.id} + ${colIndex}`} className={perColClassName !== '' ? `${perColClassName} app-builder-section__preview-col app-builder-section__preview-col--oneline` : `col-12 col-md-${sectionConfig === null ? 12 : data.columnRatio[colIndex % _divisor]} app-builder-section__preview-col`}>
                                                            <div className={`app-builder-section__item`} id={colCmponentData?.id}>


                                                                {/* MODULE */}
                                                                <div className="app-builder-section__item-moudle-component">

                                                                    {/* CONTROL */}
                                                                    <ControlCustom
                                                                        popupRef={popupRef}
                                                                        actRef={actRef}
                                                                        appearanceConfig={appearanceConfig}
                                                                        orginalDefaultData={orginalDefaultData}
                                                                        defaultValue={defaultValue}
                                                                        initVar={initVar}
                                                                        sectionName={data.sectionName}
                                                                        sectionIndex={sectionIndex}
                                                                        sheetId={0}
                                                                        sectionRealId={data.sectionId}
                                                                        emrId={emrId}
                                                                        visitId={visitId}
                                                                        linkData={linkData}
                                                                        babyId={babyId}
                                                                        manualInit={data.manualInit}
                                                                        colIndex={colIndex}
                                                                        moduleFields={moduleFields}
                                                                        onEntry={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, entryFuncs: any) => {
                                                                            onEntry?.(entryId, sectionId, rowNo, elemId, entryFuncs);
                                                                        }}
                                                                        onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {

                                                                            const latestValue = localStorage.getItem('FORM_CLIENT_TEMP_DATA');
                                                                            onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, latestValue !== null ? JSON.parse(latestValue) : null);


                                                                            // save temporary default value
                                                                            const prevState = latestValue !== null ? JSON.parse(latestValue) : [];
                                                                            const _val = { entryId, sectionId, rowNo, elemId, value, valueNote, elemName, elemTotalScore, attrs };

                                                                            let res: any[] = Array.from(new Set(prevState));
                                                                            const currentItemIndex = prevState.findIndex((o: any) => o.entryId == entryId && o.sectionId == sectionId && o.rowNo == rowNo && o.elemId == elemId);

                                                                            if (itemExist(prevState, entryId, sectionId, rowNo, elemId)) {
                                                                                res.splice(currentItemIndex, 1);
                                                                            }
                                                                            res.push(_val);

                                                                            onUpdateTempDefaultValue(res);
                                                                            localStorage.setItem('FORM_CLIENT_TEMP_DATA', JSON.stringify(res));




                                                                        }}
                                                                    />
                                                                    {/* /CONTROL */}


                                                                </div>
                                                                {/* /MODULE */}
                                                            </div>
                                                        </div>;

                                                    })}
                                                </div>
                                            </div>



                                        </>}


                                    </>}



                                </div>
                                {/*----------- END Builder Area   ---------*/}




                            </React.Fragment>
                        })}
                    </div>
                </div>
            </>}

        </>
    );


}



export default Section;


