import React from 'react'

type Props = {
    children?: React.ReactNode
    onClick?: () => void
}

const Button = ({
    children,
    onClick
}: Props) => {
    return (
        <button
            onClick={onClick}
            // style={{
            //     backgroundColor: colors.primary,
            // }}
            className='p-2 bg-primary px-4 rounded-md font-semibold text-white cursor-pointer text-center border-none'
        >{children}</button>
    )
}

export default Button