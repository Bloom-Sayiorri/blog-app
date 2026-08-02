export default async function PostsPage() {
	const data = await fetch("https://dummyjson.com/posts").then((res) => res.json());
	console.log(data.posts);

	return (
		<div className="">
			<p>Hello World</p>
			<ul>
				{data.posts.map((post: any) => (
					<li key={post.id}>
						<p>{post.title}</p>
					</li>
				))}
			</ul>
		</div>
	);
}