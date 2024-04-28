import React, { useState, useEffect, useRef, useImperativeHandle } from "react";


// API
import { fetchPost } from '../../../config/request';
import {
    ElemService,
} from '../../../services/services-api';


import { extractContentsOfBrackets } from '../../../utils/extract';
import { autop, reverseAutop } from '../../../utils/autop';
import { autopCustom } from '../../../utils/autop-custom';




// bootstrap components
import Radio from 'funda-ui/Radio';
import Input from 'funda-ui/Input';
import Checkbox from 'funda-ui/Checkbox';
import Textarea from 'funda-ui/Textarea';
import ModalDialog from 'funda-ui/ModalDialog';
import MultipleCheckboxes from 'funda-ui/MultipleCheckboxes';
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


import ReferenceData from '../../reference-data';
import ModalOptions from '../../modal-options';



const Item = (props: any) => {

    const {
        popupRef,
        actRef,
        appearanceConfig,
        orginalDefaultData,
        currentRow,
        dyRow,
        hasDefaultValue,
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
        onChange
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


    const curSectionElemTitle: any = elem_name;

    const initValueEnabled = typeof emrId === 'undefined' || emrId == null || emrId <= 0 ? true : false;
    const currentValueData = typeof defaultValue !== 'undefined' ? defaultValue.filter((item: any) => item.elemId == elem_id && item.rowNo == currentRow) : undefined;



    const elemTag = extractContentsOfBrackets(elem_tag);
    const [data, setData] = useState<any>(null);

    const currentOptionsTextObjRef = useRef<HTMLFormElement>(null);
    const datePopupRef = useRef<HTMLFormElement>(null);
    const valueNoteWrapperRef = useRef<HTMLDivElement>(null);
    const selectMultipleSplitBtnRef = useRef<HTMLInputElement>(null);

    // copy text
    const copyDivRef = useRef<HTMLInputElement>(null);
    const [copyData, setCopyData] = useState<string>('');

    // score
    const initScore = currentValueData && typeof currentValueData[0] !== 'undefined' && typeof currentValueData[0].elemTotalScore !== 'undefined' ? Number(currentValueData[0].elemTotalScore) : 0;
    const [elemTotalScore, setElemTotalScore] = useState<number>(initScore);


    // checkbox
    const [checkboxVal, setCheckboxVal] = useState<string | number>(0);
    const [valueNoteVal, setValueNoteVal] = useState<string>('');


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



    // exposes the following methods
    useImperativeHandle(
        popupRef,
        () => ({
            closeCustomSelect: () => {

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
                        <div className="col-auto gx-0">
                            <button 
                                data-referencedata-id={`referencedata-inputnoteid-${entry_id}-${sectionRealId}-${elem_id}-${dyRow}-${index}`}
                                data-name="reference-data-trigger"
                                tabIndex={-1} 
                                type="button" 
                                className="btn btn-link btn-sm text-decoration-none me-1 d-flex align-items-center py-0" onClick={handleReferenceDataPanelShow}
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


        let _defaultValue = hasDefaultValue ? currentValueData[0]?.value : value_text;
        let _defaultValueCode = hasDefaultValue ? currentValueData[0]?.valueCode : value_code;
        const _defaultValueNote = Array.isArray(currentValueData) ? currentValueData[0]?.valueNote : '';
        const _min = isNaN(parseFloat(value_min)) ? undefined : parseFloat(value_min);
        const _max = isNaN(parseFloat(value_max)) ? undefined : parseFloat(value_max);
        const _optionsEnabled = fieldExist(value_option) ? false : true;

       
        //++++++++++++++++++++++++++++++++++++++++++++++++
        // time format
        //++++++++++++++++++++++++++++++++++++++++++++++++
        if (__DATETIME) {
            _defaultValue = _defaultValue !== '' ? formatDateTime(_defaultValue) : '';
        }
        if (__TIME) {
            _defaultValue = _defaultValue !== '' ?  formatTime(_defaultValue) : '';
        }


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
        if (initValueEnabled) {
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
            name: `field-${sectionIndex}-${elem_id}-${index}-${dyRow}[]`,
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
                isMultipleCheckboxes: __MULTIPLE_CHECKBOXES,

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
        if (initValueEnabled) {

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

            const _actualValueIsEmpty = (_defaultValue === '' || typeof _defaultValue === 'undefined') && dyRow != '%i%';
            if (_actualValueIsEmpty) {
                initFunc();
            } else {
                updateControlArgs(_defaultValue, __attrs.valueNoteValue);
            }

        } else {

            updateControlArgs(_defaultValue, __attrs.valueNoteValue);
        }



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
    }

    useEffect(() => {
        initElemProperties();
    }, []);


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
                    <div className="d-flex justify-content-end z-3 position-absolute mt-1 end-0 z-3">

                                
                        {/* REFERENCE DATA BUTTON */}
                        {data.attrs.isReferenceData && (data.isTextarea || (!data.isLiveSearch && !data.isRadio && !data.isTextarea && !data.isMultipleCheckboxes && (!data.isDate && !data.isDatetime && !data.isTime) && (!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked))) ? <>
                            <div className="col-auto gx-0">
                                <button
                                    data-referencedata-id={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                    data-name="reference-data-trigger"
                                    tabIndex={-1}
                                    type="button"
                                    className="btn btn-link btn-sm text-decoration-none me-1 d-flex align-items-center py-0" onClick={handleReferenceDataPanelShow}
                                >
                                    {referenceDataText(appearanceConfig ? appearanceConfig.btns.referenceDataLabel : '引用')}
                                </button>
                            </div>
                        </> : null}
                        {/* /REFERENCE DATA BUTTON */}



                        {/* OPTIONS BUTTON */}
                        {data.options && data.singleSelect && !data.isLiveSearch && !data.multiSelect && !data.isRadio ? <>
                            <div className="col-auto gx-0">
                                <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none me-1 d-flex align-items-center py-0" onClick={handleSelectShow}>{optionsText(appearanceConfig ? appearanceConfig.btns.optSingleLabel : '单选')}</button>
                            </div>
                        </> : null}
                        {/* /OPTIONS BUTTON */}



                        {/* OPTIONS (MULTIPLE) BUTTON */}
                        {data.options && data.multiSelect && !data.isRadio && !data.isMultipleCheckboxes ? <>
                            <div className="col-auto gx-0">
                                <button tabIndex={-1} type="button" className="btn btn-link btn-sm text-decoration-none me-1 d-flex align-items-center py-0" onClick={handleSelectShow}>{optionsText(appearanceConfig ? appearanceConfig.btns.optMultipleLabel : '多选')}</button>
                            </div>
                        </> : null}
                        {/* /OPTIONS (MULTIPLE) BUTTON */}

                    </div>

                </> : null}



                {/* /////////////////////////////////////////////// */}
                {/* ////////////////////// CHECKBOX ////////////////// */}
                {/* /////////////////////////////////////////////// */}
                {data.isBool || data.isBoolNote || data.isBoolNoteUnchecked || data.isBoolNoteChecked ? <>

                    <div className="row align-items-center">

                        <div className="col-auto">
                            <Checkbox
                                wrapperClassName="position-relative"
                                data-row={dyRow}
                                data-section-id={sectionRealId}
                                data-elem-id={elem_id}
                                data-value-note={valueNoteVal}
                                data-entry-id={data.entryId}
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
                                label=""
                                checked={data.defaultValue == 1 ? true : false}
                            />
                        </div>

                        {data.isBoolNote || data.isBoolNoteUnchecked || data.isBoolNoteChecked ? <>
                            <div className="col-auto" ref={valueNoteWrapperRef} style={{ display: data.isBoolNote ? 'block' : (data.defaultValue == 1 ? (data.isBoolNoteChecked ? 'block' : 'none') : (data.isBoolNoteChecked ? 'none' : 'block')) }}>


                                <Input
                                    controlGroupTextClassName="input-group-text p-0"
                                    wrapperClassName="position-relative"
                                    data-row={dyRow}
                                    data-section-id={sectionRealId}
                                    data-elem-id={elem_id}
                                    data-value-note=""
                                    data-entry-id={data.entryId}
                                    data-referencedata-inputnoteid={`referencedata-inputnoteid-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                                    iconLeft={data.attrs.isReferenceData ? <>
                                        <div className="col-auto gx-0">
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
                        wrapperClassName="position-relative"
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
                        wrapperClassName="position-relative"
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
                        wrapperClassName="position-relative"
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

                        ref={currentOptionsTextObjRef}
                        wrapperClassName={`${(!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) && data.options ? 'position-relative app-hasselection-input-textarea' : 'position-relative'}`}
                        data-row={dyRow}
                        data-section-id={sectionRealId}
                        data-elem-id={elem_id}
                        data-value-note=""
                        data-entry-id={data.entryId}
                        data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                        type={data.isNumber ? 'number' : 'text'}
                        step={data.isDecimal ? data.decimalPlaces : null}
                        value={data.defaultValue}
                        name={data.name}
                        required={data.required}
                        readOnly={data.requiredSelect ? true : data.readOnly}
                        data-required-title={data.title}
                        units={data.units}
                        placeholder={`${data.requiredSelect ? `${appearanceConfig ? appearanceConfig.others.selectLabel : '请选择'}` : ''}${data.mmEnabled ? `${data.min} ~ ${data.max}` : ''}`}
                        maxLength={data.length}
                        // min={data.min}
                        // max={data.max}
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
                        wrapperClassName={`${(!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) && data.options ? 'position-relative app-hasselection-input-textarea' : 'position-relative'}`}
                        ref={currentOptionsTextObjRef}
                        data-row={dyRow}
                        data-section-id={sectionRealId}
                        data-elem-id={elem_id}
                        data-value-note=""
                        data-entry-id={data.entryId}
                        data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                        value={data.defaultValue}
                        name={data.name}
                        required={data.required}
                        readOnly={data.requiredSelect ? true : data.readOnly}
                        placeholder={`${data.requiredSelect ? `${appearanceConfig ? appearanceConfig.others.selectLabel : '请选择'}` : ''}${data.mmEnabled ? `${data.min} ~ ${data.max}` : ''}`}
                        units={data.units}
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

                    <MultipleCheckboxes
                        groupWrapperClassName="border-bottom p-2 mb-2"
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
                </> : null}



                {/* /////////////////////////////////////////////// */}
                {/* ////////////// Radio ( With Sub Options) ///// */}
                {/* /////////////////////////////////////////////// */}

                {data.isRadio ? <>

                    <Radio
                        groupWrapperClassName="border-bottom p-2 mb-2"
                        groupLabelClassName="fw-bold mb-2"
                        wrapperClassName="position-relative"
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
                            // !!!Note: It is different from non-dynamic forms
                            data.radioOptionsData.forEach((item: any, i: number) => {
                                const el = document.getElementById(`radio-${entry_id}-${sectionRealId}-${elem_id}-${Number(e.target.dataset.row)}-${i}`);
                                if (el !== null) el.classList.add('d-none');
                            });

                            const el: any = document.getElementById(`radio-${entry_id}-${sectionRealId}-${elem_id}-${Number(e.target.dataset.row)}-${currentIndex}`);

                            _radioValueNote = el.querySelector(`[data-value-note]`).value;

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
                    <div className={`app-builder-multiplecheckboxes-group__wrapper ${hasSubOption ? '' : 'd-none'}`}>
                        {subOptionCom}
                    </div>
                    {/* /SUB OPTIONS LIST */}


                </> : null}




                {/* /////////////////////////////////////////////// */}
                {/* ////////////////////// TEXTAREA ////////////////// */}
                {/* /////////////////////////////////////////////// */}
                {data.isTextarea ? <>

                    <Textarea
                        ref={currentOptionsTextObjRef}
                        wrapperClassName={`${(!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) && data.options ? 'position-relative app-hasselection-input-textarea' : 'position-relative'}`}
                        data-row={dyRow}
                        data-section-id={sectionRealId}
                        data-elem-id={elem_id}
                        data-value-note=""
                        data-entry-id={data.entryId}
                        data-referencedata-inputid={`referencedata-input-${data.entryId}-${sectionRealId}-${elem_id}-${dyRow}`}
                        value={data.defaultValue}
                        name={data.name}
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





                {/* /////////////////////////////////////////////// */}
                {/* /////////////////////////////////////////////// */}
                {(!data.isBool && !data.isBoolNote && !data.isBoolNoteUnchecked && !data.isBoolNoteChecked) ? <>

                    {/* SCORE */}
                    {data.optionsHasScore ? <>
                        <div>
                            <small className="text-muted">{appearanceConfig ? appearanceConfig.scoreParentheses.before : null}
                                {data.attrs.maxScore !== 0 && data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.totalLabel : null}{data.attrs.maxScore}<span className="d-inline-block text-muted mx-1">{appearanceConfig ? appearanceConfig.scoreParentheses.divideLine : null}</span></> : null}
                                {data.optionsHasScore ? <>{appearanceConfig ? appearanceConfig.scoreParentheses.obtainedLabel : null}<span className="fw-bold px-1 rounded">{elemTotalScore}</span></> : null}
                                {appearanceConfig ? appearanceConfig.scoreParentheses.after : null}</small>
                        </div>
                    </> : null}
                    {/* /SCORE */}


                </> : null}




            </> : <>

                {/* //////////////////////////////////////////////////// */}
                {/* ////////////////////// ONLY  INPUT ////////////////// */}
                {/* //////////////////////////////////////////////////// */}
                {(elem_note === '' || elem_note === null || elem_note === 'null') ? <>
                    <Input
                        ref={currentOptionsTextObjRef}
                        wrapperClassName='position-relative'
                        data-row={dyRow}
                        data-section-id={sectionRealId}
                        data-elem-id={elem_id}
                        data-value-note=""
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


