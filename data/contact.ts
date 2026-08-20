import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function getContactMessages() {
    const session = await auth();
    if (!session?.user.id || session?.user.role !== "ADMIN") {
        return {
            success: false,
            message: "Only administrators can perform this action.",
        };
    }
    
    try {
        const contactMessages = await prisma.contact.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return { success: true, message: "Contact messages retrieved successfully.", data: contactMessages };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to retrieve contact messages." };
    }
}

export async function getContactMessage(id: string) {
    const session = await auth();

    if (!session?.user?.id) {
        return {
            success: false,
            message: "Please sign in to continue.",
        };
    }

    if (session.user.role !== "ADMIN") {
        return {
            success: false,
            message: "Only administrators can perform this action.",
        };
    }
    try {
        const contactMessage = await prisma.contact.findUnique({
            where: {
                id,
            },
        });
        return { success: true, message: "Contact messages retrieved successfully.", data: contactMessage };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to retrieve contact message." };
    }

}