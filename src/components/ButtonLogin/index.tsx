'use client'

import { LogIn } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react'
import { Button } from "../ui/button"

export function ButtonLogin() {
    const { status, data } = useSession()
    
    async function handleLogin() {
        await signIn();
    }

    async function handleLogout() {
        await signOut();
    }   

    return (
        <div className="flex justify-content-center mx-auto">
            {status === 'loading' &&
            <span>...</span>}

            {status === 'unauthenticated' &&
            <Button
                className='flex gap-2'
                onClick={handleLogin}
            >
               <LogIn className='w-4 h-4' /> Autenticar
            </Button>}

            {status === 'authenticated' &&
            <Button
                onClick={handleLogout}
            >
                Fazer logout
            </Button>}
        </div>
    )
}