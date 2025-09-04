// app/api/subscribe/route.js
import { connectToDatabase } from "@/lib/db";
import Subscriber from "@/lib/models/subscriber";
import nodemailer from "nodemailer";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes("@")) {
            return new Response(
                JSON.stringify({ error: "Invalid email address" }),
                { status: 400 }
            );
        }

        if (!process.env.MONGODB_URI) {
            return new Response(
                JSON.stringify({ error: "Database not configured" }),
                { status: 500 }
            );
        }

        await connectToDatabase();

        const existing = await Subscriber.findOne({ email });
        if (existing) {
            return new Response(
                JSON.stringify({ error: "Email already subscribed" }),
                { status: 409 }
            );
        }

        await Subscriber.create({ email });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "🎉 Thanks for subscribing to React Cursor!",
            html: `
                <div style="font-family: sans-serif; text-align: center; background: #f9f9f9; padding: 30px;">
                    <img src="https://reactcursor.tech/logo-banner-light.png#gh-dark-mode-only" 
                         alt="React Cursor Banner" 
                         style="max-width: 100%; border-radius: 12px;"/>
                    <h2 style="color: #7c3aed;">Thanks for subscribing to <strong>React Cursor</strong>!</h2>
                    <p style="font-size: 16px; color: #333;">A collection of modern, animated cursor components.</p>
                    <p style="font-size: 14px; color: #555; max-width: 600px; margin: auto;">
                        Smooth, customizable, and plug-and-play. Fun to explore. Easy to integrate. 
                        Level up your UI with delightful cursors that respond to interaction. 
                        Built with modern web technologies—crafted for developers who care about the details.
                    </p>
                    <br/>
                    <p style="font-size: 14px; color: #aaa;">You're receiving this email because you subscribed on our website.</p>
                </div>
            `,
        });

        return new Response(
            JSON.stringify({ message: "Subscribed successfully" }),
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500 }
        );
    }
}
