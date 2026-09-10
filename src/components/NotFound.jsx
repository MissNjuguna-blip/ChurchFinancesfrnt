import React from 'react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-6'>
            <div className='text-center'>

                <h1 className='text-9xl font-extrabold text-teal-600 leading-none'>404</h1>
                <div className='w-16 h-1 bg-green-500 mx-auto my-4 rounded-full'></div>
                <h2 className='text-2l font-bold text-gray-800 mb-2'> Page Not Found</h2>
                <p className='flex items-center justify-center gap-3'>The page you're looking for doesnt exist or has been moved</p>

                <div className='flex items-center justify-center gap-3 my-4'>
                    <button onClick={() => navigate(-1)} className='px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 transition text-sm'><i class="bi bi-arrow-left-short"> </i> Back</button>
                    <button onClick={() => navigate("/")} className='px-5 py-2 border border-green-300 text-green-600 hover:bg-green-200 transition text-sm rounded-lg'>
                        Go Home
                    </button>

                </div>
            </div>

        </div>
    )
}

export default NotFound