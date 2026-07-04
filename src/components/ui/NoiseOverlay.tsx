interface NoiseOverlayProps {
    opacity?: number;
    className?: string;
}

export default function NoiseOverlay({ opacity = 0.03, className = '' }: NoiseOverlayProps) {
    return (
        <div
            className={`absolute inset-0 bg-noise pointer-events-none ${className}`}
            style={{ opacity }}
        />
    );
}
