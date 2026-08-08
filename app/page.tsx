"use client";

import { useEffect, useState } from "react";
import type { Blog } from "@/types/types";

export default function Home() {
	// const data = await fetch("https://dummyjson.com/posts/1/").then(res => res.json());
	// console.log(data.posts)
	const [post, setPost] = useState<Blog>();
	useEffect(() => {
		fetch("https://dummyjson.com/posts/1/")
			.then((res) => res.json())
			.then((data) => setPost(data));
	}, []);

	return <div className="">{<li key={post?.id}>{post?.title}</li>}</div>;
}
