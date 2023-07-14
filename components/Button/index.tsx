

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset" | undefined;
    theme: "red" | "blue" | "green" | "yellow";
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, disabled, type, theme }) => {
    // generate me a theme based on the props
    const themeClass = theme === "blue" ? "bg-blue-500 hover:bg-blue-700" : "bg-red-500 hover:bg-red-700"
    return (
        <button onClick={onClick} className={`${themeClass} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`} type={type}>{children}</button>
    );
}

export default Button;