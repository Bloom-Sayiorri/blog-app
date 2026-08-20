import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getUsers() {
	const session = await auth();
	if (!session?.user.id) {
		return { success: false, message: "Please login to continue." };
	}
	if (session?.user.role !== "ADMIN") {
		return { success: false, message: "Only admins can perform thia action." };
	}
	try {
		const users = await prisma.user.findMany({
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
				role: true,
				createdAt: true,
				_count: {
					select: {
						posts: true,
						comments: true,
						likes: true,
					},
				},
			},
		});
		if (!users) {
			return { success: false, message: "Users not found." };
		}
		return { success: true, message: " Users retrieved successfully.", data: users };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retreive users. " };
	}
}

export async function getUser(id: string) {
	const session = await auth();
	if (!session?.user.id) {
		return { success: false, message: "Please login to continue." };
	}
	try {
		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
				bio: true,
				role: true,
				createdAt: true,
			},
		});
		return { success: true, message: "User found successfully!", data: user };
	} catch (error) {
		console.error(error);
		return { error: "User does not exist!" };
	}

}