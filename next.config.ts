import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow local-device testing (phone/tablet on same Wi-Fi) in Next dev mode.
  allowedDevOrigins: ['192.168.1.10', '192.168.1.11', '192.168.1.12', 'localhost'] as any,
};

export default nextConfig;