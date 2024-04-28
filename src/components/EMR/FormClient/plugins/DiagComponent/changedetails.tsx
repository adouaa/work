import React, { useEffect, useState } from 'react'

interface Props {
    title?: string,
    inputName: string,
    placeholder?: string,
    content: string,
    type: 'text' | 'datetime-local' | 'date',
    setValue: Function
}

function ChangeDetails({
    title,
    content,
    inputName,
    placeholder,
    type,
    setValue
}: Props) {

    return (
        <div className='my-2 d-flex text-nowrap align-items-center'>
            <span className='text-primary text-end text-nowrap' >{title}</span>
            {
                type === 'text' ? <input
                    name={inputName}
                    type="text"
                    autoComplete='off'
                    placeholder={placeholder}
                    value={content || ''}
                    onChange={(e) => {
                        setValue(e.currentTarget.name, e.currentTarget.value);
                    }}
                    className='form-control change-details'
                /> : <input
                    value={content || ''}
                    name={inputName}
                    onChange={(e) => {
                        setValue(e.currentTarget.name, e.currentTarget.value)
                    }}
                    type={type}
                    className='form-control change-details'
                    style={{ width: '200px' }}
                />
            }
        </div>
    )
}

export default ChangeDetails