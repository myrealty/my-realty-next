import React from 'react';
import Head from 'next/head';
import { breakPoints, colors } from 'styles/variables';
// components
import NavBar from 'components/Navbar';

interface Props {
  children: React.ReactNode;
  title: string;
  description: string;
  loading?: boolean;
  isShowfilters?: boolean;
  queryParamsAmount?: number;
  isShowReturnButton?: boolean;
}

export default function Layout({
  children,
  title,
  description,
  loading = false,
  isShowfilters = false,
  queryParamsAmount = 0,
  isShowReturnButton = true,
}: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <NavBar
          loading={loading}
          isShowfilters={isShowfilters}
          queryParamsAmount={queryParamsAmount}
          isShowReturnButton={isShowReturnButton}
        />
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
          padding: 10px 0;
          position: sticky;
          top: 0;
          z-index: 2000;
        }

        main {
          margin: 0px auto;
          max-width: ${breakPoints.xl};
          padding-bottom: 30px;
          width: 90%;
        }
      `}</style>
    </>
  );
}
