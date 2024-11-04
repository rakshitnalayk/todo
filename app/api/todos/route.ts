import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { analyzeTodoContent, suggestReorganization } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { title, description, image, dueDate, priority } = await req.json();

    // Analyze content with AI
    const analysis = await analyzeTodoContent(title, description);

    // Create or get tags
    const tags = await Promise.all(
      analysis.tags.map((tag: string) =>
        prisma.tag.upsert({
          where: { name: tag },
          update: {},
          create: { name: tag },
        })
      )
    );

    // Create or get folder
    const folder = await prisma.folder.upsert({
      where: { name: analysis.folder },
      update: {},
      create: { name: analysis.folder },
    });

    // Create todo with relationships
    const todo = await prisma.todo.create({
      data: {
        title,
        description: description || analysis.description,
        image,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'LOW',
        folderId: folder.id,
        tags: {
          connect: tags.map(tag => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        folder: true,
      },
    });

    // Suggest reorganization if needed
    const allTodos = await prisma.todo.findMany({
      include: { tags: true, folder: true },
    });
    const reorganization = await suggestReorganization(allTodos);

    return NextResponse.json({ todo, reorganization });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const todos = await prisma.todo.findMany({
      include: {
        tags: true,
        folder: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}