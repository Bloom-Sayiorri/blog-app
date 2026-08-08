import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { generateSlug } from "@/utils/slug";
import { getRandomItem } from "@/utils/randomItem";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({
	adapter,
});

type DummyPost = {
	id: number;
	title: string;
	body: string;
	tags: string[];
	userId: number;
};

type DummyUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	image: string;
};

async function main() {
	console.log("Clearing existing database data...");
	await prisma.like.deleteMany();
	await prisma.comment.deleteMany();
	await prisma.postTag.deleteMany();
	await prisma.post.deleteMany();
	await prisma.category.deleteMany();
	await prisma.account.deleteMany();
	await prisma.session.deleteMany();
	await prisma.verificationToken.deleteMany();
	await prisma.user.deleteMany();
	await prisma.contact.deleteMany();
	console.log("Database cleared.");

	console.log("Starting database seed...");

	// --------------------------------------------------
	// 1. Fetch users from DummyJSON
	// --------------------------------------------------

	const usersResponse = await fetch("https://dummyjson.com/users?limit=10");

	const usersData = await usersResponse.json();

	const dummyUsers: DummyUser[] = usersData.users;

	// --------------------------------------------------
	// 2. Create users
	// --------------------------------------------------

	const usersArr = [];

	for (const user of dummyUsers) {
		const dbUser = await prisma.user.upsert({
			where: {
				email: user.email,
			},
			update: {},
			create: {
				username: `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`,
				email: user.email,
				avatar: user.image,
				role: "USER",
			},
		});

		usersArr.push({
			dummyId: user.id,
			dbId: dbUser.id,
		});
	}

	console.log(`Created/found ${usersArr.length} users.`);

	// --------------------------------------------------
	// 3. Create categories
	// --------------------------------------------------

	const categoriesData = [
		{
			name: "Technology",
			slug: "technology",
		},
		{
			name: "Business",
			slug: "business",
		},
		{
			name: "Lifestyle",
			slug: "lifestyle",
		},
		{
			name: "Education",
			slug: "education",
		},
		{
			name: "Health",
			slug: "health",
		},
	];

	const categories = [];

	for (const category of categoriesData) {
		const dbCategory = await prisma.category.upsert({
			where: {
				slug: category.slug,
			},
			update: {},
			create: category,
		});

		categories.push(dbCategory);
	}

	console.log(`Created/found ${categories.length} categories.`);

	// --------------------------------------------------
	// 4. Fetch posts from DummyJSON
	// --------------------------------------------------

	const postsResponse = await fetch("https://dummyjson.com/posts?limit=100");

	const postsData = await postsResponse.json();

	const dummyPosts: DummyPost[] = postsData.posts;
	const dummyPost = dummyPosts.map((post) => post);

	// --------------------------------------------------
	// 5. Create posts
	// --------------------------------------------------

	for (const [index, post] of dummyPosts.entries()) {
		let users = await prisma.user.findMany({
			select: { id: true },
		});

		if (users.length === 0) {
			throw new Error("No users available for post authors.");
		}

		const category = categories[index % categories.length];

		const author = getRandomItem(users);
		await prisma.post.create({
			data: {
				title: post.title,
				slug: `${generateSlug(post.title)}-${post.id}`,
				excerpt: post.body.slice(0, 150),
				content: post.body,
				published: true,
				categoryId: category.id,
				authorId: author.id,
			},
		});
		console.log(post.title, "=>", generateSlug(post.title));
	}

	// 	console.log(`Seeded ${dummyPosts.length} posts.`);

	console.log("Database seeding started.");

	// --------------------------------------------------
	// 	 6. Create comments
	// --------------------------------------------------

	const users = await prisma.user.findMany({
		select: {
			id: true,
		},
	});

	const posts = await prisma.post.findMany({
		select: {
			id: true,
		},
	});

	if (users.length === 0 || posts.length === 0) {
		throw new Error("Users and posts are required before seeding comments.");
	}

	const commentTexts = [
		"Really enjoyed reading this!",
		"This was very informative.",
		"Great post. Thanks for sharing.",
		"I learned something new from this.",
		"Very interesting perspective.",
		"Well written and easy to understand.",
		"This is exactly what I was looking for.",
		"Great explanation!",
		"I would love to see more posts like this.",
		"Thanks for putting this together.",
	];

	for (let i = 0; i < 50; i++) {
		const user = getRandomItem(users);
		const post = getRandomItem(posts);

		await prisma.comment.create({
			data: {
				content: getRandomItem(commentTexts),
				userId: user.id,
				postId: post.id,
			},
		});
	}

	console.log("Seeded 50 comments.");

	// --------------------------------------------------
	// 	 7. Create likes
	// --------------------------------------------------

	for (const post of posts) {
		const shuffledUsers = [...users].sort(() => Math.random() - 0.5);

		const numberOfLikes = Math.floor(Math.random() * Math.min(users.length, 6));

		for (const user of shuffledUsers.slice(0, numberOfLikes)) {
			await prisma.like.create({
				data: {
					userId: user.id,
					postId: post.id,
				},
			});
		}
	}

	console.log("Seeded likes.");

	// --------------------------------------------------
	// 	 8. Create contacts
	// --------------------------------------------------

	const existingUsers = await prisma.user.findMany({
		select: {
			username: true,
			email: true,
		},
		take: 10,
	});

	const contactSubjects = [
		"Question about the blog",
		"Feedback",
		"Content suggestion",
		"Technical issue",
		"General inquiry",
	];

	const contactMessages = [
		"I really enjoyed the content on the site.",
		"I have a question about one of your articles.",
		"I wanted to suggest a topic for a future post.",
		"I noticed something that may need to be fixed.",
		"Great website. I wanted to share some feedback.",
	];

	for (const user of existingUsers) {
		await prisma.contact.create({
			data: {
				name: user.username ?? "User",
				email: user.email,
				subject: getRandomItem(contactSubjects),
				message: getRandomItem(contactMessages),
			},
		});
	}

	const randomNames = [
		"John Kamau",
		"Mary Wanjiku",
		"Brian Otieno",
		"Sarah Mwangi",
		"David Kariuki",
		"Grace Achieng",
		"Daniel Mutua",
		"Lucy Njeri",
		"Kevin Ouma",
		"Ann Wambui",
		"Peter Kimani",
		"Jane Atieno",
		"Michael Maina",
		"Faith Chebet",
		"James Kiplagat",
		"Mercy Nyambura",
		"Samuel Odhiambo",
		"Ruth Muthoni",
		"Eric Mwangi",
		"Carol Akinyi",
	];

	for (let i = 0; i < 20; i++) {
		const name = randomNames[i];

		await prisma.contact.create({
			data: {
				name,
				email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
				subject: getRandomItem(contactSubjects),
				message: getRandomItem(contactMessages),
				isRead: Math.random() > 0.5,
			},
		});
	}

	console.log("Seeded 30 contacts.");

	console.log("Database seed completed successfully.");
}

main()
	.catch((error) => {
		console.error("Seed failed:", error);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});