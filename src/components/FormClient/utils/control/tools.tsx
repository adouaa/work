import React from "react";

// API
import { fetchPost } from '../../config/request';

import { extractContentsOfBrackets } from '../../utils/extract';

    
const dateFormat = (v: Date | String) => {
    const date = typeof v === 'string' ? new (Date as any)(v.replace(/-/g, "/")) : v;  // fix "Invalid date in safari"
    return date;
};


const multiSelControlOptionExist = (arr: any[], val: any) => {
    const _data = arr.filter(Boolean);
    return _data.map((v: any) => v.toString()).includes(val.toString());
};



const fieldExist = (key: any) => {
    return key == 0 || key === '';
};

const getValueNote = (obj: any) => {
    if (obj === null) return '';

    let _noteRes: string = '';
    const _note = (obj as HTMLInputElement).querySelector('input');
    if (_note !== null) {
        _noteRes = _note.value;
    }

    return _noteRes;
}

function unique(arr: any[]) {
    return Array.from(new Set(arr));
}


const referenceDataText = (text: string = '引用', useIcon: boolean = true) => {
    return <>
        {useIcon ? <>
            <svg fill="#0d6efd" width="12px" height="12px" viewBox="0 0 24 24">
                <path d="M16.4481 1.50023C14.844 1.4862 13.3007 2.10727 12.15 3.22645L12.1351 3.24107L11.6464 3.7298C11.2559 4.12032 11.2559 4.75349 11.6464 5.14401L12.3535 5.85112C12.7441 6.24164 13.3772 6.24164 13.7677 5.85112L14.2484 5.37048C14.834 4.80437 15.6142 4.49305 16.4218 4.50012C17.2326 4.50721 18.0103 4.83463 18.5868 5.41517C19.1637 5.99606 19.4927 6.78402 19.4998 7.60991C19.5069 8.43176 19.1946 9.22174 18.633 9.81182L15.5209 12.9432C15.2056 13.2609 14.8269 13.5058 14.4107 13.6622C13.9945 13.8185 13.5501 13.8828 13.1076 13.8509C12.6651 13.8189 12.2341 13.6915 11.8438 13.4768C11.7456 13.4228 11.6504 13.3635 11.5588 13.2993C11.1066 12.9823 10.4859 12.8717 10.0425 13.201L9.23978 13.7973C8.79642 14.1266 8.69902 14.7603 9.09601 15.1443C9.48444 15.52 9.9219 15.8435 10.3977 16.1053C11.1664 16.5282 12.0171 16.78 12.8918 16.8431C13.7666 16.9062 14.6444 16.779 15.4656 16.4706C16.2868 16.1621 17.0317 15.6797 17.65 15.0568L20.7712 11.9162L20.7898 11.8971C21.9007 10.7389 22.5136 9.18987 22.4997 7.58402C22.4859 5.97817 21.8463 4.43996 20.7155 3.30127C19.5844 2.16225 18.0521 1.51427 16.4481 1.50023Z" />
                <path d="M11.1082 7.15685C10.2334 7.09376 9.35555 7.22089 8.53436 7.52937C7.71347 7.83773 6.96821 8.32053 6.34994 8.94317L3.22873 12.0838L3.21011 12.1029C2.09928 13.261 1.48637 14.8101 1.50023 16.416C1.51409 18.0218 2.15365 19.56 3.28441 20.6987C4.41551 21.8377 5.94781 22.4857 7.55185 22.4997C9.15591 22.5138 10.6993 21.8927 11.85 20.7735L11.8648 20.7589L12.3536 20.2701C12.7441 19.8796 12.7441 19.2465 12.3536 18.8559L11.6464 18.1488C11.2559 17.7583 10.6228 17.7583 10.2322 18.1488L9.75155 18.6295C9.16598 19.1956 8.38576 19.5069 7.5781 19.4999C6.76732 19.4928 5.98963 19.1653 5.41313 18.5848C4.83629 18.0039 4.50725 17.216 4.50012 16.3901C4.49303 15.5682 4.80532 14.7782 5.36694 14.1881L8.47904 11.0567C8.79434 10.7391 9.1731 10.4941 9.58932 10.3378C10.0055 10.1814 10.4498 10.1172 10.8924 10.1491C11.3349 10.181 11.7659 10.3084 12.1561 10.5231C12.2544 10.5772 12.3495 10.6365 12.4411 10.7007C12.8934 11.0177 13.5141 11.1282 13.9574 10.7989L14.7602 10.2026C15.2036 9.87328 15.301 9.23958 14.904 8.85563C14.5155 8.47995 14.0781 8.15644 13.6022 7.89464C12.8335 7.47172 11.9829 7.21993 11.1082 7.15685Z" />
            </svg>
            &nbsp;
        </> : null}

        <span>{text}</span>
    </>;
};

