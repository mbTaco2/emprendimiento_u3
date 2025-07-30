export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-md border border-transparent bg-pastelGreen px-4 py-2 text-xs font-semibold uppercase tracking-widest text-black transition duration-150 ease-in-out hover:bg-pink focus:bg-pink focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-pink dark:bg-pastelGreen dark:text-gray-800 dark:hover:bg-pink dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
