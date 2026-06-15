/** @type {import('next').NextConfig} */
// Patrick 部署到 https://2017zyl.xyz/neo-labs/
// 部署上下文: polyglotszeng/patrick-reports 仓作为 monorepo
// 本项目作为子目录 `neo-labs/` 部署
const isProd = process.env.NODE_ENV === 'production';
const basePath = '/neo-labs';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // basePath: 仅 prod 环境启用（dev 环境本地访问无前缀）
  basePath: isProd ? basePath : '',
  assetPrefix: isProd ? basePath : '',
  env: { 
    NEXT_PUBLIC_BASE_PATH: isProd ? basePath : '',
    NEXT_PUBLIC_SITE_URL: 'https://2017zyl.xyz/neo-labs'
  },
  // 允许的 image domains
  images: { 
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }]
  }
};

module.exports = nextConfig;