import React from 'react'

const InputField = ({...props}) => {
    return (
        <>
            <div className='flex justify-center'>
                <input {...props} />
            </div>
        </>
    )
}

export default InputField