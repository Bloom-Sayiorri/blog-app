"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateSlug } from "@/utils/slug";
import { CategorySchema } from "@/validators/category";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
	const session = await auth();

	if (!session?.user.id || session?.user.role !== "ADMIN") {
		return { success: false, message: "Unathorized access." };
	}
	const validCategory = CategorySchema.safeParse({
		name: formData.get("name") as string,
	});

	if(!validCategory.success) {
		return { success: false, errors: validCategory.error.flatten().fieldErrors };
	}
	const { name } = validCategory.data;
	const slug = generateSlug(name);
	try {
		const category = await prisma.category.create({
			data: {
				name,
				slug,
			}
		})
		revalidatePath("/categories");
		revalidatePath("/posts");
		revalidatePath("/dashboard/categories");

		return { success: true, message: "Category created successfully", data: category };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to create category" };
	}
}

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
		if(!categories) {
			return { success: false, message: "Categories not found." };
		}
		return { success: true, message: "Categories retrieved successfully.", data: categories };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retrieve categories." };
	}
}

export async function getCategory(categoryId: string) {try {
		const category = await prisma.category.findUnique({
			where: { id: categoryId },
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
		if(!category) {
			return { success: false, message: "Category not found.",}
		}
		return { success: true, message: "Category retrieved successfully.", data: category };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to retrieve category." };
	}
}

export async function updateCategory(formData: FormData) {
	const session = await auth();

	if (!session?.user.id || session?.user.role !== "ADMIN") {
		return { success: false, message: "Unathorized access." };
	}

	const id = formData.get("id") as string;
	const categoryData = {
		name: formData.get("name") as string,
		slug: formData.get("slug") as string,
	};
	const existingCategory = await prisma.category.findUnique({ where: { id } });
	if(!existingCategory) {
		return { success: false, message: "Category not found." };
	}
    try {
        await prisma.category.update({
            where: { id: existingCategory.id },
            data: categoryData,
        });

		revalidatePath("/categories");
		revalidatePath("/posts");
		revalidatePath("/dashboard/categories");
		revalidatePath(`/categories/${categoryData.slug}`);

        return { success: true, message: "Category updated successfully." };
    } catch(error) {
        console.error(error);
        return { success: false, message: "Category update failed." };
    }
}

export async function deleteCategory(categoryId: string) {
	const session = await auth();
	if (!session?.user.id || session?.user.role !== "ADMIN") {
		return { success: false, message: "Unauthorized access." };
	}
	try {
		await prisma.category.delete({
			where: { id: categoryId },
		});

		revalidatePath("/categories");
		revalidatePath("/posts");
		revalidatePath("/dashboard/categories");

		return { success: false, message: "Category deleted successfully." };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to delete category." };
	}
}