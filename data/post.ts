import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getPost(id: string) {
	const session = await auth();
	if (!session?.user.id || session?.user.role !== "ADMIN") {
		return { success: false, message: "Please login to continue." };
	}
	try {
		const post = await prisma.post.findUnique({
			where: { id },
			select: {
				id: true,
				title: true,
				slug: true,
				content: true,
				excerpt: true,
				coverImage: true,
				published: true,
				createdAt: true,
				author: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
				category: {
					select: {
						id: true,
						name: true,
						slug: true,
					},
				},
				tags: {
					include: {
						tag: true,
					},
				},
				comments: {
					include: {
						user: {
							select: {
								id: true,
								username: true,
								avatar: true,
							},
						},
					},
				},
				_count: {
					select: {
						likes: true,
						comments: true,
					},
				},
			},
		});
		if (!post) {
			return { success: false, message: "Post does not exist." };
		}

		return { success: true, message: "Post retrieved succesfully.", data: post };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retreive post" };
	}
}

export async function getPosts() {
	try {
		const posts = await prisma.post.findMany({
			select: {
				id: true,
				title: true,
				slug: true,
				coverImage: true,
				excerpt: true,
				author: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
				category: {
					select: {
						name: true,
					},
				},
				_count: {
					select: {
						likes: true,
						comments: true,
					},
				},
			},
		});
		if (!posts) {
			return { success: false, message: "Failed to retireve posts." };
		}

		return { success: true, message: "Posts retrieved successfully.", data: posts };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retrieve posts." };
	}


}