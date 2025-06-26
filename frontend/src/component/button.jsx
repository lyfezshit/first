function Button({ onClick, type, children }) {
    return <button className="p-2 rounded-lg bg-cyan-800  hover:bg-amber-300 hover:text-black outline-none" onClick={onClick} type={type}>{children}</button>

}
export default Button;