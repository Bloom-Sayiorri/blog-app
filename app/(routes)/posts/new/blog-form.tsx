"use client";

import { createPost } from "@/app/actions/posts";

export default function Blogform() {
	const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const fileInput = document.getElementById("coverImage") as HTMLInputElement;
		const file = fileInput?.files?.[0];

		const uploadedBlobUrl = "https://vercel-storage.com";

		const formData = new FormData(e.currentTarget);
		const rawFields = {
			title: formData.get("title"),
			content: formData.get("content"),
			published: formData.get("published"),
		};

		const result = await createPost(formData, uploadedBlobUrl);

		if (!result.success) {
			console.error("Validation or server errors:", result.error || result.message);
		} else {
			console.log("Post created successfully!", result.data);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="">
                <h1 className="">New Blog</h1>
                <div>
                    <label></label>
                    <input />
                </div>
            </form>
		</div>
	);
}
