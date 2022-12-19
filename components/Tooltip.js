export default function Tooltip({ children, title, onClick = undefined }) {
    return (
        <div className="relative z-10 group" onClick={onClick}>
            {children}
            <div className="
            absolute -left-14 hidden
            group-hover:block       
            text-sm w-max px-4 py-2 leading-none text-white rounded-md whitespace-no-wrap bg-black shadow-lg">
            {title}
            </div>
        </div>
    )
}