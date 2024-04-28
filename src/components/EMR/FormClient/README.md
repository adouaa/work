# 表单构建器用户输入框

根据不同的表单ID，还原设计器的格式，并输出表单到用户端。

## 版本

 - 20240415


---

## 依赖插件

如果你不使用自己的基础表单组件，请先安装下面的插件：


```base
$ npm i funda-ui
```

> 你可以把表单组件换成自己的，修改目录 `controls/*` 里面的 **funda-ui** 组件即可。



## 组件用法

 - `popupRef`  组件弹窗暴露的方法，  actRef.current.closeCustomSelect()   
 - `actRef`  组件暴露的方法，  actRef.current.initAll()   
 - `visitId` 参数 visit ID
 - `linkData` Link相关参数，如 `{link_name: '手术',link_value: 60194,link_data: '',link_tag: '',link_ext: ''}`
 - `emrId` 判断是否已经保存过，如果emr ID存在，取消初始化功能
 - `babyId` 参数 baby ID
 - `userId` 参数 user ID
 - `formId` 参数 form ID
 - `onEntry` 事件可以存储结构化的信息，用来自动保存结构化数据。
 - `onChange` 和 `onRemove` 事件可以让使用者实时保存表单数据，由于表单 name 都是不固定的，使用者使用保存按钮需要遍历所有的 name 来存储最终结果。
 - `defaultValue` 是默认值，当`onChange` 或 `onRemove` 发生后，可以重新赋最新值来保证表单内的数据【特别是嵌入的结构化数据】的准确性。
 - `appearanceConfig` 用来配置括号等风格。




默认值需要通过接口，自己包装成相应的 JSON 格式传入。


