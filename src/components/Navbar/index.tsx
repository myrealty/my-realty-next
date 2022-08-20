import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// components
import FiltersModal from 'components/modals/FiltersModal';
import ContactAgentModal from 'components/modals/ContactAgentModal';
// helpers
import { debounce } from 'helpers/debounce';
// redux
import { useSelector } from 'react-redux';
import { AppState } from 'store';
// styles
import { Badge, Button, Col, Input, Row, Skeleton, Typography } from 'antd';
import { FilterOutlined, LeftOutlined } from '@ant-design/icons';
import { colors } from 'styles/variables';

export default function NavBar() {
  const router = useRouter();
  const {
    appLoading,
    appQueryParamsNumber,
    appShowReturnButton,
    appShowFilters,
    appShowContactAgent,
  } = useSelector((state: AppState) => state.app);

  const [showModal, setShowModal] = useState(false);
  const [showContactAgentModal, setShowContactAgentModal] = useState(false);
  const [inputSearchValue, setInputSearchValue] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.q) {
      setInputSearchValue('');
      return;
    }
    const q = router.query.q as string;
    setInputSearchValue(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const handleDebounceSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.delete('q');
        const queryParams = params.toString();

        let URI = '/';
        if (value.length) {
          URI += `?q=${value}`;
        }
        if (queryParams.length) {
          URI += `${value.length ? '&' : '?'}${queryParams}`;
        }
        router.push(URI);
      }, 1000),
    [router]
  );

  return (
    <>
      <nav>
        <Row
          gutter={[8, 8]}
          align="middle"
          justify={
            router.asPath.includes('/property/show/')
              ? 'space-between'
              : undefined
          }
          style={{ margin: '0px' }}
        >
          <Col
            sm={6}
            style={{ textAlign: 'center' }}
            className="logo-container"
          >
            <Link href="/">
              <a className="logo">LOGO</a>
            </Link>
          </Col>

          {appShowReturnButton && (
            <Col xs={6} className="return-container">
              <Link href="/">
                <a
                  style={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    color: colors.black,
                  }}
                >
                  <LeftOutlined
                    style={{
                      alignItems: 'center',
                      borderRadius: '50%',
                      boxShadow:
                        '0 1px 2px -2px rgb(0 0 0 / 16%), 0 3px 6px 0 rgb(0 0 0 / 12%), 0 5px 12px 4px rgb(0 0 0 / 9%)',
                      display: 'flex',
                      height: '30px',
                      justifyContent: 'center',
                      padding: '6px',
                      textAlign: 'center',
                      width: '30px',
                    }}
                  />
                </a>
              </Link>
            </Col>
          )}

          {appShowFilters && (
            <>
              <Col xs={14} sm={10}>
                {appLoading ? (
                  <Skeleton.Input active block />
                ) : (
                  <Input.Search
                    placeholder="Busca tu propiedad"
                    enterButton
                    value={inputSearchValue}
                    onChange={(e) => {
                      setInputSearchValue(e.target.value);
                      handleDebounceSearch(e.target.value);
                    }}
                  />
                )}
              </Col>
              <Col xs={10} sm={8}>
                {appLoading ? (
                  <Skeleton.Button active block />
                ) : (
                  <Badge
                    count={
                      appQueryParamsNumber > 0 ? appQueryParamsNumber : null
                    }
                    color={colors.primary}
                  >
                    <Button
                      block
                      style={{ padding: '4px 8px' }}
                      onClick={debounce(() => setShowModal(true), 800)}
                    >
                      <Typography.Text strong>
                        <FilterOutlined /> Filtros
                      </Typography.Text>
                    </Button>
                  </Badge>
                )}
              </Col>
            </>
          )}
          {appShowContactAgent && (
            <Col xs={14} sm={8}>
              {appLoading ? (
                <Skeleton.Button
                  active
                  block
                  style={{ maxWidth: '100%', width: '100%' }}
                />
              ) : (
                <Button
                  block
                  type="primary"
                  style={{ padding: '4px 8px' }}
                  onClick={debounce(() => setShowContactAgentModal(true), 800)}
                >
                  Contactar agente
                </Button>
              )}
            </Col>
          )}
        </Row>
      </nav>
      {showModal && <FiltersModal setShowModal={setShowModal} />}
      {showContactAgentModal && location && (
        <ContactAgentModal
          setShowContactAgentModal={setShowContactAgentModal}
        />
      )}
      <style jsx>{`
        nav {
          margin: 0 auto;
          max-width: 1200px;
          width: 90%;
        }

        .logo {
          color: ${colors.primary};
          cursor: pointer;
          flex: 0 0 10%;
          font-size: 35px;
          font-weight: bold;
          outline: none;
          text-decoration: none;
        }
      `}</style>
    </>
  );
}
