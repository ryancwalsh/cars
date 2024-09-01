/** @type {import('next').NextConfig} */
module.exports = {
  // TODO: Pull out the /api/ig feature. Then uncomment `distDir` and `output` here.
  // distDir: 'out',
  // https://nextjs.org/docs/pages/building-your-application/deploying/static-exports
  // If this is set to 'export', then the build will be a static export and does not allow API routes.
  // output: 'export', 
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'], // This line is probably not necessary, especially when using Pages Router instead of App Router. https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages
  },
  reactStrictMode: true,
  typescript: {
    // FIXNOW: Dangerously allowing production builds to successfully complete even if project has type errors.
    ignoreBuildErrors: true,
  },
  webpack: (cfg) => {
    cfg.module.rules.push({
      loader: 'frontmatter-markdown-loader',
      options: { mode: ['react-component'] },
      test: /\.md$/u,
    });
    return cfg;
  },
};
