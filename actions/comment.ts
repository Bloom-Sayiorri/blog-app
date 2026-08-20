"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentSchema } from "@/validators/comment";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
	const session = await auth();

	if (!session?.user.id) {
		return {
			success: false,
			message: "Please login to continue.",
		};
	}

	if (session?.user.role !== "ADMIN") {
		return {
			success: false,
			message: "Unauthorized access. Only admins can perform this action.",
		};
	}

	const validation = CommentSchema.safeParse({
		content: formData.get("content"),
	});

	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const { content } = validation.data;
	const postId = formData.get("postId") as string;

	try {
		const comment = await prisma.comment.create({
			data: {
				content,
				post: {
					connect: {
						id: postId,
					},
				},
				user: {
					connect: {
						id: session.user.id,
					},
				},
			},
			include: {
				user: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
			},
		});

		revalidatePath(`/posts/${postId}`);

		return {
			success: true,
			message: "Comment added successfully.",
			data: comment,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to add comment.",
		};
	}
}

export async function updateComment(formData: FormData) {
	const session = await auth();

	if (!session?.user.id) {
		return {
			success: false,
			message: "Please login to continue.",
		};
	}

	const validation = CommentSchema.safeParse({
		content: formData.get("content"),
	});

	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const { content } = validation.data;
	const commentId = formData.get("content") as string;

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});

		if (!comment) {
			return {
				success: false,
				message: "Comment not found.",
			};
		}
		const isOwner = comment.userId === session.user.id;
		if(!isOwner || session.user.role !== "ADMIN") {
			return {
				success: false,
				message: "Please login to continue.",
			};
		}
		const updatedComment = await prisma.comment.update({
			where: {
				id: commentId,
			},
			data: {
				content,
			},
		});

		revalidatePath("/posts");
		revalidatePath(`/posts/${comment.postId}`);

		return {
			success: true,
			message: "Comment updated successfully.",
			data: updatedComment,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to update comment.",
		};
	}
}

export async function deleteComment(commentId: string) {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Please login to continue.",
		};
	}

	try {
		const comment = await prisma.comment.findUnique({
			where: {
				id: commentId,
			},
		});

		if (!comment) {
			return {
				success: false,
				message: "Comment not found.",
			};
		}

		const isOwner = comment.userId === session.user.id;
		if (!isOwner || session.user.role !== "ADMIN") {
			return {
				success: false,
				message: "Unauthorized access. Only admins can perform this action.",
			};
		}

		await prisma.comment.delete({
			where: {
				id: commentId,
			},
		});

		revalidatePath(`/posts/${comment.postId}`);

		return {
			success: true,
			message: "Comment deleted successfully.",
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to delete comment.",
		};
	}


}