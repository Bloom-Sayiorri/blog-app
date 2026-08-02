
function seedBlogs() {
    return "seeding blogs"
}

export async function GET() {
    try {
        await seedBlogs()

        return Response.json("Database seeded successfully")
    } catch (error) {
        return Response.json(error);
    }
}