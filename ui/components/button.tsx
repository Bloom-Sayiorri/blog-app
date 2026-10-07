interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "success";
};

const variants = {
	primary: "bg-blue-600 hover:bg-blue-700 text-white hover:border-2 hover:border-blue-300 hover:bg-white hover:text-blue-600 focus:bg-blue-300 focus:text-blue-700 focus:ring-1 focus:ring-blue-500",
	secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:bg-white focus:text-gray-700",
	danger: "bg-red-600 hover:bg-red-700 text-white focus:bg-white focus:text-red-700",
	success: "bg-green-500 hover:bg-green-700 text-white focus:bg-white focus:text-green-700",
};

export default function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
	return (
		<button className={`${variants[variant]} px-3 py-2 rounded-md transition cursor-pointer ${className ?? ""}`} {...props}>
			{children}
		</button>
	);
}