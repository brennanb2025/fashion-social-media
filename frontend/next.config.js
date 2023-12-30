/** @type {import('next').NextConfig} */

//this is not working for some reason
const nextConfig = {
    async rewrites() {
        console.log("rewrites called");
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*' // Proxy to Backend
            }
        ]
    },
    trailingSlash: process.env.NODE_ENV !== 'production' && true,
}

module.exports = nextConfig