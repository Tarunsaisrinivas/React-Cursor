import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";

export async function POST(req) {
    try {
        const { email } = await req.json();
        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { message: "Already subscribed" },
                { status: 400 }
            );
        }

        await Subscriber.create({ email });

        return NextResponse.json(
            { message: "Subscribed successfully!" },
            { status: 201 }
        );
    } catch (error) {
        console.error("❌ Subscribe API error:", error); // 👈 Terminal will show this
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
