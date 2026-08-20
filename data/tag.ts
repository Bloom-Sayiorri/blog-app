import prisma from "@/lib/prisma";

export async function getTags() {
    try {
        const tags = await prisma.tag.findMany({
            orderBy: {
                name: "asc",
            },
            include: {
                _count: {
                    select: {
                        posts: true,
                    },
                },
            },
        });
        if (!tags) {
            return { success: false, message: "Tags not found." };
        }

        return { success: true, message: "Tags retrieved successfully.", data: tags };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to retrieve tags." };
    }
}

export async function getTag(id: string) {
    try {
        const tag = await prisma.tag.findUnique({
            where: {
                id,
            },
            include: {
                posts: {
                    include: {
                        post: {
                            select: {
                                id: true,
                                title: true,
                                slug: true,
                                coverImage: true,
                                published: true,
                            },
                        },
                    },
                },
            },
        });

        if (!tag) {
            return { success: false, message: "Tag not found." };
        }

        return { success: true, message: "Tag retrieved successfully.", data: tag };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to retrieve tag." };
    }
}