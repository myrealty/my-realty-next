import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
// styles
import { Card, Col, Row, Skeleton, Carousel } from 'antd';
import { colors } from 'styles/variables';
// http methods
import { baseURL } from 'api';
import { getAllListing, GetAllPublicListingInfo } from 'api/listing';
// helpers
import { toBase64 } from 'helpers/toBase64';
import { shimmer } from 'helpers/shimmerEffect';
import { currencyFormat } from 'helpers/currencyFormat';
// components
import Layout from 'components/Layout';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { queryParams } from 'data/listing';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<GetAllPublicListingInfo[]>([]);
  const [queryParamsAmount, setQueryParamsAmount] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    (async () => {
      setLoading(true);
      setListings([]);
      try {
        const queryParamsKeys = Object.keys(router.query);
        if (queryParamsKeys.length) {
          let amount = 0;
          for (const key of queryParamsKeys) {
            if (queryParams.includes(key)) amount++;
          }
          setQueryParamsAmount(amount);
        }
        const queryString = window.location.search;
        const { data } = await getAllListing({
          filters: queryString.length ? queryString.slice(1) : '',
        });
        setListings(data.listings);
        if (data.total === 0) setLoading(false);
      } catch (err: any) {
        setQueryParamsAmount(0);
        router.replace('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <Layout
      title="Propiedades en venta cabañas, casas en la playa,
          propiedades y experiencias únicas."
      description="Encuentra la casa de tus sueños de cualquier tipo ya sea cabañas, casas en la playa, propiedades unicas."
      loading={loading}
      isShowfilters
      queryParamsAmount={queryParamsAmount}
      isShowReturnButton={false}
    >
      <Row gutter={[16, 16]} align="middle" style={{ marginTop: '20px' }}>
        {listings.map((listing) => (
          <Col key={listing.id} xs={24} sm={12} md={8} xl={6}>
            <Card
              style={{ width: '100%' }}
              bodyStyle={{ padding: '0' }}
              cover={
                <Carousel
                  arrows={!loading}
                  nextArrow={<RightOutlined />}
                  prevArrow={<LeftOutlined />}
                  dots={!loading}
                  infinite={false}
                  swipe={false}
                  touchMove={false}
                >
                  {listing.photo.map((photo) => (
                    <div key={photo.url}>
                      <Link href={`/property/show/${listing.id}`}>
                        <a
                          style={{
                            cursor: loading ? 'default' : 'pointer',
                            pointerEvents: loading ? 'none' : 'auto',
                          }}
                        >
                          <div
                            style={{ height: '300px', position: 'relative' }}
                          >
                            <Image
                              alt={photo.name}
                              src={`${baseURL}/listing/image/${photo.url}`}
                              layout="fill"
                              objectFit="cover"
                              placeholder="blur"
                              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                shimmer('100%', '100%')
                              )}`}
                              onLoadingComplete={() => {
                                setLoading(false);
                              }}
                            />
                          </div>
                        </a>
                      </Link>
                    </div>
                  ))}
                </Carousel>
              }
            >
              <Link href={`/property/show/${listing.id}`}>
                <a
                  style={{
                    cursor: loading ? 'default' : 'pointer',
                    display: 'block',
                    padding: '24px',
                    pointerEvents: loading ? 'none' : 'auto',
                  }}
                >
                  <Skeleton loading={loading} active>
                    <Card.Meta
                      title={listing.title}
                      description={
                        <div
                          style={{ color: colors.black, whiteSpace: 'nowrap' }}
                        >
                          <p
                            style={{
                              marginBottom: '8px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >{`${listing.city}, ${listing.country}`}</p>
                          <p
                            style={{
                              marginBottom: '0',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            Precio: {currencyFormat(listing.price, 'USD')}
                          </p>
                        </div>
                      }
                    />
                  </Skeleton>
                </a>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
