" use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleLikes(postId: string) {
    const session = await auth();
    if(!session?.user.id) {
        return { success: false, message: "Please login to continue." };
    };
    const existingPost = await prisma.post.findUnique({
        where: { id: postId },
        select: {
            id: true,
            slug: true,
        }
    });
    if(!existingPost) {
        return { success: false, message: "Cannot perform this action. Post not found."}
    };

    const existingLike = await prisma.like.findUnique({
        where: { 
            userId_postId: {
                userId: session.user.id,
                postId,
            }
        },
    })
    if(existingLike) {
        await prisma.like.delete({
            where: {
                userId_postId: {
                    userId: session.user.id,
                    postId
                },
            },
        });
        revalidatePath(`/posts/${existingPost.id}`)
        return { success: true, message: "Like removed." };
    }

    await prisma.like.create({
        data: {
            userId: session.user.id,
            postId,
        }
    })
    revalidatePath(`/posts/${postId}`);
    return { success: true, message: "Like updated successfully." };
}