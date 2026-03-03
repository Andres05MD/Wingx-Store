import React from 'react';
import { ArrowRight } from 'lucide-react';

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
    const baseStyles = `
        appearance-none
        rounded-full
        cursor-pointer
        ${fullWidth ? 'w-full flex justify-center' : 'inline-flex items-center justify-center md:gap-2'}
        font-semibold
        text-sm
        leading-normal
        min-h-[48px]
        md:min-h-[52px]
        outline-none
        px-8
        py-3
        md:py-3.5
        text-center
        no-underline
        transition-all
        duration-500
        ease-[cubic-bezier(0.16,1,0.3,1)]
        select-none
        disabled:pointer-events-none
        disabled:opacity-50
        group/btn
    `;

    const variants = {
        outline: `
            bg-transparent
            border
            border-black/20
            dark:border-white/20
            text-black
            dark:text-white
            md:hover:bg-black
            md:hover:text-white
            md:hover:border-black
            md:dark:hover:bg-white
            md:dark:hover:text-black
            md:dark:hover:border-white
            md:hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]
            md:dark:hover:shadow-[0_8px_25px_rgba(255,255,255,0.1)]
            md:hover:-translate-y-0.5
            active:translate-y-0
            active:shadow-none
            backdrop-blur-sm
        `,
        solid: `
            bg-black
            dark:bg-white
            text-white
            dark:text-black
            border
            border-black
            dark:border-white
            md:hover:bg-neutral-800
            md:dark:hover:bg-neutral-200
            md:hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]
            md:dark:hover:shadow-[0_12px_30px_rgba(255,255,255,0.15)]
            md:hover:-translate-y-0.5
            active:translate-y-0
        `
    };

    const styles = `${baseStyles} ${variants[variant]} ${className}`.replace(/\s+/g, ' ').trim();

    const content = (
        <>
            {children}
            <ArrowRight className="hidden md:inline-block w-4 h-4 opacity-0 -translate-x-1 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
        </>
    );

    if (href) {
        return (
            <a href={href} className={styles}>
                {content}
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
            {content}
        </button>
    );
}
