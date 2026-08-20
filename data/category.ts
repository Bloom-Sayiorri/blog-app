import prisma from "@/lib/prisma";

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