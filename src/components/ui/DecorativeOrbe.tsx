interface DecorativeOrbeProps {
    className?: string;
    size?: string;
    color?: string;
    darkColor?: string;
}

export default function DecorativeOrbe({
    className = '',
    size = 'w-64 h-64',
    color = 'bg-black/[0.04]',
    darkColor = 'dark:bg-white/[0.04]',
}: DecorativeOrbeProps) {
    return (
        <div
            className={`absolute rounded-full blur-3xl ${size} ${color} ${darkColor} ${className}`}
        />
    );
}