const optionsText = (text: string = '选项', useIcon: boolean = true, show: boolean = false) => {
    return <>
        {!useIcon ? <>
            <svg width="10px" height="10px" viewBox="0 -4.5 20 20" style={{transform: `rotate(${show ? '180deg' : '0deg'})`}}>
                <g stroke="none" strokeWidth="1" fill="none">
                    <g transform="translate(-180.000000, -6684.000000)" className="arrow-fill-g" fill="#a5a5a5">
                        <g transform="translate(56.000000, 160.000000)">
                            <path d="M144,6525.39 L142.594,6524 L133.987,6532.261 L133.069,6531.38 L133.074,6531.385 L125.427,6524.045 L124,6525.414 C126.113,6527.443 132.014,6533.107 133.987,6535 C135.453,6533.594 134.024,6534.965 144,6525.39">
                            </path>
                        </g>
                    </g>
                </g>
            </svg>

        </> : <>
            <svg fill="#0d6efd" width="12px" height="12px" viewBox="0 0 32 32">
                <path d="M0 26.016v-20q0-2.496 1.76-4.256t4.256-1.76h20q2.464 0 4.224 1.76t1.76 4.256v20q0 2.496-1.76 4.224t-4.224 1.76h-20q-2.496 0-4.256-1.76t-1.76-4.224zM4 26.016q0 0.832 0.576 1.408t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.408v-20q0-0.832-0.576-1.408t-1.408-0.608h-20q-0.832 0-1.44 0.608t-0.576 1.408v20zM8 24v-4h4v4h-4zM8 18.016v-4h4v4h-4zM8 12v-4h4v4h-4zM14.016 24v-4h9.984v4h-9.984zM14.016 18.016v-4h9.984v4h-9.984zM14.016 12v-4h9.984v4h-9.984z"></path>
            </svg>
            &nbsp;
            <span>{text}</span>
        </>}


    </>;
};

const optionsTextNoIcon = (text: string = '选项') => {
    return <>
        <span>{text}</span>
    </>;
};


const entryText = (text: string = '结构化', useIcon: boolean = true) => {
    return <>
        {useIcon ? <>
            <svg fill="#0d6efd" width="12px" height="12px" viewBox="0 0 24 24">
                <g>
                    <path d="M23,13c0-1.304-0.837-2.403-2-2.816V7.858c1.721-0.447,3-2,3-3.858c0-2.206-1.794-4-4-4s-4,1.794-4,4
    c0,1.858,1.279,3.411,3,3.858v2.326c-1.163,0.413-2,1.512-2,2.816s0.837,2.403,2,2.816v2.367c-1.163,0.413-2,1.512-2,2.816
    c0,1.657,1.343,3,3,3s3-1.343,3-3c0-1.304-0.837-2.403-2-2.816v-2.367C22.163,15.403,23,14.304,23,13z M18,4c0-1.103,0.897-2,2-2
    s2,0.897,2,2s-0.897,2-2,2S18,5.103,18,4z"/>
                    <path d="M15.842,4.228L10.886,1.5l0.837,2.887C10.185,5.007,8,6.92,8,11H6V9H0v6h6v-2h2v6H6v-2H0v6h6v-2h2v3h2V11
    c0-3.123,1.506-4.278,2.287-4.667l0.827,2.851L15.842,4.228z M4,13H2v-2h2V13z M4,21H2v-2h2V21z"/>
                </g>
            </svg>
            &nbsp;
        </> : null}

        <span>{text}</span>
    </>;
};


