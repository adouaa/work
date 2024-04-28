# 数据岛

调用或查询检验检查报告等数据的组件。

## 版本

 - 20240329


---

## 依赖插件

```base
$ npm i funda-ui axios
```


## 组件用法


 - `referenceDataRef` 暴露的重置方法 `referenceDataRef.current.reset()`
 - `editEnterStatus` 为 true 时才会触发接口【相当于点击弹窗展开后触发】
 - `visitId` 参数 visit ID
 - `onConfirm`, `onConfirmTextarea1`, `onConfirmTextarea2` 三个复制按钮的回调
 - `appearanceConfig` 用来配置语言文本。


```css
/*--- POPUP ---*/
.app-builder-editelement-mask {
    position: fixed;
    background: rgba(0,0,0,0);
    right: -100vw;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    transition: .5s;
    transition-delay: 0.05s; /* Prevent real-time update of store displacement */

    &.active {
        right: 0;
    }


}
.app-builder-editelement {

    // using bootstrap light theme
    --bs-blue: #0d6efd;
    --bs-indigo: #6610f2;
    --bs-purple: #6f42c1;
    --bs-pink: #d63384;
    --bs-red: #dc3545;
    --bs-orange: #fd7e14;
    --bs-yellow: #ffc107;
    --bs-green: #198754;
    --bs-teal: #20c997;
    --bs-cyan: #0dcaf0;
    --bs-black: #000;
    --bs-white: #fff;
    --bs-gray: #6c757d;
    --bs-gray-dark: #343a40;
    --bs-gray-100: #f8f9fa;
    --bs-gray-200: #e9ecef;
    --bs-gray-300: #dee2e6;
    --bs-gray-400: #ced4da;
    --bs-gray-500: #adb5bd;
    --bs-gray-600: #6c757d;
    --bs-gray-700: #495057;
    --bs-gray-800: #343a40;
    --bs-gray-900: #212529;
    --bs-primary: #0d6efd;
    --bs-secondary: #6c757d;
    --bs-success: #198754;
    --bs-info: #0dcaf0;
    --bs-warning: #ffc107;
    --bs-danger: #dc3545;
    --bs-light: #f8f9fa;
    --bs-dark: #212529;
    --bs-primary-rgb: 13, 110, 253;
    --bs-secondary-rgb: 108, 117, 125;
    --bs-success-rgb: 25, 135, 84;
    --bs-info-rgb: 13, 202, 240;
    --bs-warning-rgb: 255, 193, 7;
    --bs-danger-rgb: 220, 53, 69;
    --bs-light-rgb: 248, 249, 250;
    --bs-dark-rgb: 33, 37, 41;
    --bs-primary-text: #0a58ca;
    --bs-secondary-text: #6c757d;
    --bs-success-text: #146c43;
    --bs-info-text: #087990;
    --bs-warning-text: #997404;
    --bs-danger-text: #b02a37;
    --bs-light-text: #6c757d;
    --bs-dark-text: #495057;
    --bs-primary-bg-subtle: #cfe2ff;
    --bs-secondary-bg-subtle: #f8f9fa;
    --bs-success-bg-subtle: #d1e7dd;
    --bs-info-bg-subtle: #cff4fc;
    --bs-warning-bg-subtle: #fff3cd;
    --bs-danger-bg-subtle: #f8d7da;
    --bs-light-bg-subtle: #fcfcfd;
    --bs-dark-bg-subtle: #ced4da;
    --bs-primary-border-subtle: #9ec5fe;
    --bs-secondary-border-subtle: #e9ecef;
    --bs-success-border-subtle: #a3cfbb;
    --bs-info-border-subtle: #9eeaf9;
    --bs-warning-border-subtle: #ffe69c;
    --bs-danger-border-subtle: #f1aeb5;
    --bs-light-border-subtle: #e9ecef;
    --bs-dark-border-subtle: #adb5bd;
    --bs-white-rgb: 255, 255, 255;
    --bs-black-rgb: 0, 0, 0;
    --bs-body-color-rgb: 33, 37, 41;
    --bs-body-bg-rgb: 255, 255, 255;
    --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    --bs-font-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --bs-gradient: linear-gradient(180deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    --bs-body-font-family: var(--bs-font-sans-serif);
    --bs-body-font-size: 1rem;
    --bs-body-font-weight: 400;
    --bs-body-line-height: 1.5;
    --bs-body-color: #212529;
    --bs-emphasis-color: #000;
    --bs-emphasis-color-rgb: 0, 0, 0;
    --bs-secondary-color: rgba(33, 37, 41, 0.75);
    --bs-secondary-color-rgb: 33, 37, 41;
    --bs-secondary-bg: #e9ecef;
    --bs-secondary-bg-rgb: 233, 236, 239;
    --bs-tertiary-color: rgba(33, 37, 41, 0.5);
    --bs-tertiary-color-rgb: 33, 37, 41;
    --bs-tertiary-bg: #f8f9fa;
    --bs-tertiary-bg-rgb: 248, 249, 250;
    --bs-body-bg: #fff;
    --bs-body-bg-rgb: 255, 255, 255;
    --bs-link-color: #0d6efd;
    --bs-link-color-rgb: 13, 110, 253;
    --bs-link-decoration: underline;
    --bs-link-hover-color: #0a58ca;
    --bs-link-hover-color-rgb: 10, 88, 202;
    --bs-code-color: #d63384;
    --bs-highlight-bg: #fff3cd;
    --bs-border-width: 1px;
    --bs-border-style: solid;
    --bs-border-color: #dee2e6;
    --bs-border-color-translucent: rgba(0, 0, 0, 0.175);
    --bs-border-radius: 0.375rem;
    --bs-border-radius-sm: 0.25rem;
    --bs-border-radius-lg: 0.5rem;
    --bs-border-radius-xl: 1rem;
    --bs-border-radius-2xl: 2rem;
    --bs-border-radius-pill: 50rem;
    --bs-box-shadow: 0 0.5rem 1rem rgba(var(--bs-body-color-rgb), 0.15);
    --bs-box-shadow-sm: 0 0.125rem 0.25rem rgba(var(--bs-body-color-rgb), 0.075);
    --bs-box-shadow-lg: 0 1rem 3rem rgba(var(--bs-body-color-rgb), 0.175);
    --bs-box-shadow-inset: inset 0 1px 2px rgba(var(--bs-body-color-rgb), 0.075);
    --bs-emphasis-color: #000;
    --bs-form-control-bg: var(--bs-body-bg);
    --bs-form-control-disabled-bg: var(--bs-secondary-bg);
    --bs-highlight-bg: #fff3cd;
    --bs-breakpoint-xs: 0;
    --bs-breakpoint-sm: 576px;
    --bs-breakpoint-md: 768px;
    --bs-breakpoint-lg: 992px;
    --bs-breakpoint-xl: 1200px;
    --bs-breakpoint-xxl: 1400px;
    
    //
    --bs-heading-color: #333;



    // custom
    --app-builder-title-color: #777;

    .row {
        /* Horizontally aligned form text is centered */
        .text-end:not(.text-end--for-radio-checkbox) {
            padding-top: .4em;  
        }
    }
    .text-end {
        color: var(--app-builder-title-color);
    }

    .form-check-label {
        color: var(--app-builder-title-color);
    }

    .col-auto {
        color: var(--app-builder-title-color);
    }

    .btn-close {
        filter: none !important;
    }


    //
    position: fixed;
    background: #fafafa;
    padding: 15px 0;
    border-left: 0;
    box-shadow: none;
    top: 0;
    right: -1100px;
    height: 100%;
    width: 1000px;
    transition: .5s;
    z-index: 1051;
    transition-delay: 0.05s; /* Prevent real-time update of store displacement */
    opacity: 0;

    &.active {
        right: 0;
    }

    &.show {
        opacity: 1 !important;
    }

    .app-builder-editelement__close {
        position: fixed;
        top: 1rem;
        right: -1100px;
        z-index: 1052;
        cursor: pointer;
        border: none;
        outline: none;
        background: none;
        transition-delay: 0.05s; /* Prevent real-time update of store displacement */

        &.active {
            right: 1rem;
        }


    }


}

@media all and (max-width: 768px) {
    .app-builder-editelement {
        width: 100%;
    }
}

```


