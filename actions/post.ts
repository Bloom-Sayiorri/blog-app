"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreatePostSchema = z.object({
	title: z.string().min(5),
	content: z.string().min(10),
	excerpt: z.string().optional().nullable(),
	categoryId: z.string().optional().nullable(),
});

export async function createPost(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Unauthorized.",
		};
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
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
		};
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

		revalidatePath("/blog");

		return {
			success: true,
			message: "Post created successfully.",
			data: post,
		};
	} catch (error: any) {
		if (error.code === "P2002") {
			return {
				success: false,
				message: "A post with this slug already exists.",
			};
		}

		console.error(error);

		return {
			success: false,
			message: "Failed to create post.",
		};
	}
}

export async function editPost(postId: string) {}

export async function deletePost(postId: string) {
	// const session = await getSession();
	// if(!session?.user?.id) return { error: "Unauthorized" };
	try {
		await prisma.post.delete({
			where: {
				id: postId,
				// authorId: session.user.id,
			},
		});
		revalidatePath("/posts");
		return { success: true };
	} catch (error: any) {
		return { error: `Failed to delete post in database. ${error}` };
	}
}

