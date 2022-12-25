export default function Tooltip({ children, title, onClick = undefined }) {
    return (
        <div className="relative z-5 group" onClick={onClick}>
            {children}
            <div 
            className="
            absolute hidden
            group-hover:block       
            text-sm w-max px-4 py-2 z-10 left-1/2 -translate-x-1/2 leading-none text-white rounded-md bg-black shadow-lg">
            {title}
            </div>
        </div>
    )
}