```js
import React, { useState, useEffect, useRef } from "react";
import DataIsland from './DataIsland';


const DemoPage = (props: any) => {

    const referenceDataRef = useRef<any>(null);
    const editRef = useRef<HTMLDivElement>(null);
    const editMaskRef = useRef<HTMLDivElement>(null);
    const [editEnterStatus, setEditEnterStatus] = useState<boolean>(false);
   
    const closeAction = () => {
        setEditEnterStatus(false);
    };


    function handleClose(e: React.MouseEvent) {
        e.preventDefault();
        closeAction();

        if (referenceDataRef.current) referenceDataRef.current.reset();

    }


    useEffect(() => {

        setTimeout(() => {
            if (editRef.current) {
                editRef.current.classList.add('show');
            }
        }, 1500);

    }, []);



    return (
        <>
             <a href="#" onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                setEditEnterStatus(true);
             }}>
             打开弹窗
             </a>

            {/* SIDE POPUP */}
            <div className={`app-builder-editelement-mask ${editEnterStatus ? 'active show' : ''}`} ref={editMaskRef} onClick={handleClose}></div>
            <div className={`app-builder-editelement shadow ${editEnterStatus ? 'active show' : ''}`} ref={editRef} style={{ opacity: 0 }}>
                <button className={`app-builder-editelement__close ${editEnterStatus ? 'active' : ''}`} tabIndex={-1} onClick={handleClose}>
                    <svg width="35px" height="35px" viewBox="0 0 1024 1024" fill="#000000"><path d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z" fill="" /><path d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z" fill="" /><path d="M328 340.8l32-31.2 348 348-32 32z" fill="" /></svg>

                </button>


                <DataIsland
                    referenceDataRef={referenceDataRef}
                    editEnterStatus={editEnterStatus}  // 为 true 时才会触发接口【相当于点击弹窗展开后触发】
                    visitId={20240000316}   
                    appearanceConfig={{
                        btns: {
                            referenceConfirmLabel: '修改 Visit ID',
                            referenceDataConfirmLabel: '结构化复制',
                            sync: '同步',
                            listSortLabel: '倒序'
                        },
                        referenceDataPanel: {
                            between: '到',
                            begin: '开始时间',
                            end: '结束时间',
                            sortReverse: '倒序',
                            noData: '暂无数据，您可以切换开始结束时间筛选',
                            inputId: 'Visit ID',
                            anomalyOnly: `<span class="text-danger">异常</span>`
                        },
                        others: {
                            syncSuccess: '同步成功',
                            syncFailure: '同步失败'
                        }
                    }}
                    onConfirm={(curControlId: string, val: any, rowVal: any) => {

                        if (referenceDataRef.current) referenceDataRef.current.reset();

                        setTimeout(() => {
                            closeAction();
                        }, 0);

                    }}
                    onConfirmTextarea1={(curControlId: string, val: any, rowVal: any) => {

                    }}
                    onConfirmTextarea2={(curControlId: string, val: any, rowVal: any) => {

                    }}
                />


            </div>
            {/* /SIDE POPUP */}


        </>
    );

}


export default DemoPage;
```

