import React from 'react';

interface GlowButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function GlowButton({ children, onClick, className = "" }: GlowButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`
                relative cursor-pointer 
                py-3 px-8
                text-center 
                inline-flex justify-center items-center
                text-xs font-semibold uppercase tracking-wider
                text-white dark:text-black
                rounded-full
                transition-all duration-300 ease-in-out 
                group 
                outline-none
                overflow-hidden
                bg-black dark:bg-white
                hover:shadow-xl hover:shadow-black/20 dark:hover:shadow-white/20
                hover:-translate-y-0.5
                ${className}
            `}
        >
            <span className="relative z-20">{children}</span>

            {/* Animated shine effect */}
            <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/20 dark:bg-black/10 rotate-12 z-10 blur-md group-hover:left-[125%] transition-all duration-1000 ease-in-out" />
        </button>
    );
}
