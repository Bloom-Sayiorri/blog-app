"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { auth } from "@/auth";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { UpdateUserSchema } from "@/validators/user";

export async function updateUser(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Unauthorized. Please sign in!" };
	}

	const validatedFields = UpdateUserSchema.safeParse({
		username: formData.get("username") as string,
		email: formData.get("email") as string,
		password: formData.get("password") as string,
		avatar: formData.get("avatar"),
		bio: formData.get("bio") as string,
	});

	if (!validatedFields.success) {
		return { success: false, errors: validatedFields.error.flatten().fieldErrors, message: "Invalid fields." };
	}
	const { username, email, password, avatar, bio } = validatedFields.data;

	try {
		let avatarUrl: string | undefined;
		// Upload new avatar if one was provided
		if (avatar instanceof File && avatar.size > 0) {
			if (avatar.size > 4.5 * 1024 * 1024) {
				return {
					success: false,
					error: "Avatar file size must be under 4.5MB.",
				};
			}

			const blob = await put(`avatarFiles/${username}-${Date.now()}-${avatar.name}`, avatar, {
				access: "public",
				addRandomSuffix: true,
			});

			avatarUrl = blob.url;
		}

		const data = {
			username,
			email,
			...(bio !== undefined && { bio }),
			...(avatarUrl && { avatar: avatarUrl }),
			...(password && {
				password: await bcrypt.hash(password, 10),
			}),
		};

		await prisma.user.update({
			where: { id: session.user.id },
			data,
		});
		revalidatePath("/dashboard/users");
		return { success: true, messages: "User details updated!" };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Updating user failed!" };
	}
}

export async function deleteUser(id: string) {
	const session = await auth();
	if (!session?.user?.id || session.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized!" };
	}
	try {
		await prisma.user.delete({
			where: { id },
		});
		revalidatePath("/dashboard/users");
		return { success: true, message: "User deleted successfully!" };
	} catch (error) {
		console.error(error);
		return { error: "User does not exist!" };
	}
}