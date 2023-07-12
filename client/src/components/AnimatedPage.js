import React, { useState, useEffect } from 'react';

const AnimatedPage = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);

        // Hide the message after 3 seconds
        const timeout = setTimeout(() => {
            setIsVisible(false);
        }, 3000);

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className={`p-4 font-bold text-white rounded ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                {type === 'error' && <span>Error: </span>}
                {message}
            </div>

        </div>
    );
};

export default AnimatedPage;
