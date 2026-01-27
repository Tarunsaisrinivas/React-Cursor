import nodemailer from "nodemailer";
import dbConnect from "../../../lib/db";
import Subscriber from "../../../lib/models/subscriber";

export async function POST(req) {
    try {
        const { secret, subject, message } = await req.json();

        if (secret !== process.env.SEND_MAIL_SECRET) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const subscribers = await Subscriber.find({});
        const emails = subscribers.map((s) => s.email);

        if (emails.length === 0) {
            return Response.json(
                { error: "No subscribers found" },
                { status: 404 },
            );
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails,
            subject,
            html: `<div style="font-family:sans-serif">
                    <h2>${subject}</h2>
                    <p>${message}</p>
                    <hr/>
                    <small>Sent via Newsletter System</small>
                  </div>`,
        };

        await transporter.sendMail(mailOptions);

        return Response.json({ success: true, sentTo: emails.length });
    } catch (err) {
        console.error(err);
        return Response.json({ error: err.message }, { status: 500 });
    }
}
