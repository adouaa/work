import React, { useState, useEffect, useRef, useImperativeHandle } from "react";


// API
import { fetchPost } from '../../../config/request';
import {
    ElemService,
} from '../../../services/services-api';



import { extractContentsOfBrackets } from '../../../utils/extract';
import { autop, reverseAutop } from '../../../utils/autop';
import { autopCustom } from '../../../utils/autop-custom';
import { getAbsolutePositionOfStage } from '../../../utils/get-element-property';



// bootstrap components
import Radio from 'funda-ui/Radio';
import Input from 'funda-ui/Input';
import Checkbox from 'funda-ui/Checkbox';
import Textarea from 'funda-ui/Textarea';
import ModalDialog from 'funda-ui/ModalDialog';
import MultipleCheckboxes from 'funda-ui/MultipleCheckboxes';
import RootPortal from 'funda-ui/RootPortal';
import Date from 'funda-ui/Date';
import LiveSearch from 'funda-ui/LiveSearch';

// component styles
import 'funda-ui/Date/index.css';
import 'funda-ui/LiveSearch/index.css';


//
import {
    multiSelControlOptionExist,
    fieldExist,
    getValueNote,
    unique,
    referenceDataText,
    optionsText,
    optionsTextNoIcon,
    entryText,
    oneToFiftyToCircledNumber,
    optionsFormat,
    optionsFlat,
    getSubOptions,
    optionsMergeStr,
    calcTotalScore,
    optionChecked,
    optionsScoreFormat,
    copyToClipboard,
    getOptionFile,
    formatDateTime,
    formatTime,
    hasScore
} from '../../../utils/control/tools';


import FormClient from '../../../index';

import ReferenceData from '../../reference-data';
import ModalOptions from '../../modal-options';


import { debounce } from '../../../utils/performance';




class DataService {
    
    // `getList()` must be a Promise Object
    async getList(searchStr = '', limit = 0, otherParam = '') {

        console.log('searchStr: ', searchStr);
        console.log("limit: ", limit);
        console.log("otherParam: ", otherParam);


        if ( searchStr === '------') return {
            code: 0,
            message: 'OK',
            data: []
        };


        return {
            code: 0,
            message: 'OK',
            data: [
                {item_name: 'banana', item_code: 'b', kb_code: 'banana,xiangjiao,xj'},
                {item_name: 'apple', item_code: 'a', kb_code: 'apple,pingguo,pg'},
                {item_name: 'lemon', item_code: 'l', kb_code: 'lemon,ningmeng,nm'},
                {item_name: 'juice', item_code: 'j', kb_code: 'juice,guozhi,gz'},
                {item_name: 'coffee', item_code: 'c', kb_code: 'coffee,kafei,kf'}
            ]
        };
    }



    	
}

