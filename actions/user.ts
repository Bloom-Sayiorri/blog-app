"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
	const username = formData.get("username") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const bio = formData.get("bio") as string;
	const avatarFile = formData.get("avatar") as File | null;

	if (!username || !email || !password) {
		return { success: false, error: "Missing required fields: username, email, or password." };
	}

	try {
		let avatarUrl: string | null = null;
		if (avatarFile && avatarFile.size > 0) {
			if (avatarFile.size > 4.5 * 1024 * 1024) {
				return { success: false, error: "Avatar file size must be under 4.5MB." };
			}
			const blob = await put(`avatars/${username}-Date.now()}-${avatarFile.name}`, avatarFile, {
				access: "public",
				addRandomSuffix: true,
			});
			avatarUrl = blob.url;
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
				avatar: avatarUrl,
				bio: bio.trim() || null,
			},
		});
		const { password: _, ...safeUser } = user;
		return {
			success: true,
			message: "User created successfully.",
			data: safeUser,
		};
	} catch (error: any) {
		if (error.code === "P2002") {
			const target = error.meta?.target as string[];
			return {
				success: false,
				error: `A user with that ${target?.includes("email") ? "email" : "username"} already exists.`,
			};
		}
		console.error(error);
		return { success: false, message: "There was a problem signing in!" };
	}
}

export async function updateUser(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Unauthorized. Please sign in!" };
	}

	const username = formData.get("username") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const avatar = formData.get("avatar") as string;
	const bio = formData.get("bio") as string;

	try {
		const data: {
			username: string;
			email: string;
			password?: string;
			avatar: string;
			bio: string;
		} = {
			username,
			email,
			password,
			avatar,
			bio,
		};
		if (password.trim()) {
			data.password = await bcrypt.hash(password, 10);
		}
		await prisma.user.update({
			where: { id: session.user.id },
			data,
		});
		return { success: true, messages: "User details updated!" };
	} catch (error) {
		console.error(error);
		return { success: false, error: "Updating user failed!" };
	}
}

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
		return { success: false, message: "Failed to retreive users. "};
	}
}

export async function getUser(id: string) {
	const session = await auth();
	if(!session?.user.id) {
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

export async function deleteUser(id: string) {
	const session = await auth();
	if (!session?.user.id || session.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized!" };
	}
	try {
		await prisma.user.delete({
			where: { id },
		});
		return { success: true, message: "User deleted successfully!" };
	} catch (error) {
		console.error(error);
		return { error: "User does not exist!" };
	}
}