"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";
import { TagSchema } from "@/validators/tag";
import { revalidatePath } from "next/cache";

export async function createTag(formData: FormData) {
	const session = await auth();

	if (!session?.user?.id || session.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized." };
	}

	const validation = TagSchema.safeParse({
		name: formData.get("name"),
	});

	if (!validation.success) {
		return { success: false, errors: validation.error.flatten().fieldErrors };
	}

	const { name } = validation.data;
	const slug = generateSlug(name);

	try {
		const tag = await prisma.tag.create({
			data: {
				name,
				slug,
			},
		});

		revalidatePath("/admin/tags");

		return { success: true, message: "Tag created successfully.", data: tag };
	} catch (error: any) {
		if (error.code === "P2002") {
			return { success: false, message: "A tag with this name already exists." };
		}

		console.error(error);
		return { success: false, message: "Failed to create tag." };
	}
}

export async function updateTag(formData: FormData) {
	const session = await auth();

	if (!session?.user.id || session.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized." };
	}

	const id = formData.get("id") as string;

	const validation = TagSchema.safeParse({
		name: formData.get("name"),
	});

	if (!validation.success) {
		return { success: false, errors: validation.error.flatten().fieldErrors };
	}

	const { name } = validation.data;
	const slug = generateSlug(name);

	try {
		const tag = await prisma.tag.update({
			where: {
				id,
			},
			data: {
				name,
				slug,
			},
		});

		revalidatePath("/admin/tags");

		return { success: true, message: "Tag updated successfully.", data: tag };
	} catch (error: any) {
		if (error.code === "P2002") {
			return { success: false, message: "A tag with this name already exists." };
		}

		console.error(error);
		return { success: false, message: "Failed to update tag." };
	}
}

export async function deleteTag(tagId: string) {
	const session = await auth();

	if (!session?.user?.id || session.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized." };
	}
	try {
		const tag = await prisma.tag.findUnique({ where: { id: tagId } });

		if (!tag) {
			return { success: false, message: "Tag not found." };
		}
		await prisma.postTag.deleteMany({ where: { tagId } });

		await prisma.tag.delete({ where: { id: tagId } });

		revalidatePath("/admin/tags");
		revalidatePath("/posts");

		return { success: true, message: "Tag deleted successfully." };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to delete tag." };
	}
}