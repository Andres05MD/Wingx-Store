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
                py-2 px-4
                text-center 
                inline-flex justify-center items-center
                text-xs font-semibold uppercase 
                text-white
                rounded-full
                border-solid 
                transition-transform duration-300 ease-in-out 
                group 
                outline-offset-4 
                focus:outline focus:outline-2 focus:outline-white focus:outline-offset-4 
                overflow-hidden
                bg-black/80 dark:bg-white/90
                dark:text-black
                ${className}
            `}
        >
            <span className="relative z-20">{children}</span>

            {/* Animated shine effect */}
            <span className="absolute left-[-75%] top-0 h-full w-[50%] bg-white/30 dark:bg-black/30 rotate-12 z-10 blur-lg group-hover:left-[125%] transition-all duration-1000 ease-in-out" />

            {/* Corner borders - top left */}
            <span className="w-1/2 transition-all duration-300 block border-white dark:border-black absolute h-[20%] rounded-tl-lg border-l-2 border-t-2 top-0 left-0" />

            {/* Corner borders - top right */}
            <span className="w-1/2 transition-all duration-300 block border-white dark:border-black absolute group-hover:h-[90%] h-[60%] rounded-tr-lg border-r-2 border-t-2 top-0 right-0" />

            {/* Corner borders - bottom left */}
            <span className="w-1/2 transition-all duration-300 block border-white dark:border-black absolute h-[60%] group-hover:h-[90%] rounded-bl-lg border-l-2 border-b-2 left-0 bottom-0" />

            {/* Corner borders - bottom right */}
            <span className="w-1/2 transition-all duration-300 block border-white dark:border-black absolute h-[20%] rounded-br-lg border-r-2 border-b-2 right-0 bottom-0" />
        </button>
    );
}
