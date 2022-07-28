import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// styles
import { Badge, Button, Col, Input, Row, Skeleton, Typography } from 'antd';
import { FilterOutlined, LeftOutlined } from '@ant-design/icons';
import { colors } from 'styles/variables';
// helpers
import { debounce } from 'helpers/debounce';
// components
import FiltersModal from 'components/FiltersModal';

interface Props {
  loading?: boolean;
  isShowfilters?: boolean;
  queryParamsAmount?: number;
  isShowReturnButton?: boolean;
}

export default function NavBar({
  loading = false,
  isShowfilters = false,
  queryParamsAmount = 0,
  isShowReturnButton = true,
}: Props) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [inputSearchValue, setInputSearchValue] = useState('');

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.q) return;
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
        <Row gutter={[8, 8]} align="middle" style={{ margin: '0px' }}>
          <Col
            sm={6}
            style={{ textAlign: 'center' }}
            className="logo-container"
          >
            <Link href="/">
              <a className="logo">LOGO</a>
            </Link>
          </Col>

          {isShowReturnButton && (
            <Col
              xs={3}
              style={{ textAlign: 'center' }}
              className="return-container"
            >
              <Link href="/">
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
              </Link>
            </Col>
          )}

          <Col xs={14} sm={10}>
            {loading ? (
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
          {isShowfilters && (
            <Col xs={7} sm={4}>
              {loading ? (
                <Skeleton.Button
                  active
                  block
                  style={{ maxWidth: '100%', width: '100%' }}
                />
              ) : (
                <Badge
                  count={queryParamsAmount > 0 ? queryParamsAmount : null}
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
          )}
        </Row>
      </nav>
      {isShowfilters && showModal && (
        <FiltersModal setShowModal={setShowModal} />
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
