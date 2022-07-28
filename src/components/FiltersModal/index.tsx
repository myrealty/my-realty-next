import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
// styles
import {
  Button,
  Checkbox,
  Col,
  Divider,
  InputNumber,
  Modal,
  Row,
  Typography,
} from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { colors } from 'styles/variables';
import { addOpacity } from 'styles/utils';
// http functions
import { getCountAllListing } from 'api/listing';
// helpers
import { shimmer } from 'helpers/shimmerEffect';
import { toBase64 } from 'helpers/toBase64';
import { debounce } from 'helpers/debounce';
// data
import {
  accommodationType,
  accommodationTypeString,
  amenitiesData,
  amenitiesDataString,
  floorPlanData,
  propertyTypeGroup,
  propertyTypeGroupString,
} from 'data/listing';
// components
import { MapLocationWithNoSSR } from 'components/MapLocation';
import { handleError, MessageTypes } from 'helpers/handlers';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FiltersType {
  priceRange: {
    lowestPrice: number;
    highestPrice: number;
  };
  accommodationType: string[];
  spaces: {
    living_rooms: number;
    kitchens: number;
    dining_rooms: number;
    rooms: number;
    bathrooms: number;
  };
  propertyTypeGroup: string[];
  amenities: string[];
}

const initFiltersState: FiltersType = {
  priceRange: {
    lowestPrice: 100,
    highestPrice: 100_000_000,
  },
  accommodationType: [],
  spaces: {
    living_rooms: 0,
    kitchens: 0,
    dining_rooms: 0,
    rooms: 0,
    bathrooms: 0,
  },
  propertyTypeGroup: [],
  amenities: [],
};

