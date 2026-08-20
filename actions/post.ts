"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";
import { CreatePostSchema, UpdatePostSchema } from "@/validators/post";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
	const session = await auth();

	if (!session?.user.id) {
		return { success: false, message: "Please login to continue." };
	}

	const imageFile = formData.get("coverImage") as File;

	let coverImageUrl: string | undefined;

	if (imageFile && imageFile.size > 0) {
		const blob = await put(`blog-covers/${Date.now()}-${imageFile.name}`, imageFile, {
			access: "public",
		});
		coverImageUrl = blob.url;
	}

	const validation = CreatePostSchema.safeParse({
		title: formData.get("title"),
		content: formData.get("content"),
		excerpt: formData.get("excerpt"),
		categoryId: formData.get("categoryId"),
	});

	if (!validation.success) {
		return { success: false, errors: validation.error.flatten().fieldErrors };
	}

	const { title, content, excerpt, categoryId } = validation.data;

	const slug = generateSlug(title);

	try {
		const post = await prisma.post.create({
			data: {
				title,
				slug,
				content,
				excerpt,
				coverImage: coverImageUrl,
				author: {
					connect: {
						id: session.user.id,
					},
				},
				...(categoryId && {
					category: {
						connect: {
							id: categoryId,
						},
					},
				}),
			},

			select: {
				id: true,
				title: true,
				slug: true,
				excerpt: true,
				coverImage: true,
				published: true,
				createdAt: true,
			},
		});

		revalidatePath("/dashboard/posts");
		revalidatePath("/posts");

		return {
			success: true,
			message: "Post created successfully.",
			data: post,
		};
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to create post." };
	}
}

export async function updatePost(formData: FormData) {
	const session = await auth();

	const postData = UpdatePostSchema.safeParse({
		title: formData.get("title") as string,
		content: formData.get("content") as string,
		excerpt: formData.get("excerpt") as string,
		published: formData.get("published") === "true",
	});
	if (!postData.success) {
		return { success: false, error: postData.error.flatten().fieldErrors };
	}
	const id = formData.get("id");

	if (!id || typeof id !== "string") {
		return { success: false, message: "Invalid post id." };
	}
	const existingPost = await prisma.post.findUnique({
		where: { id },
		select: { authorId: true },
	});

	if (!existingPost) {
		return { success: false, message: "Post not found." };
	}
	if (existingPost.authorId !== session?.user.id) {
		return { success: false, message: "You do not have persmission to perform this action." };
	}
	const { title, content, excerpt, published } = postData.data;

	const slug = generateSlug(title);

	try {
		const post = await prisma.post.update({
			where: { id },
			data: { title, slug, content, excerpt, published },
		});
		revalidatePath("/posts");
		revalidatePath(`/posts/${post.slug}`);
		revalidatePath("/dashboard/posts");
		return { success: true, message: "Post updated successfully.", data: post };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to update post." };
	}
}

export async function deletePost(postId: string) {
	const session = await auth();
	const existingPost = await prisma.post.findUnique({
		where: { id: postId },
		select: { authorId: true },
	});

	if (!existingPost) {
		return { success: false, message: "Post not found." };
	}
	if (!session?.user.id) {
		return { success: false, message: "Please login to continue." };
	}
	if (existingPost.authorId !== session?.user.id && session.user.role !== "ADMIN") {
		return { success: false, message: "You do not have persmission to perform this action." };
	}
	try {
		await prisma.post.delete({
			where: {
				id: postId,
			},
		});
		revalidatePath("/posts");
		revalidatePath("/dashboard/posts");
		return { success: true, message: "Post deleted successfully." };
	} catch (error) {
		return { success: false, message: "Failed to delete post in database" };
	}
}