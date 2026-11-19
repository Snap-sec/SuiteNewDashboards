


function IconButton({ icon, onClick, className = '', title = '', disabled = false }) {
  return (
    <button
      disabled={disabled}
      type="button"
      className={`cursor-pointer group focus-visible:outline-hidden inline-flex items-center justify-center has-data-[arrow=true]:justify-between whitespace-nowrap font-medium ring-offset-background transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground h-8.5 rounded-md px-3 gap-1.5 text-[0.8125rem] leading-(--text-sm--line-height) [&_svg:not([class*=size-])]:size-4 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg:not([role=img]):not([class*=text-])]:opacity-60 ${className}`}
      onClick={onClick}
      title={title}>
      {icon}
    </button>
  );
}

export default IconButton;