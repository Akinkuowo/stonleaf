"use client";

import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, duration = 3000 }) => {
    const [shouldRender, setShouldRender] = useState(isVisible);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!shouldRender && !isVisible) return null;

    return (
        <div
            className={`fixed bottom-8 right-8 z-50 transform transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
            onTransitionEnd={() => {
                if (!isVisible) setShouldRender(false);
            }}
        >
            <div className="bg-white border border-gray-100 shadow-2xl rounded-xl p-4 flex items-center gap-4 min-w-[320px] backdrop-blur-sm bg-white/95">
                <div className="bg-green-100 p-2 rounded-full">
                    <FiCheckCircle className="text-green-600 text-xl" />
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-900">{message}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Item added to your collection.</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <FiX className="text-lg" />
                </button>
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-b-xl transition-all duration-[3000ms] ease-linear w-full origin-left" style={{
                    transitionDuration: `${duration}ms`,
                    width: isVisible ? '0%' : '100%'
                }} />
            </div>
        </div>
    );
};

export default Toast;
