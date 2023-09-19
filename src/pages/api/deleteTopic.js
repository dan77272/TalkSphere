import { sql } from '@vercel/postgres';

export async function DELETE(req){
    const id = req.url.split('/')[req.url.split('/').length - 1]
    try{
        await sql`DELETE FROM Topics WHERE userId = ${id}`;
        return NextResponse.json({ message: "Topic delete successfully", success: true });
    }catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}