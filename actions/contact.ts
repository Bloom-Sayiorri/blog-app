"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createContactMessage(data: { name: string; email: string; subject: string; message: string }) {
	if (!data.name || !data.email || !data.message || !data.subject) {
		return { success: false, message: "Validation failed", error: "All fieds are required" };
	}
	try {
		const contact = await prisma.contact.create({
			data,
		});

		return {
			success: true,
			message: "Contact details submitted successfully",
			data: contact,
		};
	} catch (error) {
		console.error(error);
		return {
			success: false,
			message: "Failed to send message.",
			error: "Internal server error",
		};
	}
}

export async function getContactMessages() {
	try {
		return await prisma.contact.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
	} catch (error) {
		console.error(error);
		return [];
	}
}

export async function getContactMessage(id: string) {
	try {
		return await prisma.contact.findUnique({
			where: {
				id,
			},
		});
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function markMessageAsRead(id: string) {
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
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function deleteContactMessage(id: string) {
	try {
		await prisma.contact.delete({
			where: {
				id,
			},
		});
		revalidatePath("/admin/messages");
		return {
			success: true,
		};
	} catch (error) {
		console.error(error);

		return {
			success: false,
			message: "Failed to delete message.",
		};
	}
}