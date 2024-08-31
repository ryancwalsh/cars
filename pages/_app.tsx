import { type AppProps } from 'next/app';

// eslint-disable-next-line import/no-unassigned-import
import '../styles/App.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
