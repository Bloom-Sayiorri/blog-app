"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentSchema } from "@/validators/comment";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Please sign in to comment.",
		};
	}

	const validation = CommentSchema.safeParse({
		content: formData.get("content"),
		postId: formData.get("postId"),
	});

	if (!validation.success) {
		return {
			success: false,
			errors: validation.error.flatten().fieldErrors,
		};
	}

	const { content, postId } = validation.data;

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

export async function getComments(postId: string) {
	try {
		const comments = await prisma.comment.findMany({
			where: {
				postId,
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
			orderBy: {
				createdAt: "desc",
			},
		});

		return {
			success: true,
			message: "Comments retrieved successfully.",
			data: comments,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to retrieve comments.",
		};
	}
}

export async function updateComment(commentId: string, formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Unauthorized.",
		};
	}

	const content = formData.get("content") as string;

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

		if (comment.userId !== session.user.id) {
			return {
				success: false,
				message: "You are not allowed to edit this comment.",
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
			message: "Unauthorized.",
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

		if (comment.userId !== session.user.id) {
			return {
				success: false,
				message: "You are not allowed to delete this comment.",
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