import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useState } from "react";

export default function NewsLetter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleSubscribe = async () => {
        setLoading(true);
        setSuccess("");
        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Subscribed successfully! Check your email.");
                setEmail("");
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert("Something went wrong");
        }
        setLoading(false);
    };
    return (
        <div className="min-h-full bg-black flex justify-center pb-20  ">
            <div className="w-full max-w-4xl bg-gray-900/50 rounded-2xl p-8 ">
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Left side - Content */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Unlock exclusive content
                            </h1>
                            <p className="text-gray-400 text-lg">
                                Sign up and get benefits like:
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-lg">
                                    Exclusive tutorials
                                </span>
                            </div> */}

                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-lg">
                                    Product news
                                </span>
                            </div>

                            {/* <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-lg">
                                    Member-only discounts
                                </span>
                            </div> */}

                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-lg">
                                    Receive updates
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-lg">
                                    Early access to features
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-white text-lg font-medium"
                            >
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </div>

                        <Button onClick={handleSubscribe} className="hover:cursor-pointer" disabled={loading}>
                            {loading ? "Subscribing..." : "Subscribe"}
                        </Button>
                        {success && <p className="text-green-500">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
