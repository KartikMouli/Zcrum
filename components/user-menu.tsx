"use client"
import { UserButton } from '@clerk/nextjs'
import { ChartNoAxesColumn } from 'lucide-react'
import React from 'react'


const UserMenu = () => {
    return (
        <UserButton appearance={
            {
                elements: {
                    avatarBox: "w-10 h-10",
                }
            }
        }>

            <UserButton.MenuItems>
                <UserButton.Link href="/onboarding"
                    label='My Organizations'
                    labelIcon={<ChartNoAxesColumn size={18} />}
                />
            </UserButton.MenuItems>

            <UserButton.Action label='manageAccount' />
        </UserButton>
    )
}

export default UserMenu