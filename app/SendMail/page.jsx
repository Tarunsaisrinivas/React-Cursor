"use client";
import { useState } from "react";

export default function SendMailPage() {
    const [enteredCode, setEnteredCode] = useState("");
    const [authorized, setAuthorized] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");

    const handleCodeSubmit = () => {
        if (enteredCode === process.env.NEXT_PUBLIC_ACCESS_CODE) {
            setAuthorized(true);
        } else {
            alert("❌ Wrong access code!");
        }
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/send-mail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    secret: process.env.NEXT_PUBLIC_ACCESS_CODE,
                    subject,
                    message,
                }),
            });

            const data = await res.json();
            setResponseMsg(
                data.success
                    ? `✅ Mail sent to ${data.sentTo} subscribers.`
                    : `❌ ${data.error}`
            );
        } catch (err) {
            setResponseMsg(`❌ ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!authorized) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h2 className="text-2xl font-bold mb-4">🔒 Enter Secret Code</h2>
                <input
                    type="password"
                    placeholder="Enter secret code"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    className="border rounded-lg p-2 text-white"
                />
                <button
                    onClick={handleCodeSubmit}
                    className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
                >
                    Access
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-10">
            <h1 className="text-3xl font-bold mb-6">📧 Send Newsletter</h1>
            <div className="w-full max-w-lg flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="p-2 rounded-md text-white"
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="p-2 h-40 rounded-md text-white"
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-green-600 py-2 rounded-md"
                >
                    {loading ? "Sending..." : "Send Email"}
                </button>
                {responseMsg && (
                    <p className="mt-4 text-sm text-center">{responseMsg}</p>
                )}
            </div>
        </div>
    );
}
