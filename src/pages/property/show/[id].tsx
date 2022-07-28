import React, { useState } from 'react';
import Image from 'next/image';
import { GetServerSidePropsContext } from 'next';
// styles
import { Button, Col, Modal, Row, Skeleton, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { addOpacity } from 'styles/utils';
import { breakPoints, colors } from 'styles/variables';
// http functions
import { baseURL } from 'api';
import { getListing, GetListingInfo } from 'api/listing';
// helpers
import { toBase64 } from 'helpers/toBase64';
import { shimmer } from 'helpers/shimmerEffect';
import { currencyFormat } from 'helpers/currencyFormat';
// data
import {
  amenitiesData,
  translateExtra,
  translateFloorPlan,
} from 'data/listing';
// components
import Layout from 'components/Layout';
import { MapWithNoSSR } from 'components/Map';
import Redirect from 'components/Redirect';

export default function ShowListing({
  data,
  success,
}: {
  data: GetListingInfo;
  success: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  if (!success) return <Redirect to="/" />;

  const {
    listing,
    location,
    floor_plan: floorPlan,
    extra,
    photo,
    amenity,
  } = data;

  return (
    <Layout
      title={listing.title}
      description={listing.description}
      loading={loading}
      isShowfilters
    >
      {loading ? (
        <>
          <Skeleton.Input
            active
            block
            size="large"
            style={{ marginTop: '20px' }}
          />

          <Skeleton.Input size="small" active style={{ margin: '20px 0' }} />
        </>
      ) : (
        <>
          <h1>{listing?.title}</h1>
          <p>
            <Typography.Text underline strong>
              {location?.city}, {location?.state}, {location?.country}
            </Typography.Text>
          </p>
        </>
      )}

      <Row justify="center" gutter={[16, 0]}>
        <Col xs={24} md={12} style={{ marginBottom: '20px' }}>
          <div
            style={{
              height: '458px',
              position: 'relative',
            }}
          >
            <Image
              src={`${baseURL}/listing/image/${
                photo.find((photo) => photo.number === 1)?.url
              }`}
              alt={photo.find((photo) => photo.number === 1)?.name}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer('100%', '100%')
              )}`}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <Row justify="center" gutter={[16, 16]}>
            {photo.map((photo) => {
              if (photo.number === 1) return null;
              return (
                <Col key={photo.unique_photo_id} xs={24} sm={12}>
                  <div style={{ height: '220px', position: 'relative' }}>
                    <Image
                      src={`${baseURL}/listing/image/${photo.url}`}
                      alt={photo.name}
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
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>

      {loading ? (
        <>
          <Skeleton.Input
            active
            block
            size="large"
            style={{ marginTop: '20px' }}
          />
          <Skeleton.Input
            active
            block
            size="large"
            style={{ margin: '20px 0' }}
          />
        </>
      ) : (
        <>
          <h2>Precio: {currencyFormat(listing.price, 'USD')}</h2>
          <h2>Espacios que te ofrece esta propiedad:</h2>
        </>
      )}

      <Row gutter={[16, 16]} style={{ fontSize: '16px', textAlign: 'left' }}>
        {Object.entries(floorPlan).map(([key, value]) => {
          if (key === 'id') return null;
          return (
            <Col key={key} xs={24} sm={12} md={8}>
              {loading ? (
                <>
                  <Skeleton.Input active block size="small" />
                </>
              ) : (
                <>
                  <Typography.Text strong>
                    <CheckCircleOutlined />{' '}
                    {`${value} ${
                      value === 1
                        ? // @ts-ignore
                          translateFloorPlan[`${key}_1`]
                        : // @ts-ignore
                          translateFloorPlan[key]
                    }`}
                  </Typography.Text>
                </>
              )}
            </Col>
          );
        })}
      </Row>

      {!!amenity.length && (
        <>
          {loading ? (
            <>
              <Skeleton.Input
                active
                block
                size="large"
                style={{ margin: '20px 0' }}
              />
            </>
          ) : (
            <>
              <h2>Los servicios que te ofrece esta propiedad:</h2>
            </>
          )}

          <Row gutter={[16, 16]} style={{ marginBottom: '10px' }}>
            {amenity.slice(0, 8).map(({ name }, i) => (
              <Col key={`${name}-${i}`} xs={24} sm={8} md={6}>
                <figure>
                  {(() => {
                    const data = amenitiesData.find((am) => am.value === name)!;

                    return (
                      <>
                        <Image
                          src={data.imageURL}
                          alt={data.name}
                          width={56}
                          height={56}
                          placeholder="blur"
                          blurDataURL={`data:image/svg+xml;base64,${toBase64(
                            shimmer('100%', '100%')
                          )}`}
                        />
                        {loading ? (
                          <>
                            <Skeleton.Input active block size="small" />
                          </>
                        ) : (
                          <>
                            <figcaption>{data.name}</figcaption>
                          </>
                        )}
                      </>
                    );
                  })()}
                </figure>
              </Col>
            ))}
          </Row>
          <Row style={{ marginBottom: '20px' }}>
            <Col xs={24} sm={10}>
              <Button
                block
                type="primary"
                disabled={loading}
                onClick={() => setShowModal(true)}
              >
                Mostrar los {amenity.length} servicios
              </Button>
            </Col>
          </Row>
        </>
      )}

      {loading ? (
        <>
          <Skeleton.Input
            active
            block
            size="large"
            style={{ marginTop: '20px' }}
          />
          <Skeleton.Input size="small" active style={{ margin: '20px 0' }} />
        </>
      ) : (
        <>
          <h2>Esta ubicado en:</h2>
          <p>
            <Typography.Text underline>
              {location?.city}, {location?.state}, {location?.country}
            </Typography.Text>
          </p>
        </>
      )}

      <MapWithNoSSR location={location} />

      {!!Object.entries(extra)
        .filter(([key]) => key !== 'id')
        .some(([, value]) => value === 1) && (
        <>
          {loading ? (
            <>
              <Skeleton.Input active block style={{ marginTop: '20px' }} />
              <Skeleton.Input
                size="small"
                active
                style={{ margin: '20px 0' }}
              />
            </>
          ) : (
            <>
              <h3>Otras cosas que debes saber sobre esta propiedad:</h3>
              <p>Cuenta con: </p>
              <Row
                gutter={[16, 16]}
                justify="space-evenly"
                style={{ fontSize: '16px', textAlign: 'center' }}
              >
                {Object.entries(extra).map(([key, value]) =>
                  value === 1 && key !== 'id' ? (
                    <Col key={key} xs={24} sm={12} md={8}>
                      {loading ? (
                        <>
                          <Skeleton.Input active block size="small" />
                        </>
                      ) : (
                        <>
                          <Typography.Text strong>
                            <ExclamationCircleOutlined />{' '}
                            {
                              // @ts-ignore
                              translateExtra[key]
                            }
                          </Typography.Text>
                        </>
                      )}
                    </Col>
                  ) : null
                )}
              </Row>
            </>
          )}
        </>
      )}

      {!!amenity.length && (
        <Modal
          title="Los servicios que te ofrece esta propiedad:"
          centered
          width="90vw"
          style={{ top: '0', zIndex: '3000' }}
          bodyStyle={{ overflowY: 'scroll', height: '80vh' }}
          visible={showModal}
          footer={null}
          onCancel={() => setShowModal(false)}
        >
          {(() => {
            const types = {
              amenity: [],
              service: [],
              security: [],
            };

            amenity.forEach(({ name }, i) => {
              const data = amenitiesData.find((am) => am.value === name)!;

              // @ts-ignore
              types[data.type].push({
                key: `${data.value}-${i}`,
                node: (
                  <figure>
                    <Image
                      src={data.imageURL}
                      alt={data.name}
                      width={56}
                      height={56}
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml;base64,${toBase64(
                        shimmer('100%', '100%')
                      )}`}
                    />
                    <figcaption>{data.name}</figcaption>
                  </figure>
                ),
              });
            });

            const amenityArr = Object.values(types.amenity);
            const serviceArr = Object.values(types.service);
            const securityArr = Object.values(types.security);

            return (
              <>
                {!!amenityArr.length && (
                  <section style={{ marginBottom: '25px' }}>
                    <h2>Comodidades:</h2>
                    <Row gutter={[16, 24]}>
                      {amenityArr.map(
                        (am: { key: string; node: React.ReactNode }) => (
                          <Col key={am.key} xs={24} sm={12} md={8} lg={6}>
                            {am.node}
                          </Col>
                        )
                      )}
                    </Row>
                  </section>
                )}

                {!!serviceArr.length && (
                  <section style={{ marginBottom: '25px' }}>
                    <h2>Servicios:</h2>
                    <Row gutter={[16, 24]}>
                      {serviceArr.map(
                        (am: { key: string; node: React.ReactNode }) => (
                          <Col key={am.key} xs={24} sm={12} md={8} lg={6}>
                            {am.node}
                          </Col>
                        )
                      )}
                    </Row>
                  </section>
                )}

                {!!securityArr.length && (
                  <section>
                    <h2>Seguridad:</h2>
                    <Row gutter={[16, 24]}>
                      {securityArr.map(
                        (am: { key: string; node: React.ReactNode }) => (
                          <Col key={am.key} xs={24} sm={12} md={8}>
                            {am.node}
                          </Col>
                        )
                      )}
                    </Row>
                  </section>
                )}
              </>
            );
          })()}
        </Modal>
      )}
      <style jsx>{`
        h1,
        h2,
        h3 {
          color: ${addOpacity({ color: colors.black, opacity: 0.85 })};
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
        }

        h1 {
          font-size: 38px;
          line-height: 1.23;
        }

        h2 {
          font-size: 30px;
          line-height: 1.35;
        }

        h3 {
          font-size: 24px;
          line-height: 1.35;
        }

        figure {
          height: 100%;
          margin: 0;
          text-align: center;
        }

        figcaption {
          color: ${addOpacity({ color: colors.black, opacity: 0.85 })};
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          text-align: center;
        }

        @media (max-width: ${breakPoints.lg}) {
          h1 {
            font-size: 30px;
          }

          h2 {
            font-size: 22px;
          }

          h3 {
            font-size: 20px;
          }

          figcaption {
            font-size: 14px;
          }
        }

        @media (max-width: ${breakPoints.sm}) {
          h1 {
            font-size: 22px;
          }

          h2 {
            font-size: 20px;
          }

          h3 {
            font-size: 18px;
          }

          figcaption {
            font-size: 12px;
          }
        }
      `}</style>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { params } = ctx;
  try {
    const { data } = await getListing(params!.id as string);
    return { props: { success: true, data } };
  } catch (error: any) {
    return { props: { success: false, error: error.response.data } };
  }
}
