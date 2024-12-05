import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';




export default function Projects() {




    return (
        <div className="justify-between min-w-full p-9 truncate">
                <h1 className='text-3xl font-bold'>
                    {'Projects'}
                </h1>
                <span className='flex items-center'>
                    <Button>{'Download'}</Button>
                </span>
        </div>
    )
}
