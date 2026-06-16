import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // В будущем здесь можно отправлять данные в Strapi, CRM, или на email
    console.log("New Careers Application received:", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Careers form error:", error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
