import React from "react";

type ButtonProps = React.ComponentProps<"button"> & {
	variant: "primary" | "secondary" | "danger" | "success";
	children: React.ReactNode;
};

export default function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
	const variants = {
		primary: "bg-blue-600 hover:bg-blue-700 text-white focus:bg-white focus:text-blue-700",
		secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900 focus:bg-white focus:text-gray-700",
		danger: "bg-red-600 hover:bg-red-700 text-white focus:bg-white focus:text-red-700",
		success: "bg-green-500 hover-bg-green-700 text-white focus:bg-white focus:text-green-700",
	};

	return <button className={`px-3 py-2 rounded-md transition ${className} ${variants[variant]}`} {...props}>{children}</button>;
}