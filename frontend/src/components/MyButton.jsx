import React from 'react'

const MyButton = ({ ...props }) => {
    return (
        <>
            <div className="flex justify-center">
                <button {...props} className="btn btn-primary w-full m-8 hover:bg-amber-50 border-0"></button>
            </div>
        </>
    )
}

export default MyButton