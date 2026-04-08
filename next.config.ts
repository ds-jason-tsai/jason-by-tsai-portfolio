import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:lang/experience',
        destination: '/:lang/professional-experience',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
