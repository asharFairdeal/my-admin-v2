"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'; // Adjust the path as necessary
import InfinityLoader from '@/components/Loaders/InfinityLoader';

const Redirect: React.FC = () => {
    const router = useRouter();
    const { token, isLoading } = useUser();

    useEffect(() => {
        if (!isLoading) {
            const storeToken = localStorage.getItem('_t');
            if (storeToken || token) {
                router.replace('/home'); 
            } else {
                router.replace('/login'); 
            }
        }
    }, [router, token, isLoading]);

    return <InfinityLoader />; 
};

export default Redirect;
