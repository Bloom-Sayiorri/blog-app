"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ContactSchema } from "@/validators/contact";
import { auth } from "@/auth";

export async function createContactMessage(formData: FormData) {
	const messageData = ContactSchema.safeParse({
		name: formData.get("name") as string,
		email: formData.get("email") as string,
		subject: formData.get("subject") as string,
		message: formData.get("message") as string,
	});

	if (!messageData.success) {
		return { success: false, error: messageData.error.flatten().fieldErrors };
	}
	const { name, email, subject, message } = messageData.data;

	try {
		const contact = await prisma.contact.create({
			data: { name, email, subject, message },
		});
		revalidatePath("/admin/messages");
		return { success: true, message: "Contact message submitted successfully.", data: contact };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to send message." };
	}
}

export async function markMessageAsRead(id: string) {
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
		await prisma.contact.update({
			where: {
				id,
			},
			data: {
				isRead: true,
			},
		});
		revalidatePath("/admin/messages");
		return { success: true, message: "Contact messages marked as read." };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to mark contact message as read." };
	}
}

export async function deleteContactMessage(id: string) {
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
		await prisma.contact.delete({
			where: {
				id,
			},
		});
		revalidatePath("/admin/messages");
		return { success: true, message: "Contact message deleted successfully." };
	} catch (error) {
		console.error(error);
		return { success: false, message: "Failed to delete message." };
	}
}