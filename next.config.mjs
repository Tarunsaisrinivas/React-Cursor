// next.config.mjs
import nextPwa from "next-pwa";

const withPWA = nextPwa({
    dest: "public",
    register: true,
    skipWaiting: true,
});

const nextConfig = {
    reactStrictMode: true,
};

export default withPWA(nextConfig);