const oneToFiftyToCircledNumber = (n: number) => {
    const o = Array.from({ length: 51 }).fill(0).map((s, i) => i);
    const t = ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘', '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟', '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷', '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾', '㊿']

    const currentIndex = o.findIndex((s) => s == n);
    return t[currentIndex];
};




// options format
const optionsFormat = (groupData: any[], noGroupData: any[]) => {


    const groupOptions: any[] = [];
    groupData.forEach((g: any) => {
        groupOptions.push(
            {
                "value": g.group_id,
                "label": g.group_name,
                "optgroup": noGroupData.filter((v: any) => v.group_id === g.group_id).map((opt: any) => {
                    return {
                        "elem_id": opt.elem_id,
                        "group_id": opt.group_id,
                        "option_code": opt.option_code,
                        "option_code_system": opt.option_code_system,
                        "option_text": opt.option_text,
                        "option_score": typeof opt.option_score !== 'undefined' && opt.option_score != 0 && opt.option_score != null ? opt.option_score : 0,
                        "hasNote": opt.option_tag !== null ? extractContentsOfBrackets(opt.option_tag).includes('备注') : false,
                        "option_note": opt.option_note,
                        "checked": typeof opt.checked === 'undefined' ? false : opt.checked
                    }
                })
            });
    });
    const noGroupOptions = noGroupData.map((opt: any) => {

        if (opt.group_id == 0) {
            return {
                "elem_id": opt.elem_id,
                "group_id": opt.group_id,
                "option_code": opt.option_code,
                "option_code_system": opt.option_code_system,
                "option_text": opt.option_text,
                "option_score": typeof opt.option_score !== 'undefined' && opt.option_score != 0 && opt.option_score != null ? opt.option_score : 0,
                "hasNote": opt.option_tag !== null ? extractContentsOfBrackets(opt.option_tag).includes('备注') : false,
                "option_note": opt.option_note,
                "checked": typeof opt.checked === 'undefined' ? false : opt.checked
            }
        }

    }).filter(Boolean);

    const optionsAll = groupOptions.concat(noGroupOptions);
    return optionsAll;
};


const optionsFlat = (allData: any[]) => {

    const flatItems: any[] = [];

    allData.forEach((item: any) => {
        if (typeof item.optgroup !== 'undefined') {
            item.optgroup.forEach((opt: any) => {
                flatItems.push(opt);
            });
        } else {
            flatItems.push(item);
        }
    });

    return flatItems;
};



const getSubOptions = async (targetParams: any) => {

    const res: any = await fetchPost('elem/GetElemOptionSubList', {
        elem_id: Number(targetParams.id),
        option_code: targetParams.code
    });

    const resList: any = typeof res.row_list === 'undefined' ? [] : res.row_list;
    return resList;
};


const optionsMergeStr = (allData: any[], selectMultipleSplitBtn: any, hasBreak: boolean, hasNum: boolean, hasSplit: boolean) => {
    let res: string = '';
    let resCode: string = '';
    let itemNum: number = 1;
    let _optionsList: any[] = optionsFlat(allData);
    _optionsList = _optionsList.filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.option_code === item.option_code)));

    _optionsList.forEach((item: any, i: number) => {
        if (item.checked) {

            const _break_placeholder = hasBreak ? "\n" : '';
            const _serialnum_placeholder = hasNum ? oneToFiftyToCircledNumber(itemNum) : '';
            const _split_str = hasSplit && selectMultipleSplitBtn !== null ? selectMultipleSplitBtn.value : '';


            res += _serialnum_placeholder + item.option_text + _break_placeholder + _split_str;
            resCode += `[${item.option_code}]`;


            itemNum++;
        }
    });

    return {
        text: res,
        code: resCode
    };

};


const calcTotalScore = (arr: number[], cusAttrs: any) => {
    let _score = arr.reduce(
        (accumulator: number, currentValue: number) => accumulator + currentValue,
        0,
    );

    if (typeof cusAttrs !== 'undefined') {
        if (_score > cusAttrs.maxScore && cusAttrs.maxScore > 0) _score = cusAttrs.maxScore;
    }

    return _score;
};



