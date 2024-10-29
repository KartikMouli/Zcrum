import React from 'react'



function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='flex justify-center pt-20 pb-5'>{children}</div>
    )
}

export default Layout