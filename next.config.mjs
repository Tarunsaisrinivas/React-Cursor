// next.config.mjs
import nextPwa from "next-pwa";

const isDev = process.env.NODE_ENV === "development";

const withPWA = nextPwa({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: isDev, // <-- This disables PWA in dev to avoid issues
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
