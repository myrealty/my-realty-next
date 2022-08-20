import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
// axios
import { baseURL } from 'api';
import {
  CoordinatesType,
  getAllListing,
  GetAllPublicListingInfo,
} from 'api/listing';
// components
import Layout from 'components/Layout';
import { HomeMapWithNoSSR } from 'components/maps/HomeMap';
import InfiniteScroll from 'components/InfiniteScroll';
// data
import { queryParams } from 'data/listing';
// helpers
import { toBase64 } from 'helpers/toBase64';
import { shimmer } from 'helpers/shimmerEffect';
import { currencyFormat } from 'helpers/currencyFormat';
import { debounce } from 'helpers/debounce';
// redux
import { useSelector } from 'react-redux';
import { AppState } from 'store';
import {
  setAppLoading,
  setAppQueryParamsNumber,
  setAppShowReturnButton,
  setAppShowFilters,
  setAppShowContactAgent,
  setAppLocation,
} from 'store/actions/app';
// styles
import { Card, Col, Row, Skeleton, Carousel, Button, Spin } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { breakPoints, colors } from 'styles/variables';

export default function HomePage() {
  const router = useRouter();
  const { appLoading } = useSelector((state: AppState) => state.app);
  const ref = useRef(null);

  // listings data
  const [data, setData] = useState<GetAllPublicListingInfo[]>([]);
  // show list or Map
  const [isShowList, setIsShowList] = useState(true);
  // list states
  const [loading, setLoading] = useState(true);
  const [isListEffect, setIsListEffect] = useState(false);
  // map states
  const [coordinates, setCoordinates] = useState<CoordinatesType | null>(null);
  const [selectData, setSelectData] = useState<GetAllPublicListingInfo | null>(
    null
  );
  // pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 0,
    perPage: 6,
  });
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setAppShowFilters(true);
    setAppShowReturnButton(false);
    setAppShowContactAgent(false);
    setAppLocation({ location: null });
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    setData([]);
    setIsShowList(true);
    setLoading(true);
    setSelectData(null);

    const queryParamsKeys = Object.keys(router.query);
    let amount = 0;
    if (queryParamsKeys.length) {
      for (const key of queryParamsKeys) {
        if (queryParams.includes(key)) amount++;
      }
      setAppQueryParamsNumber(amount);
    } else {
      setAppQueryParamsNumber(0);
    }

    findByList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!isShowList || !isListEffect) return;
    findByList();
    setIsListEffect(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowList]);

  useEffect(() => {
    if (isShowList || coordinates === null) return;

    const { swLat, neLat, swLng, neLng } = coordinates;
    if (swLat === null || swLng === null || neLat === null || neLng === null) {
      return;
    }

    setData([]);

    (async () => {
      try {
        const data = await queryApi({
          coordinates,
        });
        setData(data.listings);
      } catch (error) {
        setAppQueryParamsNumber(0);
        router.replace('/');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  const next = useCallback(async () => {
    if (pagination.page + 1 > pagination.totalPages) {
      setHasMore(false);
      return;
    }

    try {
      const data = await queryApi({
        page: pagination.page + 1,
        perPage: pagination.perPage,
        filters: window.location.search,
      });

      setData((state) => [...state, ...data.listings]);
      setPagination((state) => ({
        ...state,
        page: state.page + 1,
      }));
    } catch (error) {
      setAppQueryParamsNumber(0);
      router.replace('/');
    }
  }, [pagination.page, pagination.perPage, pagination.totalPages, router]);

  const updateCoordinates = useCallback((cords: CoordinatesType) => {
    setCoordinates(cords);
  }, []);

  const handleSelectedLocation = useCallback(
    (data: GetAllPublicListingInfo) => {
      setSelectData(data);
    },
    []
  );

  const queryApi = async ({
    page,
    perPage,
    filters,
    coordinates,
  }: {
    page?: number;
    perPage?: number;
    filters?: string;
    coordinates?: CoordinatesType;
  }) => {
    const params = new URLSearchParams(filters);
    if (!params.has('country')) {
      params.delete('city');
      params.delete('state');
      params.delete('lat');
      params.delete('lng');
    }

    const queryString = params.toString();
    const { data } = await getAllListing({
      filters: queryString.length ? queryString : undefined,
      page,
      perPage,
      coordinates,
    });
    return data;
  };

  const findByList = async () => {
    try {
      const data = await queryApi({
        page: 1,
        perPage: pagination.perPage,
        filters: window.location.search,
      });

      setData(data.listings);
      setPagination((state) => ({
        ...state,
        page: 1,
        total: data.total,
        totalPages: data.totalPages,
      }));
      setHasMore(data.totalPages > 1);
      setCoordinates(null);

      if (data.total === 0) {
        setLoading(false);
        setAppLoading(false);
      }
    } catch (error) {
      setAppQueryParamsNumber(0);
      router.replace('/');
    }
  };

  return (
    <Layout
      title="Propiedades en venta casas, apartamentos, viviendas anexas,
          propiedades únicas."
      description="Encuentra la casa de tus sueños de cualquier tipo ya sea cabañas, casas en la playa, propiedades unicas."
    >
      {isShowList ? (
        <section ref={ref}>
          <InfiniteScroll
            dataLength={data.length}
            hasMore={hasMore}
            loader={<Spin />}
            next={next}
            parent={ref}
          >
            <div className="container">
              <Row
                gutter={[16, 16]}
                align="middle"
                style={{ marginTop: '20px' }}
              >
                {data.map((listing) => (
                  <Col key={listing.id} xs={24} sm={12} md={8}>
                    <Card
                      style={{ width: '100%' }}
                      bodyStyle={{ padding: '0' }}
                      cover={
                        <Carousel
                          arrows={!loading}
                          nextArrow={<RightOutlined />}
                          prevArrow={<LeftOutlined />}
                          dots={!loading}
                          infinite={true}
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
                                  <div className="carousel-image-container">
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
                                        setAppLoading(false);
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
                                  style={{
                                    color: colors.black,
                                    whiteSpace: 'nowrap',
                                  }}
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
                                    Precio:{' '}
                                    {currencyFormat(listing.price, 'USD')}
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
            </div>
          </InfiniteScroll>
        </section>
      ) : (
        <>
          <Spin spinning={coordinates === null} size="large">
            {coordinates === null && <div className="home-map-loading"></div>}
            <HomeMapWithNoSSR
              locations={data}
              handleSelectedLocation={handleSelectedLocation}
              updateCoordinates={updateCoordinates}
            />
          </Spin>

          {selectData !== null && (
            <article className="select-data container">
              <aside className="select-data-info">
                <div className="info-carousel-container">
                  <Carousel
                    arrows={true}
                    nextArrow={<RightOutlined />}
                    prevArrow={<LeftOutlined />}
                    dots={true}
                    infinite={true}
                    swipe={false}
                    touchMove={false}
                  >
                    {selectData.photo.map((photo) => (
                      <div key={photo.url}>
                        <Link href={`/property/show/${selectData.id}`}>
                          <a>
                            <div className="img-container">
                              <Image
                                alt={photo.name}
                                src={`${baseURL}/listing/image/${photo.url}`}
                                layout="fill"
                                objectFit="cover"
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                  shimmer('100%', '100%')
                                )}`}
                              />
                            </div>
                          </a>
                        </Link>
                      </div>
                    ))}
                  </Carousel>
                </div>
                <div className="info-container">
                  <Link href={`/property/show/${selectData.id}`}>
                    <a
                      style={{
                        display: 'block',
                      }}
                    >
                      <h3>{selectData.title}</h3>
                      <div
                        style={{
                          color: colors.black,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <p
                          style={{
                            marginBottom: '8px',
                          }}
                        >{`${selectData.city}, ${selectData.country}`}</p>
                        <p
                          style={{
                            marginBottom: '0',
                          }}
                        >
                          Precio: {currencyFormat(selectData.price, 'USD')}
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
              </aside>
              <button
                className="close-button"
                onClick={() => setSelectData(null)}
              >
                <CloseOutlined />
              </button>
            </article>
          )}
        </>
      )}

      {!appLoading && (
        <Button
          type="primary"
          style={{
            bottom: '1.5rem',
            left: 'calc(50% - 5rem)',
            position: 'fixed',
            textAlign: 'center',
            width: '10rem',
            zIndex: 2000,
          }}
          onClick={debounce(() => {
            setData([]);

            if (isShowList) {
              setIsShowList(false);
              setLoading(true);
            }
            if (!isShowList) {
              setIsShowList(true);
              setIsListEffect(true);
              setSelectData(null);
            }
          }, 200)}
        >
          {isShowList ? 'Mostrar mapa' : 'Mostrar lista'}
        </Button>
      )}

      <style jsx>{`
        section {
          height: calc(100vh - 3.5rem);
          overflow-y: auto;
          padding-bottom: 4rem;
        }

        div.carousel-image-container {
          height: 200px;
          position: relative;
        }

        article.select-data {
          bottom: 12%;
          left: 5%;
          position: absolute;
          width: 90%;
          z-index: 1999;
        }

        aside.select-data-info {
          align-items: center;
          background-color: ${colors.white};
          display: flex;
          justify-content: center;
        }

        aside.select-data-info div.info-carousel-container {
          width: 40%;
        }

        div.info-carousel-container div.img-container {
          height: 150px;
          position: relative;
        }

        aside.select-data-info div.info-container {
          padding: 5px;
          width: 60%;
        }

        div.info-container h3 {
          font-size: 0.875rem;
        }

        div.info-container p {
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        article.select-data button.close-button {
          border: none;
          border-radius: 50%;
          cursor: pointer;
          height: 25px;
          position: absolute;
          right: 2%;
          top: 2%;
          width: 25px;
        }

        @media (min-width: ${breakPoints.sm}) {
          section {
            height: calc(100vh - 5rem);
          }

          div.carousel-image-container {
            height: 300px;
          }

          aside.select-data-info div.info-carousel-container {
            width: 50%;
          }

          div.info-carousel-container div.img-container {
            height: 180px;
          }

          aside.select-data-info div.info-container {
            padding: 10px;
            width: 50%;
          }

          div.info-container h3 {
            font-size: 1rem;
          }

          div.info-container p {
            font-size: 0.875rem;
          }
        }

        @media (min-width: ${breakPoints.md}) {
          aside.select-data-info div.info-container {
            padding: 15px;
          }

          div.info-container h3 {
            font-size: 1.25rem;
          }

          div.info-container p {
            font-size: 1rem;
          }
        }

        @media (min-width: ${breakPoints.lg}) {
          article.select-data {
            left: calc(50% - 25rem);
            width: 50rem;
          }
        }
      `}</style>
    </Layout>
  );
}
