import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getComments(postId: string) {
	const session = await auth();

	if (!session?.user?.id) {
		return {
			success: false,
			message: "Please login to continue.",
		};
	}

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
		
		if(!comments) {
			return { success: false, message: "Comments not found." };
		}

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