```js

import React, { useEffect, useState, useRef } from "react";
import FormClient from '../FormClient';

const demoData = [
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 55,
        "value": "有",
        "valueCode": "USUAL",
        "valueNote": "",
        "elemTotalScore": 2

    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 56,
        "value": "15",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30043,
        "rowNo": 0,
        "elemId": 40,
        "value": "33.6",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30043,
        "rowNo": 0,
        "elemId": 39,
        "value": "FEMALE",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 0,
        "elemId": 39,
        "value": "MALE",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 0,
        "elemId": 40,
        "value": "35.6",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 0,
        "elemId": 41,
        "value": "无\n",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 1,
        "elemId": 39,
        "value": "FEMALE",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 1,
        "elemId": 40,
        "value": "37.7",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 2,
        "elemId": 39,
        "value": "FEMALE",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 2,
        "elemId": 40,
        "value": "38.8",
        "valueNote": "",
        "elemTotalScore": 0

    },
    {
        "entryId": 0,
        "sectionId": 30042,
        "rowNo": 2,
        "elemId": 41,
        "value": "这里是内容a\nb\nc\nd\n",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 5,
        "sectionId": 30043,
        "rowNo": 0,
        "elemId": 41,
        "value": "RARE777",
        "valueNote": "",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30045,
        "rowNo": 0,
        "elemId": 85,
        "value": "RARE",
        "valueNote": "",
        "elemName": "主诉（结构化1）",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30045,
        "rowNo": 0,
        "elemId": 39,
        "value": "777",
        "valueNote": "",
        "elemName": "收缩压",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 76,
        "value": 1,
        "valueNote": "复选框注释信息999",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 119,
        "value": "损伤",
        "valueCode": "BAD",
        "valueNote": "tt",
        "elemName": "皮肤状态",
        "elemTotalScore": 2
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 80,
        "value": 1,
        "valueNote": "fdf",
        "elemName": "已审查（可备注）",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 4761,
        "value": "①皮肤过敏\n②骨头损伤\n",
        "valueCode": "[AA][BB]",
        "valueNote": "",
        "elemName": "是否有下列病症（多选未展开）",
        "elemTotalScore": 0
    },
    // 带分组
    {
        "entryId": 0,
        "sectionId": 30114,
        "rowNo": 0,
        "elemId": 72,
        "value": "感冒",
        "valueCode": "COLD",
        "valueNote": "",
        "elemName": "是否有下列病症（单选展开+分组）"
    },
    {
        "entryId": 0,
        "sectionId": 30116,
        "rowNo": 0,
        "elemId": 72,
        "value": "[过敏][头晕眼花]",
        "valueCode": "[SENSITIVE][TT]",
        "valueNote": "",
        "elemName": "是否有下列病症（多选展开+分组）"
    },
    
    // 带分组（结构化）
    {
        "entryId": 0,
        "sectionId": 30045,
        "rowNo": 0,
        "elemId": 72,
        "value": "B", // 组名称
        "valueCode": "B",  // 组名称
        "valueNote": "",
        "elemName": "是否有下列病症（单选展开+分组）"
    },
    {
        "entryId": 0,
        "sectionId": 30117,
        "rowNo": 0,
        "elemId": 4762,
        "value": "",
        "valueCode": "MM",
        "valueNote": "[损伤][骨折]",
        "elemName": "肌肉分布（有子选项）【仅展开有效，子选项的值将作为值的注释保存到系统】",
        "elemTotalScore": 2
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 72,
        "value": "①发烧②感冒-多余的文字",
        "valueCode": "[FEFER][COLD]",
        "elemName": "是否有下列病症【带分组】",
        "elemTotalScore": 7
    },
    {
        "entryId": 0,
        "sectionId": 30041,
        "rowNo": 0,
        "elemId": 4760,
        "value": "急诊值班",
        "valueCode": "DUTY-E",
        "valueNote": "",
        "elemName": "门诊值班",
        "elemTotalScore": 0
    },
    {
        "entryId": 0,
        "sectionId": 90013,
        "rowNo": 0,
        "elemId": 60017,
        "value": "测试测试",
        "valueCode": "",
        "valueNote": "",
        "elemName": "输入框",
        "elemTotalScore": 0
    }

];


const PageIndex = () => {

    const actRef = useRef<any>(null);
    const popupRef = useRef<any>(null);
        

    // 保存时可以触发它批量保存结构化
    const [entryFuncs, setEntryFuncs] = useState<any[]>([]);
    const itemExist = (arr: any[], entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number) => {
        return arr.some((o: any) => {
            return o.entryId == entryId && o.sectionId == sectionId && o.rowNo == rowNo && o.elemId == elemId
        });
    };


    // 默认值（一般从数据库获取）
    const [defaultData, setDefaultData] = useState<any[]>([]);

    function closePopup() {
        if (popupRef.current) popupRef.current.closeCustomSelect();
    }


    useEffect(() => {
        localStorage.removeItem('FORM_CLIENT_TEMP_DATA'); // 删除临时默认值
        setDefaultData(demoData);
    }, []);

    return (
        <>

            <a
                tabIndex={-1}
                href="#"
                className="btn bg-warning text-black btn-link btn-sm text-decoration-none me-1 d-flex align-items-center app-builder-initbtn"
                onClick={(e: React.MouseEvent) => {
                    e.preventDefault();
                    if (actRef.current) actRef.current.initAll()   

                }}
            >全部初始化</a>

            <FormClient
                popupRef={popupRef}
                actRef={actRef}
                appearanceConfig={{
                    scoreParentheses: {
                        before: '【',
                        after: '】',
                        divideLine: ' | ',
                        totalLabel: '分值 ',
                        obtainedLabel: '得分 ',
                        optLabel: '分值 ',
                        optBefore: '（',
                        optAfter: '）',
                    },
                    btns: {
                        optSingleLabel: '单选',
                        optMultipleLabel: '多选',
                        entryLabel: '结构化',
                        entryCancelLabel: '取消',
                        entryConfirmLabel: '确定',
                        modalCancelLabel: '取消',
                        modalConfirmLabel: '确定',
                        referenceDataConfirmLabel: '结构化引用',
                        referenceDataLabel: '引用',
                        initSectionLabel: '重新获取',
                        sync: '同步',
                        listSortLabel: '倒序',
                        initAlert: '重新获取数据会将当前块的所有数据重置（包含现有数据），如果有默认值，它将会重新赋值，确定？'
                    },
                    referenceDataPanel: {
                        between: '到',
                        begin: '开始时间',
                        end: '结束时间',
                        sortReverse: '倒序',
                        noData: '暂无数据，您可以切换开始结束时间筛选',
                        anomalyOnly: '<span class="text-danger">异常</span>'
                    },
                    others: {
                        formInit: '表单初始化中...',
                        sectionInit: '加载中...',
                        selectLabel: '请选择',
                        referenceDataPanelTitle: '数据岛',
                        placeholderNote: '备注',
                        otherGroupLabel: '其它',
                        syncSuccess: '同步成功',
                        syncFailure: '同步失败'
                       
                    }
                }}
                defaultValue={defaultData}
                visitId={20240000316}
                linkData={{
                    link_name: '手术',
                    link_value: 60194,
                    link_data: '',
                    link_tag: '',
                    link_ext: ''
                }}
                emrId={null} // 判断是否已经保存过，如果emr ID存在，取消初始化功能
                babyId="888"
                userId="10000"
                formId="90004"
                onEntry={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, entryFuncs: any) => {

                    setEntryFuncs((prevState: any) => {

                        const _val = {
                            entryId,
                            sectionId,
                            rowNo,
                            elemId,
                            entryFuncs
                        };

                        let res: any[] = Array.from(new Set(prevState));
                        const currentItemIndex = prevState.findIndex((o: any) => o.entryId == entryId && o.sectionId == sectionId && o.rowNo == rowNo && o.elemId == elemId);

                        if (itemExist(prevState, entryId, sectionId, rowNo, elemId)) {
                            res.splice(currentItemIndex, 1);
                        }
                        res.push(_val);

                        // filter entry_id
                        let _allData = res;
                        _allData = _allData.reverse().filter((item: any, index: number, self: any[]) => index === self.findIndex((t) => (t.entryId === item.entryId)));

                        return _allData;
                    });
                }}
                onChange={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => {
                    console.log({ entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, tempDefaultValue });
                }}
                onRemove={(entryId: string | number, sectionId: string | number, rowNo: string | number, elemId: string | number, value: string, valueCode: string, valueNote: string, elemName: string, elemTotalScore: number, attrs: any, tempDefaultValue: any) => {
                    console.log({ entryId, sectionId, rowNo, elemId, value, valueCode, valueNote, elemName, elemTotalScore, attrs, tempDefaultValue });
                }}
            />


            <button type="button" className="btn btn-primary" onClick={(e: React.MouseEvent) => {
                const allEntryReq: any[] = [];
                entryFuncs.forEach((item: any) => {
                    const { entryId, sectionId, rowNo, elemId, entryFuncs } = item;
                    allEntryReq.push(entryFuncs?.());
                })
                Promise.all(allEntryReq).then((values) => {
                    // 所有的结构化自动保存完毕
                    // ...
                    console.log('结构化保存完毕，触发onChange');

                });

            }}>批量保存结构化测试</button>


        </>
    );


}



export default PageIndex;




```

