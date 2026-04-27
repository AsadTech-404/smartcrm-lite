import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const users = await prisma.user.findMany();
  return Response.json(users);
}

// POST user
export async function POST(req: Request) {
  const body = await req.json();

  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      status: body.status,
    },
  });

  return Response.json(newUser);
}