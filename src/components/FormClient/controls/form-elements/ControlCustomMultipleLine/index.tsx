import React, { useState, useEffect } from "react";

// API
import { fetchPost } from '../../../config/request';


// bootstrap components
import DynamicFields from 'funda-ui/DynamicFields';


import Item from './Item';


type DynamicFieldsValueProps = {
    init: React.ReactNode[];
    tmpl: React.ReactNode;
};


const ControlCustomMultipleLine = (props: any) => {

    const {
        popupRef,
        actRef,
        appearanceConfig,
        orginalDefaultData,
        defaultValue,
        initVar,
        sectionName,
        colIndex,
        sectionIndex,
        sectionRealId,
        sheetId,
        emrId,
        visitId,
        linkData,
        babyId,
        moduleFields,
        onChange,
        onRemove,
    } = props;


    const [dynamicFieldsValue, setDynamicFieldsValue] = useState<DynamicFieldsValueProps | null>(null);
    const [dynamicFieldsJsonValue, setDynamicFieldsJsonValue] = useState<any[]>([]);

    //
    const [dynamicFieldsInnerAppendHeadData, setDynamicFieldsInnerAppendHeadData] = useState<any[]>([]);

    const initInnerAppendHeadData = (addBtnId: string) => {
        if (!Array.isArray(moduleFields)) return;


        const res: React.ReactNode[] = [];
        const allReq: any[] = [];


        moduleFields.map((perField: any, fieldIndex: number) => {
            allReq.push(fetchPost('elem/GetElemProperty', {
                elem_id: Number(perField.args.elem_id)
            }));
        });

      
        Promise.all(allReq).then((values) => {

            moduleFields.map((perField: any, fieldIndex: number) => {
                const {
                    link_name,
                    link_value,
                    link_data,
                    link_tag,
                    link_ext,
    
                    elem_type,
                    elem_no,
                    elem_code,
                    elem_name,
                    elem_name_kb,
                    elem_name_last,
                    elem_name_last_kb,
                    elem_title,
                    elem_unit,
                    elem_score,
                    elem_tag,
                    elem_note,
    
                    value_type,
                    value_e,
                    value_length,
                    value_min,//dec
                    value_max,//dec
                    value_valid,
                    value_init,
                    value_text,
                    value_code,
                    value_code_system,
    
                    value_list,
                    value_option,
                } = values[fieldIndex].elem_property;

                const mmEnabled = typeof value_min !== 'undefined' && typeof value_max !== 'undefined' && value_min != 0 && value_max != 0;

                const _title = elem_title !== '' ? elem_title : elem_name_last;
                res.push(<>
                {_title}


                </>);



            });

            res.push(<>
                <span className="d-inline-block text-success btn-sm" style={{transform: 'translateX(4px)', cursor: 'pointer'}} onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    document.getElementById(addBtnId)?.click();
                }}><svg width="25px" height="25px" viewBox="0 0 24 28" fill="none"><path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill="#146c43" /></svg></span>
            </>);
            setDynamicFieldsInnerAppendHeadData(res);
      

        });

    };


    useEffect(() => {

        
        // default value
        const _values = typeof defaultValue !== 'undefined' ? defaultValue.filter((item: any) => item.sectionIndex == sectionRealId)[0]?.fields : undefined;
        const resList: any[] = typeof _values !=='undefined' ? _values : [];

        //initialize JSON value
        setDynamicFieldsJsonValue(resList);

        
        //initialize default value
        const tmpl = (val: any, init: boolean = true) => {
            let data: any = null;
            if (init) {
                const { ...rest } = val;
                data = rest;
            } else {
                data = { index: Math.random() };
            }

            const currentRow = val !== null ? val.index : undefined;

            return <React.Fragment key={'tmpl-' + data.index}>
                {/* ///////////// */}

                {moduleFields && moduleFields?.map((perField: any, fieldIndex: number) => {
            
           
                    return (
                        <div key={`${sectionIndex}-${fieldIndex}`} className="d-table-cell py-2 px-2 position-relative">
                            <Item
                                popupRef={popupRef}
                                actRef={actRef}
                                appearanceConfig={appearanceConfig}
                                orginalDefaultData={orginalDefaultData}
                                hasDefaultValue={Array.isArray(defaultValue)}
                                defaultValue={resList.flat()}
                                initVar={initVar}
                                sectionIndex={sectionIndex}
                                sectionRealId={sectionRealId}
                                sheetId={sheetId}
                                emrId={emrId}
                                visitId={visitId}
                                linkData={linkData}
                                babyId={babyId}
                                currentRow={currentRow}
                                dyRow={init ? data.index : `%i%`}
                                index={fieldIndex}
                                args={perField.args}
                                onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                    onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
                                }}
                            />
                        </div>
                        
                    )

                })}

                <div className="d-table-cell py-2 px-2 position-relative last" style={{ width: '40px' }}></div>


                {/* ///////////// */}
            </React.Fragment>
        };

        const initData = resList.map((item: any, index: number) => {
            const { ...rest } = item;
            return tmpl({ ...rest, index });
        });

        const tmplData = tmpl(null, false);


        setDynamicFieldsValue({
            init: initData,
            tmpl: tmplData
        });

    }, []);


    return (
        <>

            <DynamicFields
                wrapperClassName="mb-3 position-relative app-div-table__wrapper"
                    btnRemoveWrapperClassName="position-relative d-inline-block align-middle"
                    key={JSON.stringify(dynamicFieldsJsonValue)}  // Trigger child component update when prop of parent changes
                data={dynamicFieldsValue}
                maxFields="15"
                confirmText="确定此操作?"
                iconAddPosition="start"
                iconAdd={<><span className="d-none"><svg width="20px" height="20px" viewBox="0 0 24 28" fill="none"><path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill="#146c43" /></svg> 添加</span></>}
                iconRemove={<><div className="position-absolute top-0 end-0 mx-2" style={{marginTop: '-10px'}}><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10ZM8 11a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8Z" fill="#f00" /></svg></div></>}
                onAdd={(items: HTMLDivElement[]) => {

                    //update `data-id` and `id` attributes of control
                    setTimeout(() => {
                        items.forEach((node: any) => {
                            const keyIndex = node.dataset.key;
                            [].slice.call(node.querySelectorAll(`[name]`)).forEach((field: any) => {
                                if (typeof field.name !== 'undefined') field.name = field.name.replace('%i%', keyIndex);
                                if (typeof field.id !== 'undefined') field.id = field.id.replace('%i%', keyIndex);
                                if (typeof field.dataset.id !== 'undefined') field.dataset.id = field.dataset.id.replace('%i%', keyIndex);
                                if (typeof field.dataset.row !== 'undefined') field.dataset.row = field.dataset.row.replace('%i%', keyIndex);
                                if (typeof field.dataset.referencedataId !== 'undefined') field.dataset.referencedataId = field.dataset.referencedataId.replace('%i%', keyIndex);
                                if (typeof field.dataset.referencedataInputid !== 'undefined') field.dataset.referencedataInputid = field.dataset.referencedataInputid.replace('%i%', keyIndex);
                                
                            });


                            [].slice.call(node.querySelectorAll(`[data-name]`)).forEach((field: any) => {
                                if (typeof field.name !== 'undefined') field.name = field.name.replace('%i%', keyIndex);
                                if (typeof field.id !== 'undefined') field.id = field.id.replace('%i%', keyIndex);
                                if (typeof field.dataset.id !== 'undefined') field.dataset.id = field.dataset.id.replace('%i%', keyIndex);
                                if (typeof field.dataset.row !== 'undefined') field.dataset.row = field.dataset.row.replace('%i%', keyIndex);
                                if (typeof field.dataset.referencedataId !== 'undefined') field.dataset.referencedataId = field.dataset.referencedataId.replace('%i%', keyIndex);
                                if (typeof field.dataset.referencedataInputid !== 'undefined') field.dataset.referencedataInputid = field.dataset.referencedataInputid.replace('%i%', keyIndex);
                            });

                        });
                    }, 500);


                    

                }}
                onRemove={(items: HTMLDivElement[], key: number | string, index: number | string) => {
                    const _elem_ids = moduleFields.map((perField: any, fieldIndex: number) => perField.args.elem_id);
                    onRemove?.(null, sectionRealId, index, _elem_ids, null, null);
                }}
                onLoad={(addBtn: string) => {
             
                    // initialize list head
                    initInnerAppendHeadData(addBtn);
                
                }}



                innerAppendClassName="app-div-table d-table w-100 border"
                innerAppendCellClassName="d-table-row"
                innerAppendLastCellClassName="last"
                innerAppendHideClassName="d-none"
                innerAppendBodyClassName="app-div-table__body"
                innerAppendHeadData={dynamicFieldsInnerAppendHeadData}
                innerAppendHeadRowClassName="d-table-row fw-bold bg-body-tertiary"
                innerAppendHeadCellClassName="d-table-cell py-2 px-2 position-relative fw-normal"
                innerAppendHeadCellStyles={dynamicFieldsInnerAppendHeadData.map((v: any, i: number) => {
                    if (i === dynamicFieldsInnerAppendHeadData.length - 1) {
                        return { width: "40px" };
                    } else {
                        return {};
                    }
                })}
                innerAppendEmptyContent={<><div className={`app-div-table__body--empty px-2 py-2 border-top`}>暂无数据</div></>}
                innerAppendHeadRowShowFirst

            />


        </>
    );

}


export default ControlCustomMultipleLine;


