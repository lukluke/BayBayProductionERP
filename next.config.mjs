/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mui/x-charts'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "publicen.s3.ap-southeast-2.amazonaws.com",
        port: "",
        pathname: "*/**",
      },
    ],
  },
};

export default nextConfig;
