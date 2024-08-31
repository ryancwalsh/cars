import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* https://nextjs.org/docs/pages/building-your-application/routing/custom-document */}
        {/* https://nextjs.org/docs/messages/no-page-custom-font */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
