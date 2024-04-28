import { withTranslation } from "react-i18next";
import classNames from "classnames";
import React, { forwardRef, useImperativeHandle } from "react";
import "./index.css";

import { useEffect, useRef, useState } from "react";

export interface SelectProps {
    defaultValue?: any;
    options: any[];
    placeholder?: string;
    size?: "sm" | "lg";
    className?: string;
    disabled?: any;
    showSelected?: boolean;
    onChangeOK?: (e?: any, ...args: any) => void
}

interface MultipleSelectProps extends SelectProps {
    onMultipleSelectChangeOK?: (selectedOptions: any[]) => void;
    ref?: any;
}

const MultipleSelect: React.FC<MultipleSelectProps> = forwardRef((props: MultipleSelectProps, ref) => {



    const { defaultValue, showSelected = true, options, size, className, disabled = false, onChangeOK, onMultipleSelectChangeOK } = props;

    // 获取 `FormContext.Provider` 提供提供的 `value` 值

    // const [value, setValue] = useState(defaultValue || ""); // 给个 || ""就会让 input为受苦状态
    // 注意！！！如果发现状态没有按预知的方向变化的话，就考虑用 xxxRef来替代。。。
    // const prevSelectedValueRef = useRef<string>(defaultValue || "");
    const searchValueRef = useRef<string>(defaultValue || "");
    const [tempOptions, setTempOptions] = useState<any>(options || []);
    const [showOptions, setShowOptions] = useState(false);
    const [filterdOptions, setFilterdOptions] = useState(options); // 多选主要是靠这个来展示哪个选项被打钩
    // 是否展示选中的选项
    const [selectedOptions, setSelectedOptions] = useState<any[]>([]); // 选中的选项展示在 框中
    const [showSelectedOptions, setShowSelectedOptions] = useState(false);


    let selectedOptionRefs: any = []
    let optionItemRefs: any = []

    // 框高亮
    const [isHighlighted, setIsHighlighted] = useState(false);


    const cls = classNames({
        [`form-select form-select-${size} mb-3`]: true,
        [className as string]: className
    })

    const filterdOption = (option: any) => {
        filterdOptions.forEach(item => {
            if (item.value === option.value) {
                item.selected = false;
            }
        })
        setFilterdOptions(filterdOptions); // 这句竟然加和不加都可以。。。
    }

    const handleSelect = (option: any) => {
        option.selected = true;
        let hasSelected = selectedOptions.some(item => item.label === option.label);
        const nowSelectedList = selectedOptions.filter(item => item.label !== option.label);
        // 这句话写不写都可以，因为在下面的 useEffect中也为该变量赋值了
        setSelectedOptions(hasSelected ? nowSelectedList : [...selectedOptions, option]);
        hasSelected && filterdOption(option);
        setShowSelectedOptions(true);
        // 这里不能直接用 selectedOptions这个状态，会有延迟
        // 要用原来所有的状态，去过滤掉没选上的，再传递给父组件
        const selectedList = (hasSelected ? nowSelectedList : [...selectedOptions, option])
        onMultipleSelectChangeOK && onMultipleSelectChangeOK(selectedList);
    }

    const handleInputClick = (e: any) => {
        setIsHighlighted(true);
        // 这个时候也要重新过滤数据
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        searchValueRef.current = value;
        onChangeOK && onChangeOK(e.target.value);
        // 输入改变的时候重新过滤
    }

    // 选项的ref数组--巧妙


    const handleDeleteItem = (item: any) => {
        const selectedList = selectedOptions.filter(option => option !== item);
        setSelectedOptions(selectedList);
        setFilterdOptions(filterdOptions.map((v: any) => {
            if (v.label === item.label) {
                v.selected = false;
            }
            return v;
        }))
        onChangeOK && onChangeOK(selectedList);
    }

    const handleFocus = () => {
        setIsHighlighted(true);
    }

    const handleBlur = () => {
    }

    // 一些用来判断选项是否展示的的Ref
    const multipleInputRef = useRef<any>();
    const selectListRef = useRef<any>();
    // 巧妙

    const multipleSelectWrapperFormControlRef = useRef<any>();

    useEffect(() => {
        window.addEventListener("click", (e: any) => {
            // 用类名方便
            let classNames = ["multiple-input", "option-item", "option-item false", "option-item multiple-select-active", "select-list", "selected-option", "multiple-select-wrapper form-control ", "multiple-select-wrapper form-control focus"];
            // let classNames = ["multiple-input", "select-list", "selected-option", "multiple-select-wrapper form-control ", "multiple-select-wrapper form-control focus"];
            /*  if (e.target === multipleInputRef.current || e.target === selectListRef.current || e.target === multipleSelectWrapperFormControlRef.current) {
                 return setShowOptions(true);
             } */
            if (classNames.includes(e.target.className)) {
                return setShowOptions(true);
            }

            // --巧妙
            // 点的是被选中的选项
            /*  if (selectedOptionRefs.some((ref: any) => ref.current === e.target)) {
                 return setShowOptions(true);
 
             } */
            // --巧妙
            // 点的不是 input框，也不是 选项，则将 active类名去掉，并且隐藏 选项
            /* if (!optionItemRefs.some((ref: any) => ref.current === e.target)) {
                setIsHighlighted(false);
                return setShowOptions(false);

            } */
            else {
                setIsHighlighted(false);
                setShowOptions(false);
            }
        })
    }, [])

    const newFilterOptions = (arr: any, item: any) => {
        arr.forEach((i: any) => {
            if (i.user_id === item.user_id) {
                i.selected = true;
            }
        })
        setFilterdOptions(arr);
    }

    // 让多选框默认展示父组件传递过来的值
    useEffect(() => {
        let arr: any[] = [];
        let tempFilterdOptions: any[] = []
        if (defaultValue?.length) {
            defaultValue?.map((item: any) => {
                tempOptions.some((option: any) => {

                    option.value === item.value && arr.push(item)
                    return false;
                });
                return false;
            })
            if (arr?.length) {
                setSelectedOptions(arr);
                setShowSelectedOptions(true);
                setTimeout(() => {
                    setFilterdOptions(preArr => {
                        preArr.forEach(item => {
                            tempFilterdOptions.push({ ...item, selected: arr.some(i => i.value === item.value) })
                        })
                        return tempFilterdOptions;
                    })
                }, 0);
            }
        } else {
            // setSelectedOptions([]);
            setFilterdOptions(options?.map(item => {
                item.selected = false;
                return item;
            }))
        }
    }, [defaultValue])

    useEffect(() => {
        if (selectedOptions.length) {
            selectedOptions.forEach((item: any) => {
                newFilterOptions(options, item);
            })
        } else {
            setFilterdOptions(options);
        }
    }, [options])


    useEffect(() => {
        console.log(disabled);
        
    }, [disabled])

    const clear = () => {
        multipleInputRef.current.value = "";
        setSelectedOptions([]);
        setFilterdOptions([]);
    }

    useImperativeHandle(ref, () => ({
        clear
    }));

    return <>
        <div ref={multipleSelectWrapperFormControlRef} tabIndex={0} onBlur={handleBlur}  className={`multiple-select-wrapper form-control ${isHighlighted ? "focus" : ""}`}>
            <div ref={selectListRef} className="select-list">
                {showSelected && showSelectedOptions && selectedOptions?.map((option, index) => {
                    return <div ref={selectedOptionRefs[index]} className="selected-option" key={option.value} style={{
                    }}>
                        {option.label}
                        <span onClick={() => handleDeleteItem(option)} className="option-icon">x</span>
                    </div>
                })}
            </div>
            <div className="input-control">
                <input ref={multipleInputRef} placeholder="输入关键词" onChange={(e) => handleInputChange(e)} onClick={handleInputClick} disabled={disabled} type="text" className="multiple-input" aria-label="Username" aria-describedby="basic-addon1" />
            </div>
        </div>
        {!disabled && showOptions &&
            <div style={{position: "relative"}} className="option-wrapper multiple-select-option-wrapper">
                {filterdOptions?.map((option: any, index: number) => {
                    // --巧妙
                    return <div ref={optionItemRefs[index]} key={index} onClick={() => handleSelect(option)} className={`option-item ${option.selected && "multiple-select-active"}`}>
                        {option.label}
                    </div>
                })}
            </div>}
    </>

})

export default MultipleSelect;