const Item = (props: any) => {

    const {
        popupRef,
        actRef,
        appearanceConfig,
        orginalDefaultData,
        defaultValue,
        initVar,
        sectionIndex,
        sectionRealId,
        sheetId,
        emrId,
        visitId,
        linkData,
        babyId,
        manualInit,
        index,
        args,
        onChange,
        onEntry,
    } = props;


    const {
        elem_id,
        elem_name,
        elem_note,
        elem_tag,
        entry_id,
        entry_name,
        entry_tag
    } = args;

    const dyRow = "0";
    const curSectionElemTitle: any = elem_name;


    const initValueEnabled = typeof emrId === 'undefined' || emrId == null || emrId <= 0 ? true : false;
    const currentValueData = typeof defaultValue !== 'undefined' ? defaultValue.filter((item: any) => item.elemId == elem_id) : undefined;

    //
    const [firstFetch, setFirstFetch] = useState<boolean>(false);


    const elemTag = extractContentsOfBrackets(elem_tag);
    const [data, setData] = useState<any>(null);
    const [entryMode, setEntryMode] = useState<boolean>(false);
    const [entryFieldsData, setEntryFieldsData] = useState<any[]>([]);
    const [entryValueRes, setEntryValueRes] = useState<string | null>(null);


    const datePopupRef = useRef<HTMLFormElement>(null);
    const currentOptionsTextObjRef = useRef<HTMLFormElement>(null);
    const entryBtnRef = useRef<HTMLButtonElement>(null);
    const valueNoteWrapperRef = useRef<HTMLDivElement>(null);
    const selectMultipleSplitBtnRef = useRef<HTMLInputElement>(null);


    // live search
    const liveSearchPopupRef = useRef<any>(null);



    // copy text
    const copyDivRef = useRef<HTMLInputElement>(null);
    const [copyData, setCopyData] = useState<string>('');
   

    // score
    const initScore = currentValueData && typeof currentValueData[0] !== 'undefined' && typeof currentValueData[0].elemTotalScore !== 'undefined' ? Number(currentValueData[0].elemTotalScore) : 0;
    const [elemTotalScore, setElemTotalScore] = useState<number>(initScore);


    // checkbox
    const [checkboxVal, setCheckboxVal] = useState<string | number>(0);
    const [valueNoteVal, setValueNoteVal] = useState<any>('');

    //options list
    const [optionsList, setOptionsList] = useState<any[]>([]);
    const [optionsGroupList, setOptionsGroupList] = useState<any[]>([]);
    const [showOptionsList, setShowOptionsList] = useState<boolean>(false);
    const [optionsListCloseFunc, setOptionsListCloseFunc] = useState<Function | null>(null);
    const [itemSelected, setItemSelected] = useState<string[]>([]);
    const [addOptionsResHasBreakBtnChecked, setAddOptionsResHasBreakBtnChecked] = useState<boolean>(false);
    const [addOptionsResHasNumBtnChecked, setAddOptionsResHasNumBtnChecked] = useState<boolean>(false);
    const [addOptionsResHasSplitBtnChecked, setAddOptionsResHasSplitBtnChecked] = useState<boolean>(false);

    // sub options list
    const [subOptionCom, setSubOptionCom] = useState<React.ReactNode>(null);
    const [hasSubOption, setHasSubOption] = useState<boolean>(false);
    const [subOptionLatestValArr, setSubOptionLatestValArr] = useState<any[]>([]);


    // reference data
    const [referenceDataEditEnterStatus, setReferenceDataEditEnterStatus] = useState<boolean>(false);
    const [referenceDataTargetId, setReferenceDataTargetId] = useState<string>('');


    // custom select
    const POS_OFFSET = 10;
    const EXCEEDED_SIDE_POS_OFFSET = 20;
    const customselectWrapper = useRef<HTMLDivElement>(null);
    const customSelectBtnRef = useRef<HTMLButtonElement>(null);
    const [showCustomSelectOptionsList, setShowCustomSelectOptionsList] = useState<boolean>(false);

    const windowScrollUpdate = debounce(handleScrollEvent, 50);


    // exposes the following methods
    useImperativeHandle(
        popupRef,
        () => ({
            closeCustomSelect: () => {
                // close custom select
                handleCustomSelectHide();
            },
        }),
        [popupRef],
    );



    //convert HTML text to plain text
    const htmlToPlain = (input: string) => {
        return input.replace(/(<([^>]+)>)/ig, '');
    };

    const optionsForComponentValueFormat = (groupData: any[], allData: any[], curAttrs: any, isMultiple: boolean) => {
        
        // reset all items
        allData.forEach((item: any) => {
            item.checked = false;
        });

        const _optionsHasScore = hasScore(allData);


        //
        const groupOptions: any[] = [];
        const returnItem = (item: any, index: number) => {

            const _scoreLabel = _optionsHasScore && typeof item.option_score !== 'undefined' && item.option_score != null ? `<small class="text-muted">${appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}${appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}${item.option_score}${appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small>` : '';

            let _score = _optionsHasScore && typeof item.option_score !== 'undefined' && item.option_score != null ? item.option_score : 0;
            if (_score > curAttrs.maxScore && curAttrs.maxScore > 0) _score = curAttrs.maxScore;


            if (!isMultiple) {
                if (curAttrs.valueCodeValue == item.option_code) {
                    
                    // update checked option
                    optionChecked(item.option_code, groupData, allData, curAttrs.valueCodeValue, isMultiple);
                }
            } else {
                const _code = extractContentsOfBrackets(curAttrs.valueCodeValue);

                // update checked option
                optionChecked(item.option_code, groupData, allData, _code, isMultiple);

            }

            return {
                label: item.option_text,
                listItemLabel: item.option_text + _scoreLabel,
                hasImg: item.option_tag !== '' && item.option_tag !== null ? (item.option_tag.indexOf('[图片]') >= 0 ? true : false) : false,
                value: item.option_code,
                group: item.group_id,
                extends: <><div className="ms-3 d-none" data-has-note={item.option_tag !== null ? extractContentsOfBrackets(item.option_tag).includes('备注') : false} data-name={curAttrs.name + '-note'} id={`radio-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${index}`}><Input
                    controlGroupTextClassName="input-group-text p-0"
                    data-control-index={index}
                    data-row={dyRow}
                    data-section-id={sectionRealId}
                    data-elem-id={elem_id}
                    data-value-note=""
                    data-entry-id={entry_id}
                    data-referencedata-inputnoteid={`referencedata-inputnoteid-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${index}`}
                    iconLeft={curAttrs.isReferenceData ? <>
                        <div className="col-auto">
                            <button 
                                data-referencedata-id={`referencedata-inputnoteid-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${index}`}
                                data-name="reference-data-trigger"
                                tabIndex={-1} 
                                type="button" 
                                className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleReferenceDataPanelShow}
                            >
                                {appearanceConfig ? appearanceConfig.btns.referenceDataLabel : '引用'}
                            </button>
                        </div>
                    </> : null}
                    data-note-score={_score}
                    placeholder={appearanceConfig ? appearanceConfig.others.placeholderNote : '备注'}
                    value={curAttrs.valueNoteValue}
                    name={curAttrs.name + '-note'}
                    onChange={(e: any) => {

                        onChange?.(entry_id, sectionRealId, Number(e.target.dataset.row), elem_id, item.option_text, item.option_code, e.target.value, elem_name, Number(e.target.dataset.noteScore), curAttrs);
                        setValueNoteVal(e.target.value);

                    }}
                /></div></>,
                score: _score,
                hasNote: item.option_tag !== null ? extractContentsOfBrackets(item.option_tag).includes('备注') : false
            };
        };


        if (groupData.length > 0) {
            groupData.forEach((g: any) => {
                groupOptions.push(
                    {
                        "value": g.group_id,
                        "label": g.group_name,
                        "optgroup": allData.filter((v: any) => v.group_id === g.group_id).map((opt: any, i: number) => returnItem(opt, i))
                    }
                );
            });
        } else {
            allData.forEach((opt: any, i: number) => {
                groupOptions.push(returnItem(opt, i));
            });
        }



        // update score for "radio" and "multiple checkboxes"
        //------
        const resScore = allData.filter((v: any) => v.checked == true).map((k: any) => k.option_score);
        const _score = calcTotalScore(resScore, curAttrs);
        setElemTotalScore(_score);
        


        // update selected options
        //------
        setItemSelected(allData.map((v: any) => v.option_code));

        // update checked options data
        //------
        setOptionsList(optionsFormat(groupData, allData));


        //
        return groupOptions;
    };


    function initEntryFieldsData() {

        if (currentValueData && typeof currentValueData[0] !== 'undefined') {

            setEntryFieldsData((prevState: any[]) => {

                const { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs } = currentValueData[0];
                const _curData = {
                    elemId: elemId,
                    data: { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs }
                }

                let _allData = [...prevState, _curData];
                _allData = _allData.reverse().filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.elemId === item.elemId)));


                return _allData;
            });

        }

    }


    async function initElemProperties() {

        const getElemPropertiesRes =  await fetchPost('elem/GetElemProperty', {
            elem_id: Number(elem_id)
        });

        const getElemProperties = getElemPropertiesRes.elem_property;

        if (typeof getElemProperties === 'undefined') return;

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
            value_length,  // 当类型为 DEC时，它作为小数点位数
            value_min,//dec
            value_max,//dec
            value_valid,
            value_init,
            value_text,
            value_code,
            value_code_system,

            value_list,
            value_option,
        } = getElemProperties;
        

        const __REQUIRED = elemTag.includes('必填');
        const __REQUIRED_SELECT = elemTag.includes('必选');
        const __SINGLE_SELECT = elemTag.includes('单选');
        const __MULTIPLE_SELECT = elemTag.includes('多选');
        const __MULTIPLE_CHECKBOXES = elemTag.includes('多选展开') && elemTag.includes('多选');
        const __MULTIPLE_CHECKBOXES_OPT_BREAK = elemTag.includes('多选选项换行展示');
        const __MULTIPLE_SELECT_HAS_BREAK = elemTag.includes('多选带换行');
        const __MULTIPLE_SELECT_HAS_NUM = elemTag.includes('多选带序号');
        const __MULTIPLE_SELECT_HAS_SPLIT = elemTag.includes('多选带分隔符');
        const __RADIO_SELECT = elemTag.includes('单选展开') && elemTag.includes('单选');
        const __CUSTOM_SELECT = elemTag.includes('下拉框') && elemTag.includes('单选');
        const __LIVESEARCH_SELECT = elemTag.includes('即时下拉框') && elemTag.includes('单选');
        const __RADIO_SELECT_OPT_BREAK = elemTag.includes('单选选项换行展示');
        const __TEXTAREA = elemTag.includes('多行');
        const __READONLY = elemTag.includes('只读');
        const __REFERENCE_DATA = elemTag.includes('引用');
        const __ROW_INPUT = elemTag.includes('标题单行');


        const __DATE = value_type === 'DATE';
        const __DATETIME = value_type === 'DATETIME';
        const __TIME = value_type === 'TIME';
        const __BOOL = value_type === 'BOOL';
        const __BOOLNOTE = value_type === 'BOOL_NOTE';
        const __BOOLNOTE_UNCHECKED = value_type === 'BOOL0_NOTE';
        const __BOOLNOTE_CHECKED = value_type === 'BOOL1_NOTE';



        let _defaultValue = Array.isArray(currentValueData) ? currentValueData[0]?.value : value_text;
        let _defaultValueCode = Array.isArray(currentValueData) ? currentValueData[0]?.valueCode : value_code;
        const _defaultValueNote = Array.isArray(currentValueData) ? currentValueData[0]?.valueNote : '';
        const _min = isNaN(parseFloat(value_min)) ? undefined : parseFloat(value_min);
        const _max = isNaN(parseFloat(value_max)) ? undefined : parseFloat(value_max);
        const _optionsEnabled = fieldExist(value_option) ? false : true;



        //++++++++++++++++++++++++++++++++++++++++++++++++
        // options  start
        //++++++++++++++++++++++++++++++++++++++++++++++++
        let getElemOptions: any[] = [];
        let getElemOptionsGroup: any[] = [];
        
        if (_optionsEnabled && (__SINGLE_SELECT || __MULTIPLE_SELECT)) {

            const getElemOptionsRes = await fetchPost('elem/GetElemOptionList', {
                expand_item: true,  //展开引用项目， 让代码系统：dict 和 代码：字典名，可以自动替换
                elem_id: Number(elem_id),
                elem_version: 0 //0=current, >0:先查在线库，再查a库
            });

            getElemOptions = typeof getElemOptionsRes.row_list === 'undefined' ? [] : getElemOptionsRes.row_list;

            const existGroup = getElemOptions.some((item: any) => item.group_id !== null && item.group_id > 0);
            if (existGroup) {
                const getElemOptionsGroupRes = await fetchPost('elem/GetElemOptionGroupList', {
                    elem_id: Number(elem_id)
                });
                getElemOptionsGroup = typeof getElemOptionsGroupRes.row_list === 'undefined' ? [] : getElemOptionsGroupRes.row_list;
            }

            

            // group has other items
            if (getElemOptionsGroup.length > 0) {
                const groupHasOtherItems = getElemOptions.some((v: any) => (v.group_id == 0) );
                if (groupHasOtherItems) {
                    getElemOptionsGroup.push(
                        {
                            "group_id": 0,
                            "elem_id": elem_id,
                            "group_name": appearanceConfig ? appearanceConfig.others.otherGroupLabel : '其它',
                            "sort_no": "99999999"
                        }
                    );
                }
            }
        }
        //++++++++++++++++++++++++++++++++++++++++++++++++
        // options  end
        //++++++++++++++++++++++++++++++++++++++++++++++++


        

        // update "checkbox value"
        if (value_type === 'BOOL' || value_type === 'BOOL_NOTE' || value_type === 'BOOL0_NOTE' || value_type === 'BOOL1_NOTE') setCheckboxVal(_defaultValue);



        // update "default value" if "database value" is empty
        if (initValueEnabled || (sectionIndex == initVar.sectionIndex && initVar.dyNum > 0)) {
            if (
                (_defaultValue === '' || typeof _defaultValue === 'undefined') &&
                (typeof value_text !== 'undefined' && value_text !== '' && value_text != null)
            ) {
                _defaultValue = value_text;
            }

            if (
                (_defaultValueCode === '' || typeof _defaultValueCode === 'undefined') &&
                (typeof value_code !== 'undefined' && value_code !== '' && value_code != null)
            ) {
                _defaultValueCode = value_code;
            }

        }

        // update "input value" if "default value" is empty
        if (!__RADIO_SELECT && !__MULTIPLE_CHECKBOXES) {
            if (_defaultValue === '' || typeof _defaultValue === 'undefined') _defaultValue = _defaultValueCode;
        }
  
        // update "input value" if "default value" only has "value code"
        if (__MULTIPLE_CHECKBOXES) { // for mutiple checkboxes
            if (_defaultValueCode !== '' && typeof _defaultValueCode !== 'undefined' && _defaultValueCode != null) {
                _defaultValue = getElemOptions.map((item: any) => {


                    if ((extractContentsOfBrackets(_defaultValueCode) as any).includes(item.option_code)) {
                        return `[${item.option_text}]`
                    }
                }).filter(Boolean).join('');
            }
        }

        if (__RADIO_SELECT) { // for radio
            if (_defaultValueCode !== '' && typeof _defaultValueCode !== 'undefined' && _defaultValueCode != null) {
                _defaultValue = getElemOptions.map((item: any) => {
                    if (_defaultValueCode == item.option_code || (extractContentsOfBrackets(_defaultValueCode) as any).includes(item.option_code)) {
                        return `${item.option_text}`
                    }
                }).filter(Boolean).join('');
            }
        }


        // update multiple select
        setAddOptionsResHasBreakBtnChecked(__MULTIPLE_SELECT_HAS_BREAK);
        setAddOptionsResHasNumBtnChecked(__MULTIPLE_SELECT_HAS_NUM);
        setAddOptionsResHasSplitBtnChecked(__MULTIPLE_SELECT_HAS_SPLIT);

        // update options list
        setOptionsList(optionsFormat(getElemOptionsGroup, getElemOptions));


        // update options group list
        setOptionsGroupList(getElemOptionsGroup);
        

        // update sub options list
        setSubOptionLatestValArr((prevState: any) => {
            const _data = Array.from({ length: getElemOptions.length }).fill(_defaultValueNote);
            return _data;
        });


        // control args
        const __attrs = {
            required: __REQUIRED,
            requiredSelect: __REQUIRED_SELECT,
            readOnly: __READONLY,
            name: `field-${sectionIndex}-${elem_id}-${index}`,
            title: curSectionElemTitle !== '' ? curSectionElemTitle : elem_name,
            units: fieldExist(elem_unit) ? undefined : elem_unit,
            length: fieldExist(value_length) ? undefined : value_length,
            min: _min,
            max: _max,
            valueNoteValue: _defaultValueNote,
            valueCodeValue: typeof _defaultValueCode === 'undefined' ? '' : _defaultValueCode,
            maxScore: typeof elem_score !== 'undefined' && elem_score != 0 && elem_score != null ? elem_score : 0,
            isNumber: value_type === 'INT' || value_type === 'DEC' ? true : false,
            isDecimal: value_type === 'DEC' ? true : false,
            isInteger: value_type === 'INT',
            isReferenceData: __REFERENCE_DATA,
        };


        // radio & multiple checkboxes options
        const __radioAndMultipleCheckboxesOptions = optionsForComponentValueFormat(getElemOptionsGroup, getElemOptions, __attrs, __MULTIPLE_SELECT);
        

        // radio & multiple checkboxes default score
        const __radioAndMultipleCheckboxesDefaultScore = optionsScoreFormat(getElemOptions, __attrs, __MULTIPLE_SELECT);



        const updateControlArgs = ($defaultVal: any, $defaultNote: any) => {

            let _dVal = typeof $defaultVal === 'undefined' ? '' : $defaultVal;

       
            
            // time format
            if (__DATETIME) {
                _dVal = _dVal !== '' ? formatDateTime(_dVal) : '';
                
            }
            if (__TIME) {
                _dVal = _dVal !== '' ?  formatTime(_dVal) : '';
            }
            
  
            setData({


                // common
                //--------
                name: __attrs.name,
                title: __attrs.title,
                required: __attrs.required,
                requiredSelect: __attrs.requiredSelect,
                readOnly: __attrs.readOnly,
                entryId: entry_id,
                defaultValue: _dVal,
                defaultValueCode: __attrs.valueCodeValue,
                valueNote: typeof $defaultNote === 'undefined' ? '' : $defaultNote,


                // attributes
                //--------
                attrs: __attrs,


                // options score
                //--------
                optionsHasScore: hasScore(getElemOptions),


                // options
                //--------
                options: _optionsEnabled,


                // options (single)
                //--------
                singleSelect: __SINGLE_SELECT,

                // options (multiple)
                //--------
                multiSelect: __MULTIPLE_SELECT,

                // options (multiple checkboxes)
                //--------
                multipleCheckboxesOptBreak: __MULTIPLE_CHECKBOXES_OPT_BREAK,
                multipleCheckboxesOptionsData: __radioAndMultipleCheckboxesOptions,

                // options (radio)
                //--------
                radioOptBreak: __RADIO_SELECT_OPT_BREAK,
                radioOptionsData: __radioAndMultipleCheckboxesOptions,

                // options group (radio)
                //--------
                radioOptionsGroupData: getElemOptionsGroup.map((item: any, index: number) => {

                    const optData = __radioAndMultipleCheckboxesOptions.filter((v: any) => v.group == item.group_id);

                    return {
                        label: item.group_name,
                        value: item.group_id,
                        score: 0,
                        extends: <><div data-name={__attrs.name + '-radio-group-' + item.group_id} className={`ms-3 d-none app-builder-radio-group-opts__wrapper ${optData.length === 0 ? 'invisible' : ''}`} id={`radio-group-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${item.group_id}`}>

                            <Radio
                                wrapperClassName=""
                                inline={true}
                                data-control-index={index}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={entry_id}
                                data-note-score={0}
                                value={__attrs.valueNoteValue}
                                name={__attrs.name + '-radio-group-item-' + item.group_id}
                                options={optData}
                                onChange={(e: any, val: string, currentData: any, currentIndex: number) => {


                                    const _noteArr = Array.from({ length: getElemOptionsGroup.length }).fill('');
                                    _noteArr[index] = currentData.label;

                                    onChange?.(entry_id, sectionRealId, Number(e.target.dataset.row), elem_id, item.group_name, item.group_name, _noteArr[index], __attrs.title, Number(e.target.dataset.noteScore), __attrs);


                                }}
                            />

                        </div></>,
                    }
                }),


                // options group (mulltiple checkboxes)
                //--------
                multiplecheckboxesOptionsGroupData: getElemOptionsGroup.map((item: any, index: number) => {

                    const optData = __radioAndMultipleCheckboxesOptions.filter((v: any) => v.group == item.group_id);

                    return {
                        label: item.group_name,
                        value: item.group_id,
                        score: 0,
                        extends: <><div data-name={__attrs.name + '-multiplecheckboxes-group-' + item.group_id} className={`ms-3 d-none app-builder-multiplecheckboxes-group-opts__wrapper ${optData.length === 0 ? 'invisible' : ''}`} id={`multiplecheckboxes-group-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${item.group_id}`}>

                            <MultipleCheckboxes
                                inline={true}
                                wrapperClassName=""
                                data-control-index={index}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={entry_id}
                                data-note-score={0}
                                value={__attrs.valueNoteValue}
                                name={__attrs.name + '-multiplecheckboxes-group-item-' + item.group_id}
                                options={optData}
                                onChange={(e: any, value: any, valueStr: any, label: any, labelStr: any, currentData: any) => {

                                    const _noteArr = Array.from({ length: getElemOptionsGroup.length }).fill('');
                                    _noteArr[index] = label.map((v: any) => `[${v}]`).join('');

                                    onChange?.(entry_id, sectionRealId, Number(e.dataset.row), elem_id, item.group_name, item.group_name, _noteArr[index], __attrs.title, Number(e.dataset.noteScore), __attrs);

                                }}

                            />

                        </div></>,
                    }
                }),


                // input attibutes
                //--------
                units: __attrs.units,
                length: __attrs.length,
                min: __attrs.min,
                max: __attrs.max,
                mmEnabled: typeof _min !== 'undefined' && typeof _max !== 'undefined' && _min != 0 && _max != 0,
                decimalPlaces: parseFloat(value_length) === 0 ? '0.1' : `0.${Array.from({length: parseFloat(value_length)}).fill('0').join('').slice(0,-1)}1`,

                // control types
                //--------
                isNumber: __attrs.isNumber,
                isDecimal: __attrs.isDecimal,
                isInteger: __attrs.isInteger,
                isDate: __DATE,
                isDatetime: __DATETIME,
                isTime: __TIME,
                isBool: __BOOL,
                isBoolNote: __BOOLNOTE,
                isBoolNoteUnchecked: __BOOLNOTE_UNCHECKED,
                isBoolNoteChecked: __BOOLNOTE_CHECKED,
                isSelect: __CUSTOM_SELECT,
                isLiveSearch: __LIVESEARCH_SELECT,
                isSingleRowInput: __ROW_INPUT,
                isRadio: __RADIO_SELECT,
                isTextarea: __TEXTAREA,
                isMultipleCheckboxes: __MULTIPLE_CHECKBOXES

            });

         
            // init value note
            setValueNoteVal(__attrs.valueNoteValue);

            // first onChange trigger
            const onChangeParams: any = {
                entryId: entry_id,
                sectionId: sectionRealId,
                rowNo: Number(dyRow),
                elemId: elem_id,
                value: _dVal,
                valueCode: __attrs.valueCodeValue,
                valueNote: __attrs.valueNoteValue,
                elemName: elem_name,
                elemTotalScore: __radioAndMultipleCheckboxesDefaultScore,
                attrs: __attrs
            };


            onChange?.(
                onChangeParams.entryId,
                onChangeParams.sectionId,
                onChangeParams.rowNo,
                onChangeParams.elemId,
                onChangeParams.value,
                onChangeParams.valueCode,
                onChangeParams.valueNote,
                onChangeParams.elemName,
                onChangeParams.elemTotalScore,
                onChangeParams.attrs
            );


            

            // first onChange trigger (if has multiple options with popwin)
            // It will force the text in input and textarea modes to match
            /*
            if (_optionsEnabled) {
                handleAddOptionsResConfirm(undefined, getElemOptions, onChangeParams, __MULTIPLE_SELECT_HAS_BREAK, __MULTIPLE_SELECT_HAS_NUM, __MULTIPLE_SELECT_HAS_SPLIT);
            }
            */


        }
        
      

        // update "default value"
        if (initValueEnabled || (sectionIndex == initVar.sectionIndex && initVar.dyNum > 0)) {

            const initFunc = () => {

                fetchPost('elem/GetVisitInitValue', {
                    visit_id: Number(visitId),
                    baby_id: Number(babyId),
                    entry_id: Number(entry_id),
                    section_id: Number(sectionRealId),
                    row_no: Number(dyRow),
                    elem_id: Number(elem_id),
                    link_name: typeof linkData === 'undefined' || typeof linkData.link_name === 'undefined' ? null : linkData.link_name,
                    link_value: typeof linkData === 'undefined' || typeof linkData.link_value === 'undefined' ? null : Number(linkData.link_value),
                    link_data: typeof linkData === 'undefined' || typeof linkData.link_data === 'undefined' ? null : linkData.link_data,
                    link_tag: typeof linkData === 'undefined' || typeof linkData.link_tag === 'undefined' ? null : linkData.link_tag,
                    link_ext: typeof linkData === 'undefined' || typeof linkData.link_ext === 'undefined' ? null : linkData.link_ext
                }).then((res: any) => {


                    if (res && res.code === 0) {
                        if (res.value_text !== '') {
                            updateControlArgs(res.value_text, res.value_note);
                        } else {
                            updateControlArgs(_defaultValue, __attrs.valueNoteValue);
                        }
                    } else {
                        updateControlArgs(_defaultValue, __attrs.valueNoteValue);
                    }

                })
            };

            if ((sectionIndex == initVar.sectionIndex && initVar.dyNum > 0)) {
                initFunc();
            } else {

                const _actualValueIsEmpty = _defaultValue === '' || typeof _defaultValue === 'undefined';

                if (_actualValueIsEmpty) {
                    initFunc();
                } else {
                    updateControlArgs(_defaultValue, __attrs.valueNoteValue);
                }

            }

        } else {

            updateControlArgs(_defaultValue, __attrs.valueNoteValue);
        }

    }





    //
    function handleEntryModeChange() {
        setEntryMode(true);
        if (entryBtnRef.current !== null) entryBtnRef.current.style.display = 'none';


        // Exposes the save function to client
        onEntry?.(entry_id, sectionRealId, Number(dyRow), elem_id, handleSaveEntryData);

    }

    function handleCancleEntryMode() {
        setEntryMode(false);
        if (entryBtnRef.current !== null) entryBtnRef.current.style.display = 'block';
    }


    function entryCallbackSaveEntryData(inputData: any = undefined) {

        return () => {

            return new Promise((resolve, reject) => {
                setEntryMode(false);
                if (entryBtnRef.current !== null) entryBtnRef.current.style.display = 'inline-block';

                // 
                let _data = inputData;


                // format result of value
                const _entryFieldsData = _data.filter((item: any) => item.data.sectionId != sectionRealId);
                let valueRes: string | null = null;
                valueRes = _entryFieldsData.reverse().map((item: any) => item.data.value).join('');

                // generate value res from GRPC
                const getFieldValues = (key: string) => {
                    return _data.map((item: any, i: number) => item.data[key]).reverse();
                };
                const __arr_section_id: string[] | number[] = getFieldValues('sectionId');
                const __arr_row_no: string[] | number[] = getFieldValues('rowNo');
                const __arr_entry_id: string[] | number[] = getFieldValues('entryId');
                const __arr_elem_id: string[] | number[] = getFieldValues('elemId');
                const __arr_elem_name: string[] = getFieldValues('elemName');
                const __arr_value_text: string[] | number[] = getFieldValues('value');
                const __arr_value_code: string[] = Array.from({ length: _data.length }).fill('') as [];
                const __arr_value_code_system: string[] = Array.from({ length: _data.length }).fill('') as [];

                fetchPost('form/BuildEntryText', {
                    visit_id: Number(visitId),
                    baby_id: Number(babyId),
                    entry_id: Number(data.entryId),
                    row_list: __arr_section_id.map((v: any, i: number) => {


                        if (typeof __arr_elem_name[i] !== 'undefined' && __arr_entry_id[i] == 0) {
                            return {
                                section_id: Number(__arr_section_id[i]),
                                row_no: Number(__arr_row_no[i]),
                                elem_id: Number(__arr_elem_id[i]),
                                elem_name: __arr_elem_name[i],
                                value_text: typeof __arr_value_text[i] !== 'undefined' && __arr_value_text[i] != null ? __arr_value_text[i].toString() : __arr_value_text[i],
                                value_code: __arr_value_code[i],
                                value_code_system: __arr_value_code_system[i]
                            }
                        }

                    }).filter(Boolean)
                }).then((res: any) => {

                    if (res && res.code === 0) {

                        const textRes = res.entry_text;
                        if (textRes && textRes !== '') {
                            setEntryValueRes(textRes);

                            //
                            resolve({
                                entryId: data.entryId,
                                sectionId: sectionRealId,
                                rowNo: dyRow,
                                elemId: elem_id,
                                textRes: textRes
                            });

                            //
                            onChange?.(data.entryId, sectionRealId, Number(dyRow), elem_id, textRes, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                            _entryFieldsData.forEach((item: any) => {
                                const { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs } = item.data;

                                onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
                            });
                        }
                    } else {
                        //
                        resolve(-1);
                    }


                });

            })

        }



    }

    function handleSaveEntryData() {
        setEntryMode(false);
        if (entryBtnRef.current !== null) entryBtnRef.current.style.display = 'inline-block';

        // 
        let _data = entryFieldsData;


        // format result of value
        const _entryFieldsData = _data.filter((item: any) => item.data.sectionId != sectionRealId);
        let valueRes: string | null = null;
        valueRes = _entryFieldsData.reverse().map((item: any) => item.data.value).join('');

        // generate value res from GRPC
        const getFieldValues = (key: string) => {
            return _data.map((item: any, i: number) => item.data[key]).reverse();
        };
        const __arr_section_id: string[] | number[] = getFieldValues('sectionId');
        const __arr_row_no: string[] | number[] = getFieldValues('rowNo');
        const __arr_entry_id: string[] | number[] = getFieldValues('entryId');
        const __arr_elem_id: string[] | number[] = getFieldValues('elemId');
        const __arr_elem_name: string[] = getFieldValues('elemName');
        const __arr_value_text: string[] | number[] = getFieldValues('value');
        const __arr_value_code: string[] = Array.from({ length: _data.length }).fill('') as [];
        const __arr_value_code_system: string[] = Array.from({ length: _data.length }).fill('') as [];



        fetchPost('form/BuildEntryText', {
            visit_id: Number(visitId),
            baby_id: Number(babyId),
            entry_id: Number(data.entryId),
            row_list: __arr_section_id.map((v: any, i: number) => {


                if (typeof __arr_elem_name[i] !== 'undefined' && __arr_entry_id[i] == 0) {
                    return {
                        section_id: Number(__arr_section_id[i]),
                        row_no: Number(__arr_row_no[i]),
                        elem_id: Number(__arr_elem_id[i]),
                        elem_name: __arr_elem_name[i],
                        value_text: typeof __arr_value_text[i] !== 'undefined' && __arr_value_text[i] != null ? __arr_value_text[i].toString() : __arr_value_text[i],
                        value_code: __arr_value_code[i],
                        value_code_system: __arr_value_code_system[i]
                    };
                }


            }).filter(Boolean)
        }).then((res: any) => {



            const textRes = res.entry_text;
            if (textRes && textRes !== '') {
                setEntryValueRes(textRes);

                //
                onChange?.(data.entryId, sectionRealId, Number(dyRow), elem_id, textRes, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                _entryFieldsData.forEach((item: any) => {
                    const { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs } = item.data;
                    onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
                });
            }

        });

        // if (valueRes !== '') {
        //     setEntryValueRes(valueRes);


        //     //
        //     onChange?.(data.entryId, sectionRealId, Number(dyRow), elem_id, valueRes, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
        //     _entryFieldsData.forEach((item: any) => {
        //         const { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs } = item.data;
        //         onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
        //     });
        // }

    }

    //
    function handleReferenceDataPanelShow(e: React.MouseEvent) {
        const tid = (e.currentTarget as any).dataset.referencedataId;
        setReferenceDataTargetId(tid);
        setReferenceDataEditEnterStatus(true);

    }

    function handleSelectShow() {
        setShowOptionsList(true);

    }
    function handleCustomSelectShow(e: React.MouseEvent) {
        setShowCustomSelectOptionsList(true);


        // window position
        setTimeout(() => {
            popwinPosInit();
        }, 0);
    }


    function handleCustomSelectHide() {
        setShowCustomSelectOptionsList(false);
    }

    function handleGlobalCustomSelectHide(event: any) {
        if (event.target.closest(`.app-builder-optionslist__wrapper`) === null) {
            handleCustomSelectHide();
        }
    }


   

    function handleSelectAll() {

        let resOptItems = optionsFlat(optionsList);
        resOptItems = resOptItems.filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.option_code === item.option_code)));

        const hasCheckedOption = resOptItems.some((v: any) => v.checked == true);

        resOptItems.forEach((item: any) => {
            if (hasCheckedOption) {
                item.checked = false;
            } else {
                item.checked = true;
            }
        });


        // update score
        //------
        const resScore = resOptItems.filter((v: any) => v.checked == true).map((k: any) => k.option_score);
        const _score = calcTotalScore(resScore, data.attrs);
        setElemTotalScore(_score);


        // update selected options
        //------
        setItemSelected(resOptItems.map((v: any) => v.option_code));

        // update checked options data
        //------
        setOptionsList(optionsFormat(optionsGroupList, resOptItems));


    }

    function handleSelectSingleChecked(e: React.MouseEvent) {
        e.preventDefault();

        const _title = (e.currentTarget as any).dataset.optionText;
        const _code = (e.currentTarget as any).dataset.optionCode;
        const _oldScore = Number((e.currentTarget as any).dataset.optionScore);

        
        setData((prevState: any) => {

            if (currentOptionsTextObjRef.current) {

                // update score
                const _score = calcTotalScore([_oldScore], data.attrs);
                setElemTotalScore(_score);

                //
                onChange?.(data.entryId, sectionRealId, Number(currentOptionsTextObjRef.current.dataset.row), elem_id, _title, _code, getValueNote(valueNoteWrapperRef.current), elem_name, _score, data.attrs);
            }

            return {
                ...prevState,
                defaultValue: _title
            }
        });

        optionsListCloseFunc?.();

        // close custom select
        handleCustomSelectHide();

    }

    function handleSelectMultipleChecked(e: React.MouseEvent) {
        e.preventDefault();

        const _val = (e.currentTarget as any).dataset.optionCode;
        let resOptItems = optionsFlat(optionsList);
        resOptItems = resOptItems.filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.option_code === item.option_code)));

        resOptItems.forEach((item: any) => {
            if (typeof item.checked === 'undefined') item.checked = false;
            const _checkedRes = !item.checked;

            if (item.option_code == _val) {
                item.checked = _checkedRes;
            }
        });


        // update score
        //------
        const resScore = resOptItems.filter((v: any) => v.checked == true).map((k: any) => k.option_score);
        const _score = calcTotalScore(resScore, data.attrs);
        setElemTotalScore(_score);


        // update selected options
        //------
        setItemSelected(resOptItems.map((v: any) => v.option_code));

        // update checked options data
        //------
        setOptionsList(optionsFormat(optionsGroupList, resOptItems));


    }


    function handleAddOptionsResHasBreak() {
        setAddOptionsResHasBreakBtnChecked((prevState: boolean) => !prevState);
    }
    function handleAddOptionsResHasNum() {
        setAddOptionsResHasNumBtnChecked((prevState: boolean) => !prevState);
    }
    function handleAddOptionsResHasSplit() {
        setAddOptionsResHasSplitBtnChecked((prevState: boolean) => !prevState);
    }

    
    function handleAddOptionsResConfirm(e: React.MouseEvent | undefined, allData: any[] | undefined = undefined, onChangeParams: any = undefined, hasBreak: boolean | undefined = undefined, hasNum: boolean | undefined = undefined, hasSplit: boolean | undefined = undefined) {

        const _hasBreak = typeof hasBreak === 'undefined' ? addOptionsResHasBreakBtnChecked : hasBreak;
        const _hasNum = typeof hasNum === 'undefined' ? addOptionsResHasNumBtnChecked : hasNum;
        const _hasSplit = typeof hasSplit === 'undefined' ? addOptionsResHasSplitBtnChecked : hasSplit;


        const _text = optionsMergeStr(typeof allData === 'undefined' ? optionsList : allData, selectMultipleSplitBtnRef.current, _hasBreak, _hasNum, _hasSplit).text;
        const _code = optionsMergeStr(typeof allData === 'undefined' ? optionsList : allData, selectMultipleSplitBtnRef.current, _hasBreak, _hasNum, _hasSplit).code;


        //
        if (typeof onChangeParams === 'undefined') {
            setData((prevState: any) => {

                if (currentOptionsTextObjRef.current) {
                    onChange?.(data.entryId, sectionRealId, Number(currentOptionsTextObjRef.current.dataset.row), elem_id, _text, _code, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                }
                return {
                    ...prevState,
                    defaultValue: _text
                }
            });

        } else {
            const { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs } = onChangeParams;
            setData((prevState: any) => {

                if (currentOptionsTextObjRef.current) {
                    onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);
                }
                return {
                    ...prevState,
                    defaultValue: _text
                }
            });

        }
        

        optionsListCloseFunc?.();

        // close custom select
        handleCustomSelectHide();
    }

    function rowInputData() {
        return {
            title: data.isSingleRowInput && data.title != 'null' ? <>
                <div className="col-auto">
                    {data.title}

                    {/* SCORE */}
                    {data.optionsHasScore ? <>
                        <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.before : null}
                            {data.attrs.maxScore !== 0 && data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.totalLabel : null}{data.attrs.maxScore}<span className="d-inline-block text-muted mx-1">{appearanceConfig ? appearanceConfig.scoreParentheses.divideLine : null}</span></> : null}
                            {data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.obtainedLabel : null}<span className="fw-bold px-1 rounded">{elemTotalScore}</span></> : null}
                            {appearanceConfig ? appearanceConfig.scoreParentheses.after : null}</small>
                    </> : null}
                    {/* /SCORE */}
                </div>
            </> : null,
            tool: data.isSingleRowInput && (data.entryId > 0 || (data.entryId > 0 && entryMode) || (data.attrs.isReferenceData && (data.isTextarea || (!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked)))) || (data.options && data.singleSelect && !data.isLiveSearch && !data.multiSelect && !data.isRadio) || (data.options && data.multiSelect && !data.isRadio && !data.isMultipleCheckboxes)) ? <>
                <div className="row app-builder-singerow-input-group align-items-center gx-1">

                    {/* ENTRY BUTTON */}
                    {data.entryId > 0 ? <>
                        <div className="col-auto border-end">
                            <button ref={entryBtnRef} tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleEntryModeChange}>{entryText(appearanceConfig ? appearanceConfig.btns.entryLabel : '结构化', false)}</button>
                        </div>
                    </> : null}

                    {data.entryId > 0 && entryMode ? <>
                        <div className="col-auto border-end app-builder-section__entry-btn">
                            <button tabIndex={-1} type="button" className="btn btn-outline-secondary btn-sm px-2 py-0 me-2" onClick={handleCancleEntryMode}>{appearanceConfig ? appearanceConfig.btns.entryCancelLabel : '取消'}</button>
                            <button tabIndex={-1} type="button" className="btn btn-primary btn-sm px-2 py-0 me-3" onClick={handleSaveEntryData}>{appearanceConfig ? appearanceConfig.btns.entryConfirmLabel : '确定'}</button>
                        </div>
                    </> : null}
                    {/* /ENTRY BUTTON */}


                    {/* REFERENCE DATA BUTTON */}
                    {data.attrs.isReferenceData && (data.isTextarea || (!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked))) ? <>
                        <div className="col-auto border-end">
                            <button
                                data-referencedata-id={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                data-name="reference-data-trigger"
                                tabIndex={-1}
                                type="button"
                                className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleReferenceDataPanelShow}
                            >
                                {referenceDataText(appearanceConfig ? appearanceConfig.btns.referenceDataLabel : '引用', false)}
                            </button>
                        </div>
                    </> : null}
                    {/* /REFERENCE DATA BUTTON */}



                    {/* OPTIONS BUTTON */}
                    {data.options && data.singleSelect && !data.isLiveSearch && !data.multiSelect && !data.isRadio ? <>
                        <div className="col-auto border-end">
                            {data.isSelect ? <>
                                <button ref={customSelectBtnRef} tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleCustomSelectShow}>{optionsText(appearanceConfig ? appearanceConfig.btns.optSingleLabel : '单选', false, showCustomSelectOptionsList)}</button>
                            </> : <>
                                <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleSelectShow}>{optionsTextNoIcon(appearanceConfig ? appearanceConfig.btns.optSingleLabel : '单选')}</button>
                            </>}
                        </div>
                    </> : null}
                    {/* /OPTIONS BUTTON */}



                    {/* OPTIONS (MULTIPLE) BUTTON */}
                    {data.options && data.multiSelect && !data.isRadio && !data.isMultipleCheckboxes ? <>
                        <div className="col-auto border-end">
                            <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleSelectShow}>{optionsTextNoIcon(appearanceConfig ? appearanceConfig.btns.optMultipleLabel : '多选')}</button>
                        </div>
                    </> : null}
                    {/* /OPTIONS (MULTIPLE) BUTTON */}


                </div>

            </> : null
        }

    }


    function popwinPosInit(showAct: boolean = true) {
        if (customselectWrapper.current === null || customSelectBtnRef.current === null) return;

        // update modal position
        const _modalRef: any = customselectWrapper.current;
        const _triggerRef: any = customSelectBtnRef.current;

        // console.log(getAbsolutePositionOfStage(_triggerRef));

        if (_modalRef === null) return;

        const { x, y, width, height } = getAbsolutePositionOfStage(_triggerRef);
        const _triggerBox = _triggerRef.getBoundingClientRect();
        let targetPos = '';


        // STEP 1:
        //-----------
        // Detect position
        if (window.innerHeight - _triggerBox.top > 100) {
            targetPos = 'bottom';
        } else {
            targetPos = 'top';
        }


        // STEP 2:
        //-----------
        // Adjust position
        if (targetPos === 'top') {
            _modalRef.style.left = x + 'px';
            //_modalRef.style.top = y - POS_OFFSET - (listContentRef.current.clientHeight) - 2 + 'px';
            _modalRef.style.top = 'auto';
            _modalRef.style.bottom = (window.innerHeight - _triggerBox.top) + POS_OFFSET + 2 + 'px';
            _modalRef.style.setProperty('position', 'fixed', 'important');
            _modalRef.classList.add('pos-top');
        }

        if (targetPos === 'bottom') {
            _modalRef.style.left = x + 'px';
            _modalRef.style.bottom = 'auto';
            _modalRef.style.top = y + height + POS_OFFSET + 'px';
            _modalRef.style.setProperty('position', 'absolute', 'important');
            _modalRef.classList.remove('pos-top');
        }





        // STEP 3:
        //-----------
        // Determine whether it exceeds the far right or left side of the screen
        const _modalContent = _modalRef;
        const _modalBox = _modalContent.getBoundingClientRect();
        if (typeof _modalContent.dataset.offset === 'undefined') {

            if (_modalBox.right > window.innerWidth) {
                const _modalOffsetPosition = _modalBox.right - window.innerWidth + EXCEEDED_SIDE_POS_OFFSET;
                _modalContent.dataset.offset = _modalOffsetPosition;
                _modalContent.style.marginLeft = `-${_modalOffsetPosition}px`;
                // console.log('_modalPosition: ', _modalOffsetPosition)
            }


            if (_modalBox.left < 0) {
                const _modalOffsetPosition = Math.abs(_modalBox.left) + EXCEEDED_SIDE_POS_OFFSET;
                _modalContent.dataset.offset = _modalOffsetPosition;
                _modalContent.style.marginLeft = `${_modalOffsetPosition}px`;
                // console.log('_modalPosition: ', _modalOffsetPosition)
            }


        }



    }


    function singeLineTitlt() {
        return <>
           
            {/* TITLE */}
            <div className="col-auto">
                {data.title !== '' && data.title != 'null' ? <div className="app-builder-section__item__label">
                    <span className="app-builder-section__item__text">
                        {data.title}

                        {/* SCORE */}
                        {data.optionsHasScore ? <>
                            <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.before : null}
                                {data.attrs.maxScore !== 0 && data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.totalLabel : null}{data.attrs.maxScore}<span className="d-inline-block text-muted mx-1">{appearanceConfig ? appearanceConfig.scoreParentheses.divideLine : null}</span></> : null}
                                {data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.obtainedLabel : null}<span className="fw-bold px-1 rounded">{elemTotalScore}</span></> : null}
                                {appearanceConfig ? appearanceConfig.scoreParentheses.after : null}</small>
                        </> : null}
                        {/* /SCORE */}

                    </span>
                </div> : null}

            </div>
            {/* TITLE */}

        </>;
    }


    function handleScrollEvent() {
        handleCustomSelectHide();
    }



    useEffect(() => {

  
        // Manual initialization
        if ((sectionIndex == initVar.sectionIndex && initVar.dyNum > 0)) {

            // !!!IMPORTANT
            // Set changes to data to ensure that rerendering of the form component is triggered
            setData((prevState: any) => {
                return {
                    ...prevState,
                    defaultValue: ''
                }
            });

            setTimeout(() => {
                initElemProperties();
                initEntryFieldsData();
            }, 150);
        }

        //
        if (!firstFetch) {
            initElemProperties();
            initEntryFieldsData();

            setFirstFetch(true);
        }

        //--------------
        document.removeEventListener('pointerdown', handleGlobalCustomSelectHide);
        document.addEventListener('pointerdown', handleGlobalCustomSelectHide);
        document.addEventListener('touchstart', handleGlobalCustomSelectHide);

        // // Add function to the element that should be used as the scrollable area.
        // //--------------
        // window.removeEventListener('scroll', windowScrollUpdate);
        // window.removeEventListener('touchmove', windowScrollUpdate);
        // window.addEventListener('scroll', windowScrollUpdate);
        // window.addEventListener('touchmove', windowScrollUpdate);
        // windowScrollUpdate();


        return () => {
            document.removeEventListener('pointerdown', handleGlobalCustomSelectHide);

            // window.removeEventListener('scroll', windowScrollUpdate);
            // window.removeEventListener('touchmove', windowScrollUpdate);

        }


    }, [initVar]);



    return (
        <>



            {/* /////////////////////////////////////////////// */}
            {/* ////////////////////// COPY DATA /////////////// */}
            {/* /////////////////////////////////////////////// */}
            <input ref={copyDivRef} tabIndex={-1} type="text" className="position-fixed opacity-0" style={{pointerEvents: 'none'}} value={copyData} />



            {/* /////////////////////////////////////////////// */}
            {/* ////////////////////// PURE TEXT /////////////// */}
            {/* /////////////////////////////////////////////// */}
            {elem_note !== '' && elem_note !== null && elem_note !== 'null' ? <>
                <div className="app-builder-puretext__wrapper" dangerouslySetInnerHTML={{
                    __html: elem_note
                }}></div>
            </> : null}



            {data && (elem_note === '' || elem_note === null || elem_note === 'null') ? <>


                {/* /////////////////////////////////////////////// */}
                {/* /////////////////////////////////////////////// */}
                {(!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) ? <>
                    <div className="row">

                        
                        {data.isSingleRowInput && (
                            data.isLiveSearch ||
                            data.isDate ||
                            data.isDatetime ||
                            data.isTime ||
                            data.isRadio ||
                            data.isTextarea ||
                            data.isMultipleCheckboxes ||
                            (!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked))
                        ) ? null : <>

                            {/* TITLE */}
                            <div className="col">
                                {data.title !== '' && data.title != 'null' ? <div className="app-builder-section__item__label">
                                    <span className="app-builder-section__item__text">
                                        {data.title}

                                        {/* SCORE */}
                                        {data.optionsHasScore ? <>
                                            <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.before : null}
                                                {data.attrs.maxScore !== 0 && data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.totalLabel : null}{data.attrs.maxScore}<span className="d-inline-block text-muted mx-1">{appearanceConfig ? appearanceConfig.scoreParentheses.divideLine : null}</span></> : null}
                                                {data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.obtainedLabel : null}<span className="fw-bold px-1 rounded">{elemTotalScore}</span></> : null}
                                                {appearanceConfig ? appearanceConfig.scoreParentheses.after : null}</small>
                                        </> : null}
                                        {/* /SCORE */}

                                    </span>
                                </div> : null}

                            </div>
                            {/* TITLE */}

                           {/* REFERENCE DATA BUTTON */}
                           {data.attrs.isReferenceData && (data.isTextarea || (!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked))) ? <>
                                <div className="col-auto">
                                    <button
                                        data-referencedata-id={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                        data-name="reference-data-trigger"
                                        tabIndex={-1}
                                        type="button"
                                        className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleReferenceDataPanelShow}
                                    >
                                        {referenceDataText(appearanceConfig ? appearanceConfig.btns.referenceDataLabel : '引用')}
                                    </button>
                                </div>
                            </> : null}
                            {/* /REFERENCE DATA BUTTON */}



                            {/* OPTIONS BUTTON */}
                            {data.options && data.singleSelect && !data.isLiveSearch && !data.multiSelect && !data.isRadio ? <>
                                <div className="col-auto">
                                    <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleSelectShow}>{optionsText(appearanceConfig ? appearanceConfig.btns.optSingleLabel : '单选')}</button>
                                </div>
                            </> : null}
                            {/* /OPTIONS BUTTON */}



                            {/* OPTIONS (MULTIPLE) BUTTON */}
                            {data.options && data.multiSelect && !data.isRadio && !data.isMultipleCheckboxes ? <>
                                <div className="col-auto">
                                    <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleSelectShow}>{optionsText(appearanceConfig ? appearanceConfig.btns.optMultipleLabel : '多选')}</button>
                                </div>
                            </> : null}
                            {/* /OPTIONS (MULTIPLE) BUTTON */}


                            {/* ENTRY BUTTON */}
                            {data.entryId > 0 ? <>
                                <div className="col-auto">
                                    <button ref={entryBtnRef} tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none d-flex align-items-center px-0 py-0 m-0" onClick={handleEntryModeChange}>{entryText(appearanceConfig ? appearanceConfig.btns.entryLabel : '结构化')}</button>
                                </div>
                            </> : null}

                            {data.entryId > 0 && entryMode ? <>
                                <div className="col-auto app-builder-section__entry-btn">
                                    <button tabIndex={-1} type="button" className="btn btn-outline-secondary btn-sm px-2 py-0 me-2" onClick={handleCancleEntryMode}>{appearanceConfig ? appearanceConfig.btns.entryCancelLabel : '取消'}</button>
                                    <button tabIndex={-1} type="button" className="btn btn-primary btn-sm px-2 py-0 me-3" onClick={handleSaveEntryData}>{appearanceConfig ? appearanceConfig.btns.entryConfirmLabel : '确定'}</button>
                                </div>
                            </> : null}
                            {/* /ENTRY BUTTON */}


                        </>}
                        



                    </div>

                </> : null}


                <div>

                    {data.entryId > 0 && entryMode ? <>

                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////////////// ENTRY ////////////////// */}
                        {/* /////////////////////////////////////////////// */}

                        <FormClient
                            actRef={actRef}
                            appearanceConfig={appearanceConfig}
                            defaultValue={orginalDefaultData}
                            emrId={emrId}
                            visitId={visitId}
                            linkData={linkData}
                            babyId={babyId}
                            formId={0}
                            entryId={data.entryId}
                            onEntry={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, entryFuncs: any) => {
                                onEntry?.(entryId, sectionId, rowNo, elemId, entryFuncs);
                            }}
                            onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any) => {
                                setEntryFieldsData((prevState: any[]) => {
                                    const _curData = {
                                        elemId: elemId,
                                        data: { entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs }
                                    }

                                    let _allData = [...prevState, _curData];
                                    _allData = _allData.reverse().filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.elemId === item.elemId)));

                                    // Exposes the save function to client
                                    onEntry?.(data.entryId, sectionId, rowNo, elemId, entryCallbackSaveEntryData(_allData));


                                    return _allData;
                                });

                                onChange?.(entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs);


                            }}
                        />


                    </> : <>



                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////////////// CHECKBOX ////////////////// */}
                        {/* /////////////////////////////////////////////// */}
                        {data.isBool || data.isBoolNote || data.isBoolNoteUnchecked || data.isBoolNoteChecked ? <>

                            <div className="row align-items-center">

                                <div className="col-auto">
                                    <Checkbox
                                        wrapperClassName='position-relative mb-2'
                                        data-row={dyRow}
                                        data-section-id={sectionRealId}
                                        data-elem-id={elem_id}
                                        data-entry-id={data.entryId}
                                        data-value-note={valueNoteVal}
                                        value={checkboxVal as string}
                                        name={data.name}
                                        required={data.required}
                                        data-required-title={data.title}
                                        onChange={(e: any, val: boolean) => {
                                            onChange?.(data.entryId, sectionRealId, Number(e.target.dataset.row), elem_id, val ? 1 : 0, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                                            setCheckboxVal(val ? 1 : 0);

                                            if (data.isBoolNoteUnchecked && valueNoteWrapperRef.current) {
                                                valueNoteWrapperRef.current.style.display = !val ? 'block' : 'none';
                                            }

                                            if (data.isBoolNoteChecked && valueNoteWrapperRef.current) {
                                                valueNoteWrapperRef.current.style.display = val ? 'block' : 'none';
                                            }

                                        }}
                                        label={data.title}
                                        checked={data.defaultValue == 1 ? true : false}
                                    />
                                </div>

                                {data.isBoolNote || data.isBoolNoteUnchecked || data.isBoolNoteChecked ? <>
                                    <div className="col-auto" ref={valueNoteWrapperRef} style={{ display: data.isBoolNote ? 'block' : (data.defaultValue == 1 ? (data.isBoolNoteChecked ? 'block' : 'none') : (data.isBoolNoteChecked ? 'none' : 'block')) }}>
                                        <Input
                                            wrapperClassName='position-relative mb-2'
                                            controlGroupTextClassName="input-group-text p-0"
                                            data-row={dyRow}
                                            data-section-id={sectionRealId}
                                            data-elem-id={elem_id}
                                            data-value-note=""
                                            data-entry-id={data.entryId}
                                            data-referencedata-inputnoteid={`referencedata-inputnoteid-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                            iconLeft={data.attrs.isReferenceData ? <>
                                                <div className="col-auto">
                                                    <button 
                                                        data-referencedata-id={`referencedata-inputnoteid-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                                        data-name="reference-data-trigger"
                                                        tabIndex={-1} 
                                                        type="button" 
                                                        className="btn btn-link btn-sm text-decoration-none me-1 d-flex align-items-center py-0" onClick={handleReferenceDataPanelShow}
                                                    >
                                                        {appearanceConfig ? appearanceConfig.btns.referenceDataLabel : '引用'}
                                                    </button>
                                                </div>
                                            </> : null}
                                            placeholder={appearanceConfig ? appearanceConfig.others.placeholderNote : '备注'}
                                            value={data.valueNote}
                                            onChange={(e: any) => {
                                                onChange?.(data.entryId, sectionRealId, Number(e.target.dataset.row), elem_id, checkboxVal, data.defaultValueCode, e.target.value, elem_name, elemTotalScore, data.attrs);
                                                setValueNoteVal(e.target.value);


                                            }}
                                        />
                                    </div>
                                </> : null}

                            </div>

                        </> : null}


                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////////////// DATE ////////////////// */}
                        {/* /////////////////////////////////////////////// */}

                        {data.isDate ? <>


                            <Date
                                wrapperClassName='position-relative mb-2'
                                ref={currentOptionsTextObjRef}
                                popupRef={datePopupRef}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={data.entryId}
                                localization="zh_CN"
                                value={data.defaultValue}
                                name={data.name}
                                required={data.required}
                                readOnly={data.requiredSelect ? true : data.readOnly}
                                units={data.units}
                                iconLeft={rowInputData().title}
                                iconRight={rowInputData().tool}
                                type="date"
                                data-required-title={data.title}
                                onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean) => {
                                    onChange?.(data.entryId, sectionRealId, Number(input.dataset.row), elem_id, (dateRes !== null && typeof dateRes !== 'string' ? dateRes.date : dateRes), data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);

                                }}
                                onChangeDate={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}
                                onChangeToday={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}

                            />
                        </> : null}

                        {data.isDatetime ? <>

                            <Date
                                wrapperClassName='position-relative mb-2'
                                ref={currentOptionsTextObjRef}
                                popupRef={datePopupRef}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={data.entryId}
                                localization="zh_CN"
                                value={data.defaultValue}
                                name={data.name}
                                required={data.required}
                                readOnly={data.requiredSelect ? true : data.readOnly}
                                units={data.units}
                                iconLeft={rowInputData().title}
                                iconRight={rowInputData().tool}
                                type="datetime-local"
                                data-required-title={data.title}
                                onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean) => {
                                 
                                    let _valRes = dateRes !== null && typeof dateRes !== 'string' ? dateRes.res : dateRes;
                                    _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                    if (_valRes === ':00') _valRes = '';

                                    onChange?.(data.entryId, sectionRealId, Number(input.dataset.row), elem_id, _valRes, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);

                                }}
                                truncateSeconds
                                onChangeMinutes={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}
                                onChangeToday={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}
                            />


                        </> : null}

                        {data.isTime ? <>

                            <Date
                                wrapperClassName='position-relative mb-2'
                                ref={currentOptionsTextObjRef}
                                popupRef={datePopupRef}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={data.entryId}
                                localization="zh_CN"
                                value={data.defaultValue}
                                name={data.name}
                                required={data.required}
                                readOnly={data.requiredSelect ? true : data.readOnly}
                                units={data.units}
                                iconLeft={rowInputData().title}
                                iconRight={rowInputData().tool}
                                type="time"
                                data-required-title={data.title}
                                onChange={(input: HTMLInputElement, dateRes: any, isValidDate: boolean) => {

                                    let _valRes = dateRes !== null && typeof dateRes !== 'string' ? `${dateRes.hours}:${dateRes.minutes}:00` : dateRes;
                                    _valRes = _valRes.split(':').length === 3 ? _valRes : `${_valRes}:00`;
                                    if (_valRes === ':00') _valRes = '';

                                    
                                    onChange?.(data.entryId, sectionRealId, Number(input.dataset.row), elem_id, _valRes, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);

                                }}
                                onlyTime
                                truncateSeconds
                                onChangeMinutes={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}
                                onChangeToday={(dateRes: any) => {
                                    // close popup
                                    if (datePopupRef.current) datePopupRef.current.close();
                                }}
                            />
                        </> : null}


                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////////////// INPUT ////////////////// */}
                        {/* /////////////////////////////////////////////// */}

                        {!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) ? <>

                            <Input
                                wrapperClassName='position-relative mb-2'
                                ref={currentOptionsTextObjRef}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={data.entryId}
                                data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                type={data.isNumber ? 'number' : 'text'}
                                step={data.isDecimal ? data.decimalPlaces : null}
                                value={entryValueRes !== null ? entryValueRes : data.defaultValue}
                                name={data.name}
                                required={data.required}
                                readOnly={data.requiredSelect ? true : data.readOnly}
                                units={data.units}
                                iconLeft={rowInputData().title}
                                iconRight={rowInputData().tool}
                                placeholder={`${data.requiredSelect ? `${appearanceConfig ? appearanceConfig.others.selectLabel : '请选择'}` : ''}${data.mmEnabled ? `${data.min} ~ ${data.max}` : ''}`}
                                maxLength={data.length}
                                // min={data.min}
                                // max={data.max}
                                data-required-title={data.title}
                                onChange={(e: any) => {


                                    // If there is an option, but it is not in expanded (for radio & multiple checkboxes)
                                    let _valueCode = data.defaultValueCode;
                                    if (data.options && (!data.isRadio && !data.isMultipleCheckboxes)) {
                                        _valueCode = '';
                                    }

                                    
                                    //
                                    onChange?.(data.entryId, sectionRealId, Number(e.target.dataset.row), elem_id, e.target.value, _valueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);

                                }}
                                onInputCallback={(e) => {
                                    // only integer
                                    if (data.isNumber && data.isInteger) {
                                        const newVal = e.target.value.replace(/[^0-9]/g, '');
                                        return parseFloat(newVal);
                                    }

                                }}
                            />


                        </> : null}



                            {/* /////////////////////////////////////////////// */}
                            {/* ////////////////////// LIVE SEARCH ////////////////// */}
                            {/* /////////////////////////////////////////////// */}

                            {data.isLiveSearch ? <>


                                <LiveSearch
                                    wrapperClassName='position-relative mb-2'
                                    ref={currentOptionsTextObjRef}
                                    data-row={dyRow}
                                    data-section-id={sectionRealId}
                                    data-elem-id={elem_id}
                                    data-value-note=""
                                    data-entry-id={data.entryId}
                                    data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                    value={entryValueRes !== null ? entryValueRes : data.defaultValue}
                                    name={data.name}
                                    required={data.required}
                                    readOnly={data.requiredSelect ? true : data.readOnly}
                                    placeholder={`${data.requiredSelect ? `${appearanceConfig ? appearanceConfig.others.selectLabel : '请选择'}` : ''}${data.mmEnabled ? `${data.min} ~ ${data.max}` : ''}`}
                                    units={data.units}
                                    iconLeft={rowInputData().title}
                                    iconRight={rowInputData().tool}
                                    maxLength={data.length}
                                    data-required-title={data.title}
                                    hideIcon
                                    autoShowOptions
                                    options={data.radioOptionsData}
                                    onChange={(input: HTMLInputElement, comData: any[], selectedData: any) => {
                                        const changeValue = selectedData !== '' ? selectedData.value : input.value;


                                        // If there is an option, but it is not in expanded (for radio & multiple checkboxes)
                                        let _valueCode = data.defaultValueCode;
                                        if (data.options && (!data.isRadio && !data.isMultipleCheckboxes)) {
                                            _valueCode = '';
                                        }

                                        //
                                        onChange?.(data.entryId, sectionRealId, Number(input.dataset.row), elem_id, changeValue, _valueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);

                                    }}
                                />



                            </> : null}




                        {/* /////////////////////////////////////////////// */}
                        {/* ///////////////// Multiple Checkboxes ///////// */}
                        {/* /////////////////////////////////////////////// */}
                        {data.isMultipleCheckboxes ? <>

                            {/* ROW */}
                            <div className={`row ${data.isSingleRowInput ? 'g-2' : 'g-0'}`}>

                                {data.isSingleRowInput ? <>{singeLineTitlt()}</> : null}


                                <div className="col-auto">

                                    <MultipleCheckboxes
                                        wrapperClassName='position-relative mb-2'
                                        groupWrapperClassName="border rounded p-2 mb-2"
                                        groupLabelClassName="fw-bold mb-2"
                                        inline={data.multipleCheckboxesOptBreak ? false : true}
                                        data-row={dyRow}
                                        data-section-id={sectionRealId}
                                        data-elem-id={elem_id}
                                        data-value-note=""
                                        data-entry-id={data.entryId}
                                        required={data.required}
                                        disabled={data.readOnly}
                                        name={data.name}
                                        value={data.defaultValueCode}
                                        options={data.multipleCheckboxesOptionsData}
                                        onChange={(e: any, value: any, valueStr: any, label: any, labelStr: any, currentData: any, dataCollection: any) => {
                             

                                            // update score
                                            const resScore = dataCollection.map((v: any) => v.score);
                                            const _score = calcTotalScore(resScore, data.attrs);
                                            setElemTotalScore(_score);


                                            onChange?.(data.entryId, sectionRealId, Number(e.dataset.row), elem_id, labelStr, valueStr, getValueNote(valueNoteWrapperRef.current), elem_name, Number(_score), data.attrs);
                                        }}
                                    

                                    />
                                </div>

                            </div>
                            {/* /ROW */}


           
                        </> : null}



                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////// Radio ( With Sub Options) ///// */}
                        {/* /////////////////////////////////////////////// */}

                        {data.isRadio ? <>


                            {/* ROW */}
                            <div className={`row ${data.isSingleRowInput ? 'g-2' : 'g-0'}`}>

                                {data.isSingleRowInput ? <>{singeLineTitlt()}</> : null}

                                <div className="col-auto">

                                    <Radio
                                        wrapperClassName='position-relative mb-2'
                                        groupWrapperClassName="border rounded p-2 mb-2"
                                        groupLabelClassName="fw-bold mb-2"
                                        inline={data.radioOptBreak ? false : true}
                                        data-row={dyRow}
                                        data-section-id={sectionRealId}
                                        data-elem-id={elem_id}
                                        data-value-note={valueNoteVal}
                                        data-entry-id={data.entryId}
                                        required={data.required}
                                        disabled={data.readOnly}
                                        value={data.defaultValueCode}
                                        name={data.name}
                                        options={data.radioOptionsData}
                                        onChange={(e: any, val: string, currentData: any, currentIndex: number) => {


                                            let _radioValueNote = '';

                                            // display note
                                            data.radioOptionsData.forEach((item: any, i: number) => {
                                                const el = document.getElementById(`radio-${entry_id}-${sectionRealId}-${elem_id}-${Number(e.target.dataset.row)}-${i}`);
                                                if (el !== null) el.classList.add('d-none');
                                            });

                                            const el = document.getElementById(`radio-${entry_id}-${sectionRealId}-${elem_id}-${Number(e.target.dataset.row)}-${currentIndex}`);
                                            _radioValueNote = e.target.closest('.form-check').querySelector(`[name="${data.name + '-note'}"]`).value;
                                            
                                            if (currentData.hasNote) {
                                                
                                                if (el !== null) el.classList.remove('d-none');
                                            } else {
                                                _radioValueNote = '';
                                            }

                                           


                                            // update score
                                            let _oldScore = currentData.score;
                                            const _score = calcTotalScore([_oldScore], data.attrs);
                                            setElemTotalScore(_score);

                                            // With Sub Options
                                            setSubOptionCom(<MultipleCheckboxes
                                                inline
                                                wrapperClassName=""
                                                key={'sub-options-' + val}
                                                data-row={dyRow}
                                                data-section-id={sectionRealId}
                                                data-elem-id={elem_id}
                                                data-value-note=""
                                                data-entry-id={data.entryId}
                                                name={data.name}
                                                value={subOptionLatestValArr[currentIndex]}
                                                fetchFuncAsync={ElemService}
                                                fetchFuncMethod="getElemOptionSubList"
                                                fetchFuncMethodParams={[elem_id, val]}
                                                fetchCallback={(res) => {


                                                    const _optionsHasScore = hasScore(res);

                                                    const formattedData = res.map((item: any, index: number) => {

                                                        const _scoreLabel = _optionsHasScore && typeof item.sub_score !== 'undefined' && item.sub_score != 0 && item.sub_score != null ? `<small class="text-muted">${appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}${appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}${item.sub_score}${appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small>` : '';
                                                        let _score = _optionsHasScore && typeof item.sub_score !== 'undefined' && item.sub_score != 0 && item.sub_score != null ? item.sub_score : 0;

                                                        if (_score > data.attrs.maxScore && data.attrs.maxScore > 0) {
                                                            _score = data.attrs.maxScore;
                                                        }

                                                        return {
                                                            label: item.sub_text,
                                                            listItemLabel: item.sub_text + _scoreLabel,
                                                            value: item.sub_code,
                                                            score: _score,
                                                        }
                                                    });
                                                    return formattedData;
                                                }}
                                                onChange={(e: any, value: any, valueStr: any, label: any, labelStr: any, subCurrentData: any) => {


                                                    // update sub options list
                                                    setSubOptionLatestValArr((prevState: any) => {
                                                        const _data = prevState;
                                                        _data[currentIndex] = labelStr;
                                                        return _data;
                                                    });


                                                    onChange?.(entry_id, sectionRealId, Number(e.dataset.row), elem_id, currentData.label, currentData.value, labelStr, elem_name, _score, data.attrs);



                                                }}
                                                onFetch={(res) => {

                                                    // Clear the "value note" assigned during initialization
                                                    setSubOptionLatestValArr((prevState: any) => {
                                                        const _data = prevState;
                                                        if (res.length === 0) _data[currentIndex] = '';
                                                        return _data;
                                                    });

                                                    //
                                                    setHasSubOption(res.length > 0 ? true : false);
                                                }}


                                            />);


                                            // Prevent initialization "value note" errors
                                            setTimeout(() => {
                                                onChange?.(data.entryId, sectionRealId, Number(e.target.dataset.row), elem_id, currentData.label, currentData.value, !currentData.hasNote ? subOptionLatestValArr[currentIndex] : _radioValueNote, elem_name, _score, data.attrs);
                                            }, 150);


                                        }}
                                        onLoad={(comData: any, defaultVal: any, root: any) => {
                                            const _flatData = optionsFlat(comData);
                                            const _curVal = _flatData.filter((v: any) => v.value == defaultVal)[0];
                                            const _curValIndex = _flatData.findIndex((v: any) => v.value == defaultVal);
                                            const _allData = JSON.parse(root.dataset.controlsCusAttrs);
                                            const _curItemData = _allData[_curValIndex];

                                 
                                            if (root) {

                                                const _valueNoteArr: string[] = [];
                                                [].slice.call(root.querySelectorAll(`[type="radio"]`)).forEach((el: HTMLInputElement, i: number) => {
                                                    if (_flatData[i].value === defaultVal && _flatData[i].hasNote) {
                                                        _valueNoteArr[i] = data.valueNote;
                                                    } else {
                                                        _valueNoteArr[i] = '';
                                                    }

                                                });

                                                // update sub options list
                                                setSubOptionLatestValArr(_valueNoteArr);


                                                [].slice.call(root.querySelectorAll(`[type="radio"]`)).forEach((el: HTMLInputElement, i: number) => {

                                                    const currentIndex = i;

                                                    if (_flatData[i].value === defaultVal && _flatData[i].hasNote) {
                                                        (el.closest('.form-check') as HTMLDivElement)?.querySelector('[data-name]')?.classList.remove('d-none');
                                                    } else {
                                                        (el.closest('.form-check') as HTMLDivElement)?.querySelector('[data-name]')?.classList.add('d-none');
                                                    }

                                                    // sub options
                                                    if (_flatData[i].value === defaultVal) {


                                                        setSubOptionCom(<MultipleCheckboxes
                                                            inline
                                                            wrapperClassName=""
                                                            key={'sub-options-' + defaultVal}
                                                            data-row={dyRow}
                                                            data-section-id={sectionRealId}
                                                            data-elem-id={elem_id}
                                                            data-value-note=""
                                                            data-entry-id={data.entryId}
                                                            name={data.name}
                                                            value={subOptionLatestValArr[currentIndex]}
                                                            fetchFuncAsync={ElemService}
                                                            fetchFuncMethod="getElemOptionSubList"
                                                            fetchFuncMethodParams={[elem_id, defaultVal]}
                                                            fetchCallback={(res) => {

                                                                const _optionsHasScore = hasScore(res);

                                                                const formattedData = res.map((item: any, index: number) => {

                                                                    const _scoreLabel = _optionsHasScore && typeof item.sub_score !== 'undefined' && item.sub_score != 0 && item.sub_score != null ? `<small class="text-muted">${appearanceConfig ? appearanceConfig.scoreParentheses.optBefore : null}${appearanceConfig ? appearanceConfig.scoreParentheses.optLabel : null}${item.sub_score}${appearanceConfig ? appearanceConfig.scoreParentheses.optAfter : null}</small>` : '';
                                                                    let _score = _optionsHasScore && typeof item.sub_score !== 'undefined' && item.sub_score != 0 && item.sub_score != null ? item.sub_score : 0;

                                                                    if (_score > data.attrs.maxScore && data.attrs.maxScore > 0) {
                                                                        _score = data.attrs.maxScore;
                                                                    }

                                                                    return {
                                                                        label: item.sub_text,
                                                                        listItemLabel: item.sub_text + _scoreLabel,
                                                                        value: item.sub_code,
                                                                        score: _score,
                                                                    }
                                                                });


                                                                return formattedData;
                                                            }}
                                                            onChange={(e: any, value: any, valueStr: any, label: any, labelStr: any, subCurrentData: any) => {

                                                                // update sub options list
                                                                setSubOptionLatestValArr((prevState: any) => {
                                                                    const _data = prevState;
                                                                    _data[currentIndex] = labelStr;
                                                                    return _data;
                                                                });

                                                                onChange?.(entry_id, sectionRealId, Number(e.dataset.row), elem_id, data.defaultValue, data.defaultValueCode, labelStr, elem_name, _flatData[i].score, data.attrs);


                                                            }}
                                                            onFetch={(res) => {

                                                                // Clear the "value note" assigned during initialization
                                                                setSubOptionLatestValArr((prevState: any) => {
                                                                    const _data = prevState;
                                                                    if (res.length === 0) _data[currentIndex] = '';
                                                                    return _data;
                                                                });

                                                                //
                                                                setHasSubOption(res.length > 0 ? true : false);
                                                            }}


                                                        />);

                                                    }

                                                    // get file from option 
                                                    if (data.options) {
                                                        if (_flatData[i].hasImg) {
                                                            getOptionFile(elem_id, _flatData[i].value).then((fileContent: any) => {
                                                                if (fileContent.length > 0) {
                                                                    const _label = el.nextElementSibling;

                                                                    if (_label !== null) {
                                                                        el.classList.add('float-none', 'm-0', 'opacity-0');
                                                                        _label.classList.add('d-block');
                                                                        _label.closest('.d-inline-block')?.classList.add('text-center');
                                                                        (el.closest('.form-check') as HTMLDivElement).style.marginLeft = '-2.5rem';
                                                                        (el.closest('.radio__wrapper') as HTMLDivElement).style.marginLeft = '2.5rem';
                                                                        _label.innerHTML = `<div class="app-builder-section__item__img"><img src="${fileContent}"</div>`;
                                                                    }
                                                                }
                                                            });
                                                        }

                                                    }


                                                });
                                            }

                                        }}
                                    />


                                    {/* SUB OPTIONS LIST */}
                                    <div className={`app-builder-multiplecheckboxes-group__wrapper gap-set ${hasSubOption ? '' : 'd-none'}`}>
                                        {subOptionCom}
                                    </div>
                                    {/* /SUB OPTIONS LIST */}

                                </div>

                            </div>
                            {/* /ROW */}

                        </> : null}


                
                        {/* /////////////////////////////////////////////// */}
                        {/* ////////////////////// TEXTAREA ////////////////// */}
                        {/* /////////////////////////////////////////////// */}
                        {data.isTextarea ? <>

                            <Textarea
                                wrapperClassName='position-relative mb-2'
                                ref={currentOptionsTextObjRef}
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note=""
                                data-entry-id={data.entryId}
                                data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                value={entryValueRes !== null ? entryValueRes : data.defaultValue}
                                name={data.name}
                                iconLeft={rowInputData().title}
                                iconRight={rowInputData().tool}
                                required={data.required}
                                readOnly={data.requiredSelect ? true : data.readOnly}
                                placeholder={`${data.requiredSelect ? `${appearanceConfig ? appearanceConfig.others.selectLabel : '请选择'}` : ''}${data.mmEnabled ? `${data.min} ~ ${data.max}` : ''}`}
                                data-required-title={data.title}
                                rows={3}
                                onChange={(e: any) => {


                                    // If there is an option, but it is not in expanded (for radio & multiple checkboxes)
                                    let _valueCode = data.defaultValueCode;
                                    if (data.options && (!data.isRadio && !data.isMultipleCheckboxes)) {
                                        _valueCode = '';
                                    }

                                    //
                                    onChange?.(data.entryId, sectionRealId, Number(e.target.dataset.row), elem_id, autopCustom(autop(e.target.value)), _valueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                                }}
                                onChangeCallback={(e: any) => {
                                    if (e.target.value.length > data.length && typeof data.length !== 'undefined') {
                                        return e.target.value.slice(0, data.length);
                                    }
                                }}
                                autoSize
                            />

                        </> : null}


                    </>}




                </div>



                {/* /////////////////////////////////////////////// */}
                {/* ////////////////////// SELECT ////////////////// */}
                {/* /////////////////////////////////////////////// */}

                {data.isSelect ? <>
                    {/* SELECT OPTIONS LIST */}
                    <RootPortal show={true} containerClassName="CustomSelect">
                        <div ref={customselectWrapper} className={`app-builder-optionslist__wrapper app-builder-optionslist--customselect shadow rounded bg-body ${showCustomSelectOptionsList ? 'active' : ''}`} style={{
                                    position: 'absolute',
                                    zIndex: 9999,
                                    top: '100%',
                                    left: 0,
                                    display: 'none',
                                    width: '250px',
                            }}>
                            <ModalOptions
                                appearanceConfig={appearanceConfig}
                                sectionRealId={sectionRealId}
                                visitId={visitId}
                                elemId={elem_id}
                                elemName={elem_name}
                                dyRow={dyRow}
                                data={data}
                                optionsGroupList={optionsGroupList}
                                optionsList={optionsList}
                                addOptionsResHasBreakBtnChecked={addOptionsResHasBreakBtnChecked}
                                addOptionsResHasNumBtnChecked={addOptionsResHasNumBtnChecked}
                                addOptionsResHasSplitBtnChecked={addOptionsResHasSplitBtnChecked}
                                selectMultipleSplitBtnRef={selectMultipleSplitBtnRef}
                                handleAddOptionsResHasBreak={handleAddOptionsResHasBreak}
                                handleSelectMultipleChecked={handleSelectMultipleChecked}
                                handleSelectAll={handleSelectAll}
                                handleAddOptionsResHasNum={handleAddOptionsResHasNum}
                                handleAddOptionsResHasSplit={handleAddOptionsResHasSplit}
                                handleAddOptionsResConfirm={handleAddOptionsResConfirm}
                                handleSelectSingleChecked={handleSelectSingleChecked}
                                optionsListCloseFunc={optionsListCloseFunc}

                            />
                        </div>

                    </RootPortal>


                    {/* /SELECT OPTIONS LIST */}
                </> : null}





            </> : <>


                    {/* //////////////////////////////////////////////////// */}
                    {/* ////////////////////// ONLY  INPUT ////////////////// */}
                    {/* //////////////////////////////////////////////////// */}
                    {(elem_note === '' || elem_note === null || elem_note === 'null') ? <>
               
                        <Input
                            wrapperClassName='position-relative mb-2'
                            ref={currentOptionsTextObjRef}
                            data-row={dyRow}
                            data-section-id={sectionRealId}
                            data-elem-id={elem_id}
                            data-value-note=""
                            data-entry-id={0}
                            type='text'
                            value=''
                            readOnly
                        />

                    </> : null}


            </>}

            {/* SELECT OPTIONS LIST */}
            <ModalDialog
                modalBodyClassName="p-0"
                show={showOptionsList}
                maxWidth="850px"
                minHeight="175px"
                heading={elem_name}
                triggerClassName=""
                triggerContent=""
                onOpen={(e, closewin) => {
                    setOptionsListCloseFunc(() => closewin);
                }}
                onClose={(e) => {

                    // Modifying React State can ensure that the window content is updated in real time
                    setTimeout(() => {
                        setShowOptionsList(false);
                    }, 350);


                }}
            >

                <div className="app-builder-optionslist__wrapper">
                    <ModalOptions
                        appearanceConfig={appearanceConfig}
                        sectionRealId={sectionRealId}
                        visitId={visitId}
                        elemId={elem_id}
                        elemName={elem_name}
                        dyRow={dyRow}
                        data={data}
                        optionsGroupList={optionsGroupList}
                        optionsList={optionsList}
                        addOptionsResHasBreakBtnChecked={addOptionsResHasBreakBtnChecked}
                        addOptionsResHasNumBtnChecked={addOptionsResHasNumBtnChecked}
                        addOptionsResHasSplitBtnChecked={addOptionsResHasSplitBtnChecked}
                        selectMultipleSplitBtnRef={selectMultipleSplitBtnRef}
                        handleAddOptionsResHasBreak={handleAddOptionsResHasBreak}
                        handleSelectMultipleChecked={handleSelectMultipleChecked}
                        handleSelectAll={handleSelectAll}
                        handleAddOptionsResHasNum={handleAddOptionsResHasNum}
                        handleAddOptionsResHasSplit={handleAddOptionsResHasSplit}
                        handleAddOptionsResConfirm={handleAddOptionsResConfirm}
                        handleSelectSingleChecked={handleSelectSingleChecked}
                        optionsListCloseFunc={optionsListCloseFunc}
                        

                    />
                </div>


            </ModalDialog>
            {/* /SELECT OPTIONS LIST */}


            {/* REFERENCE DATA */}
            <div className="app-builder-reference-data__wrapper">
                <ReferenceData 
                    controlId={referenceDataTargetId}
                    appearanceConfig={appearanceConfig}
                    sectionRealId={sectionRealId}
                    visitId={visitId}
                    elemId={elem_id}
                    dyRow={dyRow}
                    editEnterStatus={referenceDataEditEnterStatus}
                    closeEnterEv={setReferenceDataEditEnterStatus}
                    dataCallback={(curControlId: string, val: any, rowVal: any) => {

                        const _val = htmlToPlain(val);

                        const _control = document.querySelector(`[data-referencedata-inputid="${curControlId}"]`) as HTMLFormElement;
                        if (_control !== null) {
                            setData((prevState: any) => {
                                return {
                                    ...prevState,
                                    defaultValue: _val
                                }
                            });
                            _control.value = _val;

                            onChange?.(data.entryId, sectionRealId, Number(rowVal), elem_id, _val, data.defaultValueCode, getValueNote(valueNoteWrapperRef.current), elem_name, elemTotalScore, data.attrs);
                            
                            //
                            setCopyData(_val);

                            setTimeout(() => {
                                copyToClipboard(_val, copyDivRef.current as any);
                            }, 0);
                            

                        }

                        // note
                        const _controlNote = document.querySelector(`[data-referencedata-inputnoteid="${curControlId}"]`) as HTMLFormElement;
                        if (_controlNote !== null) {
                            setData((prevState: any) => {
                                return {
                                    ...prevState,
                                    valueNote: _val
                                }
                            });
                            _controlNote.value = _val;

                            onChange?.(data.entryId, sectionRealId, Number(rowVal), elem_id, data.defaultValue, data.defaultValueCode, _val, elem_name, elemTotalScore, data.attrs);
                        }

                    }}
                />
            </div>
            {/* /REFERENCE DATA */}



        </>
    );

}


export default Item;

