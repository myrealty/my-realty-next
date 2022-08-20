import React from 'react';
import Head from 'next/head';
// components
import NavBar from 'components/Navbar';
// styles
import { breakPoints, colors } from 'styles/variables';

interface Props {
  description: string;
  children: React.ReactNode;
  title: string;
}

export default function Layout({ description, children, title }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <NavBar />
      </header>
      <main>{children}</main>
      <footer>
        <nav></nav>
      </footer>
      <style jsx>{`
        header {
          background-color: ${colors.white};
          border-bottom: 1px solid ${colors.gray};
          color: rgba(0, 0, 0, 0.85);
          height: 3.5rem;
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 2000;
        }

        @media (min-width: ${breakPoints.sm}) {
          header {
            height: 5rem;
          }
        }
      `}</style>
    </>
  );
}
