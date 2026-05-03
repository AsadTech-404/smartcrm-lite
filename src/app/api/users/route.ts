import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET users
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: { clerkId: userId },
  });
  return Response.json(users);
}

// POST user
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const newUser = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      status: body.status,
      clerkId: userId,
    },
  });

  return Response.json(newUser);
}

// Delete user
export async function DELETE(req:Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const user = await prisma.user.findFirst({
    where: { id, clerkId: userId },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({
    where: { id },
  });

  return Response.json({ message: "User deleted"});

}

// Edit user
export async function PUT(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

   const user = await prisma.user.findFirst({
    where: { id: body.id, clerkId: userId },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      email: body.email,
      status: body.status,
    },
  });

  return Response.json(updatedUser);
};