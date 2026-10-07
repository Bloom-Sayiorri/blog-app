"use client";

import { useState } from "react";

export default function ContactForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		comments: "",
	});

	const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = new FormData(event.target);

		const name = form.get("name");
		const email = form.get("email");
		const message = form.get("message");
		const subject = `Portfolio contact from ${name}`;

		const body = `
			Name: ${name}
			Email: ${email}
			Message: ${message}
		`;
		window.location.href = `mailto:bloomsayiorri@gmail.com??subject=${encodeURIComponent(
			subject
		)}&body=${encodeURIComponent(body)}`;
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = event.currentTarget;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<div className="mt-8 flex flex-col gap-4 justify-center items-center">
			<h2 className="bg-linear-to-r from-[#5badff] to-[#1373d1] bg-clip-text text-transparent text-3xl my-3 uppercase text-center">
				Contact Me
			</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-6 w-75">
				<label htmlFor="name" className="text-left">
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					placeholder="Enter name..."
					className="contact-input"
					onChange={handleChange}
					required
				/>
				<label htmlFor="email" className="">
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					placeholder="Enter email..."
					className="contact-input"
					onChange={handleChange}
					required
				/>
				<label htmlFor="message" className="">
					Message
				</label>
				<textarea
					id="message"
					name="message"
					placeholder="Message..."
					onChange={handleChange}
					className="bg-transparent text-white border border-gray-400 rounded-3xl font-medium h-50 py-4 px-7 resize-none"
				/>
				<button
					type="submit"
					className="bg-[#2db9d5] text-white p-3 border-none rounded-[50px] cursor-pointer hover:bg-white hover:text-[#2db9d5]">
					Submit
				</button>
			</form>
		</div>
	);
}