export default function FiltersModal({ setShowModal }: Props) {
  const router = useRouter();

  const [propertiesAmount, setPropertiesAmount] = useState(0);
  const [queryStringParams, setQueryStringParams] = useState('');

  const [filters, setFilters] = useState<FiltersType>({
    ...structuredClone(initFiltersState),
  });

  const [location, setLocation] = useState<{
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);

  const [showServices, setShowServices] = useState(false);
  const [showSpaces, setShowSpaces] = useState(false);
  const [runFilterEffect, setRunFilterEffect] = useState(false);
  const [isRemoveRilters, setIsRemoveRilters] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;
    setRunFilterEffect(true);
    if (!Object.keys(router.query).length) return;

    const filterObj = structuredClone(initFiltersState);
    const locationObj: any = {};

    const { query } = router;
    for (const key in query) {
      const element = query[key];

      if (
        key === 'min_price' &&
        !isNaN(Number(element)) &&
        Number(element) >= 100
      ) {
        if ('max_price' in query) {
          if (Number(element) <= Number(query.max_price)) {
            filterObj.priceRange.lowestPrice = Number(element);
          }
        } else {
          filterObj.priceRange.lowestPrice = Number(element);
        }
      }
      if (
        key === 'max_price' &&
        !isNaN(Number(element)) &&
        Number(element) >= 100
      ) {
        if ('min_price' in query) {
          if (Number(element) >= Number(query.min_price)) {
            filterObj.priceRange.highestPrice = Number(element);
          }
        } else {
          filterObj.priceRange.highestPrice = Number(element);
        }
      }

      if (key === 'city' || key === 'state' || key === 'country') {
        locationObj[key] = element;
      }
      if (key === 'lat' && !isNaN(Number(element))) {
        locationObj.latitude = Number(element);
      }
      if (key === 'lng' && !isNaN(Number(element))) {
        locationObj.longitude = Number(element);
      }

      if (key === 'accommodation_type') {
        const value = element as string;
        const accommodationTypeValidate = value.split(',');
        const arr = [];
        for (const type of accommodationTypeValidate) {
          if (accommodationTypeString.includes(type)) {
            arr.push(type);
          }
        }
        filterObj.accommodationType = arr;
      }

      if (
        key === 'living_rooms' ||
        key === 'kitchens' ||
        key === 'dining_rooms' ||
        key === 'rooms' ||
        key === 'bathrooms'
      ) {
        if (!isNaN(Number(element)) && Number(element) >= 0) {
          filterObj.spaces[key] = Number(element);
        }
      }

      if (key === 'property_type_group') {
        const value = element as string;
        const propertyTypeGroup = value.split(',');
        const arr = [];
        for (const type of propertyTypeGroup) {
          if (propertyTypeGroupString.includes(type)) {
            arr.push(type);
          }
        }
        filterObj.propertyTypeGroup = arr;
      }

      if (key === 'amenities') {
        const value = element as string;
        const amenities = value.split(',');
        const arr = [];
        for (const type of amenities) {
          if (amenitiesDataString.includes(type)) {
            arr.push(type);
          }
        }
        filterObj.amenities = arr;
      }
    }

    setFilters(filterObj);
    setLocation(Object.keys(locationObj).length ? locationObj : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!runFilterEffect) return;
    (async () => {
      try {
        let query = '';
        if (!isRemoveRilters) {
          for (const key in filters) {
            if (key === 'priceRange') {
              const priceRange = filters[key];
              query += `min_price=${priceRange.lowestPrice}&max_price=${priceRange.highestPrice}`;
            }
            if (key === 'accommodationType' && filters[key].length) {
              query += `&accommodation_type=${filters[key]}`;
            }
            if (key === 'spaces') {
              const spaces = filters[key];
              for (const key in spaces) {
                // @ts-ignore
                const value = spaces[key];
                if (value > 0) {
                  query += `&${key}=${value}`;
                }
              }
            }
            if (key === 'propertyTypeGroup' && filters[key].length) {
              query += `&property_type_group=${filters[key]}`;
            }
            if (key === 'amenities' && filters[key].length) {
              query += `&amenities=${filters[key]}`;
            }
          }

          if (location) {
            const { city, state, country, latitude, longitude } = location;
            if (city) query += `&city=${city}`;
            if (state) query += `&state=${state}`;
            if (country) query += `&country=${country}`;
            if (latitude) query += `&lat=${latitude}`;
            if (longitude) query += `&lng=${longitude}`;
          }
        }

        const { data } = await getCountAllListing({
          query,
        });
        setIsRemoveRilters(false);
        setQueryStringParams(query);
        setPropertiesAmount(data.total);
      } catch (err: any) {
        handleError({ err, type: MessageTypes.error });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, location, runFilterEffect]);

  const search = () => {
    setShowModal(false);
    const params = new URLSearchParams(window.location.search);
    router.push(
      params.has('q')
        ? `/?q=${params.get('q')}&${queryStringParams}`
        : queryStringParams.length
        ? `/?${queryStringParams}`
        : '/'
    );
  };

  const SpacesReactNodes = (
    arrData: {
      title: string;
      name: string;
    }[]
  ) => {
    return arrData.map((data, i) => (
      <React.Fragment key={`${data.name}-${i}`}>
        <h3 style={{ margin: '10px 0' }}>{data.title}</h3>
        <Row gutter={[16, 24]} align="middle">
          <Col xs={24} md={8}>
            <Button
              block
              type={
                // @ts-ignore
                filters.spaces[data.name] === 0 ? 'primary' : 'default'
              }
              onClick={() => {
                setFilters((state) => ({
                  ...state,
                  spaces: { ...state.spaces, [data.name]: 0 },
                }));
              }}
            >
              Cualquiera
            </Button>
          </Col>
          <Col xs={24} md={16}>
            <InputNumber
              controls={false}
              size="large"
              min={0}
              max={10}
              // @ts-ignore
              value={filters.spaces[data.name]}
              style={{ width: '100%' }}
              className="input-number"
              addonBefore={
                <Button
                  type="primary"
                  icon={<MinusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      return {
                        ...state,
                        spaces: {
                          ...state.spaces,
                          // @ts-ignore
                          [data.name]: state.spaces[data.name] - 1,
                        },
                      };
                    });
                  }}
                  // @ts-ignore
                  disabled={filters.spaces[data.name] <= 0}
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      return {
                        ...state,
                        spaces: {
                          ...state.spaces,
                          // @ts-ignore
                          [data.name]: state.spaces[data.name] + 1,
                        },
                      };
                    });
                  }}
                  // @ts-ignore
                  disabled={filters.spaces[data.name] >= 10}
                />
              }
              // @ts-ignore
              onChange={(value: number | null) => {
                setFilters((state) => {
                  return {
                    ...state,
                    spaces: {
                      ...state.spaces,
                      [data.name]: !value || value < 0 ? 0 : value,
                    },
                  };
                });
              }}
            />
          </Col>
        </Row>
      </React.Fragment>
    ));
  };

  return (
    <>
      <Modal
        title={
          <h2 style={{ textAlign: 'center', fontWeight: 'bold' }}>Filtros:</h2>
        }
        centered
        width="90vw"
        style={{ maxWidth: '1200px', top: '0', zIndex: '3000' }}
        bodyStyle={{ overflowY: 'scroll', height: '65vh' }}
        visible={true}
        footer={
          <Row
            justify="space-between"
            align="middle"
            gutter={[16, 16]}
            style={{
              borderTop: `1px solid ${colors.gray}`,
              paddingTop: '10px',
            }}
          >
            <Col xs={24} sm={12}>
              <Button
                type="link"
                block
                onClick={debounce(() => {
                  setFilters(() => ({
                    ...JSON.parse(JSON.stringify(initFiltersState)),
                  }));
                  setLocation(null);
                  setIsRemoveRilters(true);
                }, 800)}
              >
                Quitar los filtros
              </Button>
            </Col>
            <Col xs={24} sm={12} className="show-properties-amount">
              <Button
                type="primary"
                block
                onClick={debounce(() => search(), 800)}
              >
                Mostrar {propertiesAmount} propiedades
              </Button>
            </Col>
          </Row>
        }
        onCancel={() => setShowModal(false)}
      >
        <h2>Rango de precios:</h2>
        <Row gutter={[16, 24]} align="middle">
          <Col xs={24} lg={12}>
            <p style={{ textAlign: 'center' }}>Precio mínimo:</p>
            <InputNumber
              controls={false}
              size="large"
              min={100}
              max={filters.priceRange.highestPrice}
              value={filters.priceRange.lowestPrice}
              style={{ width: '100%' }}
              className="input-number"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              // @ts-ignore
              parser={(value: string) => value!.replace(/\$\s?|(,*)/g, '')}
              addonBefore={
                <Button
                  type="primary"
                  icon={<MinusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      const { priceRange } = state;
                      return {
                        ...state,
                        priceRange: {
                          ...priceRange,
                          lowestPrice:
                            priceRange.lowestPrice - 100 <= 100
                              ? 100
                              : priceRange.lowestPrice - 100,
                        },
                      };
                    });
                  }}
                  disabled={filters.priceRange.lowestPrice <= 100}
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      const { priceRange } = state;
                      return {
                        ...state,
                        priceRange: {
                          ...priceRange,
                          lowestPrice:
                            priceRange.lowestPrice + 100 >=
                            priceRange.highestPrice
                              ? priceRange.highestPrice
                              : priceRange.lowestPrice + 100,
                        },
                      };
                    });
                  }}
                  disabled={
                    filters.priceRange.lowestPrice >=
                    filters.priceRange.highestPrice
                  }
                />
              }
              onChange={(value: number | null) => {
                setFilters((state) => {
                  return {
                    ...state,
                    priceRange: {
                      ...state.priceRange,
                      lowestPrice: !value || value < 100 ? 100 : value,
                    },
                  };
                });
              }}
            />
          </Col>
          <Col xs={24} lg={12}>
            <p style={{ textAlign: 'center' }}>Precio máximo:</p>
            <InputNumber
              controls={false}
              size="large"
              min={filters.priceRange.lowestPrice}
              value={filters.priceRange.highestPrice}
              style={{ width: '100%' }}
              className="input-number"
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              // @ts-ignore
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              addonBefore={
                <Button
                  type="primary"
                  icon={<MinusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      const { priceRange } = state;
                      return {
                        ...state,
                        priceRange: {
                          ...priceRange,
                          highestPrice:
                            priceRange.highestPrice - 100 <=
                            priceRange.lowestPrice
                              ? priceRange.lowestPrice
                              : priceRange.highestPrice - 100,
                        },
                      };
                    });
                  }}
                  disabled={
                    filters.priceRange.highestPrice <=
                    filters.priceRange.lowestPrice
                  }
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() => {
                    setFilters((state) => {
                      return {
                        ...state,
                        priceRange: {
                          ...state.priceRange,
                          highestPrice: state.priceRange.highestPrice + 100,
                        },
                      };
                    });
                  }}
                />
              }
              onChange={(value: number | null) => {
                setFilters((state) => {
                  return {
                    ...state,
                    priceRange: {
                      ...state.priceRange,
                      highestPrice:
                        !value || value < state.priceRange.lowestPrice
                          ? state.priceRange.lowestPrice
                          : value,
                    },
                  };
                });
              }}
            />
          </Col>
        </Row>

        <Divider />

        <h2>Ubicación:</h2>
        <MapLocationWithNoSSR
          locationState={location}
          setLocationState={setLocation}
        />

        <Divider />

        <h2>Tipo de alojamiento:</h2>
        <Row gutter={[16, 24]} align="middle">
          {accommodationType.map((type, i) => (
            <Col key={`${type.value}-${i}`} xs={24} sm={12} md={8}>
              <Checkbox
                checked={filters.accommodationType.includes(type.value)}
                onChange={() => {
                  setFilters((state) => {
                    const includeType = filters.accommodationType.includes(
                      type.value
                    );

                    return {
                      ...state,
                      accommodationType: includeType
                        ? state.accommodationType.filter(
                            (value) => value !== type.value
                          )
                        : [...state.accommodationType, type.value],
                    };
                  });
                }}
              >
                <p>{type.name}</p>
                <Typography.Text type="secondary">
                  {type.description}
                </Typography.Text>
              </Checkbox>
            </Col>
          ))}
        </Row>

        <Divider />

        <h2>Cantidad de espacios:</h2>
        {SpacesReactNodes(floorPlanData.slice(0, 2))}
        {showSpaces && (
          <div className="spaces">
            {SpacesReactNodes(floorPlanData.slice(2))}
          </div>
        )}

        <Row align="middle" style={{ marginTop: '15px' }}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="link"
              block
              style={{ border: `1px solid #1890ff` }}
              onClick={() => setShowSpaces(!showSpaces)}
            >
              Muestra {showSpaces ? 'menos' : 'más'}
            </Button>
          </Col>
        </Row>

        <Divider />

        <h2>Tipo de propiedad:</h2>
        <Row gutter={[16, 16]} align="middle">
          {propertyTypeGroup.map((property, i) => (
            <Col key={`${property.name}-${i}`} xs={24} sm={12} xl={6}>
              <figure
                style={{
                  ...(filters.propertyTypeGroup.includes(property.value) && {
                    borderColor: colors.black,
                  }),
                }}
                onClick={() => {
                  setFilters((state) => {
                    const includeGroup = filters.propertyTypeGroup.includes(
                      property.value
                    );
                    return {
                      ...state,
                      propertyTypeGroup: includeGroup
                        ? state.propertyTypeGroup.filter(
                            (value) => value !== property.value
                          )
                        : [...state.propertyTypeGroup, property.value],
                    };
                  });
                }}
              >
                <div style={{ height: '200px', position: 'relative' }}>
                  <Image
                    src={property.imgURL}
                    alt={property.name}
                    layout="fill"
                    objectFit="cover"
                    style={{ borderRadius: '4px' }}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer('100%', '100%')
                    )}`}
                  />
                </div>
                <figcaption>{property.name}</figcaption>
              </figure>
            </Col>
          ))}
        </Row>

        <Divider />

        <h2>Servicios:</h2>
        <h3>Comodidades</h3>
        <Row gutter={[16, 24]} align="middle">
          {amenitiesData
            .filter((am) => am.type === 'amenity')
            .map((am, i) => (
              <Col key={`${am.value}-${i}`} xs={24} sm={12} md={8}>
                <Checkbox
                  checked={filters.amenities.includes(am.value)}
                  onChange={() => {
                    setFilters((state) => {
                      const includeAm = filters.amenities.includes(am.value);

                      return {
                        ...state,
                        amenities: includeAm
                          ? state.amenities.filter(
                              (value) => value !== am.value
                            )
                          : [...state.amenities, am.value],
                      };
                    });
                  }}
                >
                  <p>{am.name}</p>
                </Checkbox>
              </Col>
            ))}
        </Row>

        <div className="services">
          <h3>Servicios internos y externos</h3>
          <Row gutter={[16, 24]} align="middle">
            {amenitiesData
              .filter((am) => am.type === 'service')
              .map((am, i) => (
                <Col key={`${am.value}-${i}`} xs={24} sm={12} md={8}>
                  <Checkbox
                    checked={filters.amenities.includes(am.value)}
                    onChange={() => {
                      setFilters((state) => {
                        const includeAm = filters.amenities.includes(am.value);

                        return {
                          ...state,
                          amenities: includeAm
                            ? state.amenities.filter(
                                (value) => value !== am.value
                              )
                            : [...state.amenities, am.value],
                        };
                      });
                    }}
                  >
                    <p>{am.name}</p>
                  </Checkbox>
                </Col>
              ))}
          </Row>

          <h3>Seguridad</h3>
          <Row gutter={[16, 24]} align="middle">
            {amenitiesData
              .filter((am) => am.type === 'security')
              .map((am, i) => (
                <Col key={`${am.value}-${i}`} xs={24} sm={12} md={8}>
                  <Checkbox
                    checked={filters.amenities.includes(am.value)}
                    onChange={() => {
                      setFilters((state) => {
                        const includeAm = filters.amenities.includes(am.value);

                        return {
                          ...state,
                          amenities: includeAm
                            ? state.amenities.filter(
                                (value) => value !== am.value
                              )
                            : [...state.amenities, am.value],
                        };
                      });
                    }}
                  >
                    <p>{am.name}</p>
                  </Checkbox>
                </Col>
              ))}
          </Row>
        </div>
        <Row align="middle" style={{ marginTop: '15px' }}>
          <Col xs={24} sm={12} md={8}>
            <Button
              type="link"
              block
              style={{ border: `1px solid #1890ff` }}
              onClick={() => setShowServices(!showServices)}
            >
              Muestra {showServices ? 'menos' : 'más'}
            </Button>
          </Col>
        </Row>
      </Modal>
      <style jsx>{`
        h2 {
          margin-top: 25px;
          margin-bottom: 15px;
        }

        h2:first-child {
          margin-top: 0;
        }

        h3 {
          margin-top: 10px;
          margin-bottom: 10px;
        }

        p {
          margin-bottom: 10px;
        }

        figure {
          border-color: transparent;
          border-radius: 4px;
          border-style: solid;
          border-width: 1px;
          cursor: pointer;
          height: 100%;
          margin: 0;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        figure:hover {
          border-color: ${colors.black};
        }

        figcaption {
          color: ${addOpacity({ color: colors.black, opacity: 0.85 })};
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          padding: 10px 0;
          text-align: center;
        }

        .services {
          height: ${showServices ? 'auto' : '0'};
          overflow: ${showServices ? 'visible' : 'hidden'};
        }

        .spaces {
          height: ${showSpaces ? 'auto' : '0'};
          overflow: ${showSpaces ? 'visible' : 'hidden'};
        }
      `}</style>
    </>
  );
}
