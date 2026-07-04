import { LucideIcon } from 'lucide-react';

interface IconWithBadgeProps {
    icon: LucideIcon;
    count: number;
    onClick: () => void;
    'aria-label': string;
    badgeColor?: string;
}

export default function IconWithBadge({ icon: Icon, count, onClick, 'aria-label': ariaLabel, badgeColor = 'bg-black dark:bg-white text-white dark:text-black' }: IconWithBadgeProps) {
    return (
        <button
            onClick={onClick}
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors group"
            aria-label={ariaLabel}
        >
            <Icon className="w-6 h-6 text-neutral-900 dark:text-white group-hover:scale-110 transition-transform" />

            {count > 0 && (
                <div className={`absolute -top-1 -right-1 ${badgeColor} text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-black`}>
                    {count}
                </div>
            )}
        </button>
    );
}
