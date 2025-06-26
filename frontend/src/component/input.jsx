function Input({label,type='text',onChange,value,placeholder}) {
    return <div className="flex flex-col gap-2"><span>{label}</span>
        <input  className={`bg-cyan-800 p-3 rounded-lg outline-none ${type==='number'?"w-24":"w-80"}`}  type={type} onChange={onChange} value={value} placeholder={placeholder} />
    </div>
}
export default Input;