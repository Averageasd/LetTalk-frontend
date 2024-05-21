export function LinkContainer({children}) {
    return (
        <ul className="flex flex-col gap-4 p-4 grow">
            {children}
        </ul>
    )
}