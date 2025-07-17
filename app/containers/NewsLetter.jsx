import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export default function NewsLetter() {
    
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
                                placeholder="Enter your email"
                                className="h-14 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 text-lg focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>

                        <Button
                            className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg"
                            size="lg"
                        >
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
