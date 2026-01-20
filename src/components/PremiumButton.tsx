import React from 'react';

interface PremiumButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    disabled?: boolean;
    variant?: 'outline' | 'solid';
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
    className?: string;
}

export default function PremiumButton({
    children,
    onClick,
    href,
    disabled = false,
    className = "",
    fullWidth = false,
    type = "button",
    variant = "outline"
}: PremiumButtonProps) {
    const commonStyles = `
        appearance-none
        rounded-[15px]
        cursor-pointer
        ${fullWidth ? 'w-full flex justify-center' : 'inline-block'}
        font-semibold
        text-base
        leading-normal
        min-h-[60px]
        outline-none
        px-9
        py-4
        text-center
        no-underline
        transition-all
        duration-300
        ease-[cubic-bezier(0.23,1,0.32,1)]
        select-none
        disabled:pointer-events-none
        disabled:opacity-50
    `;

    const variants = {
        outline: `
            bg-transparent
            border-2
            border-black
            dark:border-white
            text-neutral-800
            dark:text-neutral-200
            hover:text-white
            hover:bg-black
            dark:hover:bg-white
            dark:hover:text-black
            hover:shadow-[0_8px_15px_rgba(0,0,0,0.25)]
            hover:-translate-y-0.5
            active:shadow-none
            active:translate-y-0
        `,
        solid: `
            bg-black
            dark:bg-white
            text-white
            dark:text-black
            border-2
            border-black
            dark:border-white
            hover:bg-neutral-800
            dark:hover:bg-neutral-200
            hover:shadow-lg
            hover:-translate-y-0.5
            active:translate-y-0
        `
    };

    const styles = `${commonStyles} ${variants[variant]} ${className}`.replace(/\s+/g, ' ').trim();

    if (href) {
        return (
            <a href={href} className={styles}>
                {children}
            </a>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={styles}
        >
            {children}
        </button>
    );
}
