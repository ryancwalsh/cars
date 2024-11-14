/** @type {import('next').NextConfig} */
module.exports = {
  // distDir: 'out',
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  // If this is set to 'export', then the build will be a static export and does not allow API routes.
  // output: 'export', 
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'], // This line is probably not necessary, especially when using Pages Router instead of App Router. https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages
  },
  reactStrictMode: true,
  typescript: {
    // ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      loader: 'frontmatter-markdown-loader',
      options: { mode: ['react-component'] },
      test: /\.md$/u,
    });
    return config;
  },
};
