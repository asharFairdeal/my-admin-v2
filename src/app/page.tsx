import Head from 'next/head';
import Redirect from './Redirect';

export default function HomePage() {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Redirect />
    </>
  );
}

