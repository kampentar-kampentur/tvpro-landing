import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    console.log("New Careers Application received:", data);

    const apiUrl = process.env.NEXT_PUBLIC_SRTAPI_URL || "http://localhost:1337";

    // Remove file field if it was serialized as an empty object
    if (data.file && typeof data.file === 'object' && Object.keys(data.file).length === 0) {
      delete data.file;
    }

    // Filter payload strictly to fields allowed by Strapi technician-application schema
    const allowedKeys = new Set([
      "name", "phone", "email", "city", "workAuth", "over18", "driverLicense",
      "languages", "experienceLevel", "previousWork", "servicesPerformed",
      "hasTools", "q1Studs", "q2Power", "schedule", "daysPerWeek", "drivingRange",
      "desiredIncome", "insurance", "backgroundCheck", "about", "strengths",
      "weaknesses", "file", "utm_source", "utm_medium", "utm_campaign",
      "utm_term", "utm_content", "gclid", "msclkid", "fbclid"
    ]);
    const filteredData = {};
    for (const [key, value] of Object.entries(data)) {
      if (allowedKeys.has(key) && value !== undefined && value !== null) {
        filteredData[key] = value;
      }
    }

    const response = await fetch(`${apiUrl}/api/technician-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: filteredData,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Strapi response error:", errorText);
      throw new Error(`Strapi returned status ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Careers form error:", error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
