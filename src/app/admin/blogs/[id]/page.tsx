import { BlogForm } from '@/components/admin/BlogForm';
import { getPrisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const prisma = getPrisma();
    
    const blog = await prisma.blog.findUnique({
        where: { id }
    });

    if (!blog) {
        notFound();
    }

    return <BlogForm initialData={blog} isEdit={true} />;
}
