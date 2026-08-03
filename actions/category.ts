"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";
import { CategorySchema } from "@/validators/category";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {}

export async function getCategories() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: "asc" },
			include: {
				_count: {
					select: {
						posts: true,
					},
				},
			},
		});
		return { success: true, message: "Categories retrieved successfully.", data: categories };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retrieve categories" };
	}
}

export async function getCategory(id: string) {
	try {
		const category = await prisma.category.findUnique({
			where: { id },
			include: {
				posts: {
					select: {
						id: true,
						title: true,
						slug: true,
						coverImage: true,
						published: true,
						createdAt: true,
					},
				},
			},
		});
		return { success: true, message: "Category retrieved successfully.", data: category };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retrieve category." };
	}
}

export async function updateCategory(formData: FormData) {
	const session = await auth();

	if (!session?.user.id || session?.user.role !== "ADMIN") {
		return { success: false, message: "Unathorized access. Please login." };
	}
	const id = formData.get("id") as string;
	const categoryData = {
		name: formData.get("name") as string,
		slug: formData.get("slug") as string,
	};
    try {
        await prisma.category.update({
            where: { id },
            data: categoryData,
        });
        return { success: true, message: "Category updated successfully." };
    } catch(error) {
        console.error(error);
        return { success: false, message: "Category update failed." };
    }
}

export async function deleteCategory(categoryId: string) {
	const session = await auth();
	if (!session?.user.id) {
		return { success: false, message: "Unauthorized. Please login." };
	}
	try {
		await prisma.category.delete({
			where: { id: categoryId },
		});
		return { success: false, message: "Category deleted successfully." };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to delete category." };
	}
}
