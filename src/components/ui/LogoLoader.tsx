export default function LogoLoader() {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex flex-col items-center gap-4">
                <img
                    src="/isotipo-white.png"
                    alt="Wingx"
                    className="w-16 h-16 opacity-20 dark:opacity-15 animate-pulse"
                />
            </div>
        </div>
    );
}
