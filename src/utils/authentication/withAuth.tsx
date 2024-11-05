"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext'; // Adjust the path as necessary
import InfinityLoader from '@/components/Loaders/InfinityLoader';

type WithAuthProps = {
    [key: string]: any;
};

const withAuth = <P extends WithAuthProps>(Component: React.ComponentType<P>) => {
    const WithAuth = (props: P) => {
        const [isLoading, setIsLoading] = useState<boolean>(true);
        const router = useRouter();
        const { token, isLoading: userLoading } = useUser(); // Get token and loading state from UserContext

        useEffect(() => {
            // Check if the user is authenticated
            if (!userLoading) {
                if (!token) {
                    router.replace('/login'); // Use replace to prevent going back
                } else {
                    setIsLoading(false); // Only set loading false if authenticated
                }
            }
        }, [router, token, userLoading]);

        if (isLoading) {
            return <InfinityLoader />; 
        }

        return <Component {...props} />;
    };

    return WithAuth;
};

export default withAuth;