const optionChecked = ($optionCode: string, groupData: any[], allData: any[], defaultCode: any, isMultiple: boolean) => {

    // selected values
    const selectedValues: string[] = [];

    // checked target
    const curItem = allData.filter((item: any) => item.option_code == $optionCode)[0];
    if (typeof curItem !== 'undefined') {

        if (!isMultiple) {
            if (defaultCode == curItem.option_code) {
                curItem.checked = true;
                selectedValues.push(curItem.option_code);
            }
        } else {
            if (defaultCode.includes(curItem.option_code)) {
                curItem.checked = true;
                selectedValues.push(curItem.option_code);
            }
        }
    }
};



const optionsScoreFormat = (allData: any[], curAttrs: any, isMultiple: boolean) => {

    let _tempScore: number = 0;

    allData.forEach((item: any, i: number) => {

        let _score = typeof item.option_score !== 'undefined' && item.option_score != 0 && item.option_score != null ? item.option_score : 0;
        if (_score > curAttrs.maxScore && curAttrs.maxScore > 0) _score = curAttrs.maxScore;

        // update score for "radio" and "multiple checkboxes"
        if (!isMultiple) {
            if (curAttrs.valueCodeValue == item.option_code) {
                _tempScore = _score;
            }
        } else {
            const _code = extractContentsOfBrackets(curAttrs.valueCodeValue);

            if (_code.includes(item.option_code)) {
                _tempScore = _tempScore + _score;
            }

        }
    });

    return _tempScore;

};


const copyContent = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        console.log('复制成功');
    } catch (err) {
        console.log('复制失败：' + err);
    }
};

const unsecuredCopyToClipboard = (text: string, el: HTMLInputElement | HTMLTextAreaElement) => {
    if (el === null) {
        console.log('复制失败');
        return;
    }

    el.focus();
    el.select();

    try {
        document.execCommand('copy');
        console.log('复制成功');
    } catch (err) {
        console.log('复制失败：' + err);
    }
};

/**
 * Copies the text passed as param to the system clipboard
 * Check if using HTTPS and navigator.clipboard is available
 * Then uses standard clipboard API, otherwise uses fallback
*/
const copyToClipboard = (content: string, el: HTMLInputElement | HTMLTextAreaElement) => {
    if (window.isSecureContext && navigator.clipboard) {
        copyContent(content);
    } else {
        unsecuredCopyToClipboard(content, el);
    }
};


const getOptionFile = async (elemId: number | string, optionCode: string) => {
    const res = await fetchPost('file/ReadString', {
        link_app: 'elem-img-archive',
        link_name: optionCode,
        link_value: Number(elemId),
        link_data: ''
    });

    return res.file_content;
};


const formatDateTime = (v: string) => {
    // yyyy-MM-dd HH:MM
    const date: any = dateFormat(v);
    const padZero = (num: number): string => {
        return num < 10 ? '0' + num : num.toString();
    };
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const res = `${year}-${month}-${day} ${hours}:${minutes}:00`;

    return res;
};


const formatTime = (v: string) => {
    // HH:MM
    const _formatVal = v === '' ? null : v.split(':').length === 3 ? `${v}` : `${v}:00`;
    return _formatVal;
};



const keyDownType = (event: React.KeyboardEvent<any>) => {
    const key = event.code;
    let type = key;

    switch (key) {
        case 'ArrowRight':
            type = 'right';
            break;
        case 'ArrowLeft':
            type = 'left';
            break;
        case 'ArrowDown':
            type = 'down';
            break;
        case 'ArrowUp':
            type = 'up';
            break;
        case 'Space':
            type = 'spacebar';
            break;
        case 'Tab':
            type = 'tab';
            break;      
        case 'Enter':
            type = 'enter';
            break;
        case 'ShiftLeft':
            type = 'shiftLeft';
            break;                
        case 'AltLeft':
            type = 'alt';
            break;    
        case 'Escape':
            type = 'esc';
            break;   
        case 'Backspace':
            type = 'back';
            break;   
            
    }

    return type;
};


const hasScore = (data: any[]) => {
    return data.some((item: any, index: number) => {
        if (typeof item.option_score !== 'undefined' && item.option_score != null && Number(item.option_score) > 0) {
            return true;
        }
        return false;
    });
};


export {
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
    keyDownType,
    hasScore
}