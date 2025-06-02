module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['JetBrains Mono', 'monospace'],
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
        },
    },
    safelist: [
        "text-cyan-200",
        "hover:text-pink-300",
        "transition-colors",
        "text-lg",

        "hidden",
        "md:flex",
        "gap-6",
        "flex-wrap",
        "justify-center",
        "flex-1",
        "mx-8",

        "md:hidden",
        "text-3xl",
        "ml-auto",

        "flex",
        "flex-col",
        "items-center",
        "gap-3",
        "pb-4",
        "bg-[#0a0f1f]",

        "max-w-7xl",
        "mx-auto",
        "px-4",
        "py-4",
        "justify-between",
        "items-center",

        "bg-[#0a0f1f]",
        "shadow-lg",
        "z-10",

        "ml-auto"
    ],
    plugins: [require("daisyui")],
}
