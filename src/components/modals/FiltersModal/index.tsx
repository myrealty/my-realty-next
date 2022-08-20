import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// axios
import { getCountAllListing } from 'api/listing';
// components
import { FilterMapWithNoSSR } from 'components/maps/FilterMap';
import { handleError, MessageTypes } from 'helpers/handlers';
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
// helpers
import { debounce } from 'helpers/debounce';
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
import { colors, breakPoints } from 'styles/variables';
import { addOpacity } from 'styles/utils';

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FiltersType {
  q: string;
  min_price: number;
  max_price: number;
  has_min_price: boolean;
  has_max_price: boolean;
  accommodation_type: string[];
  living_rooms: number;
  kitchens: number;
  dining_rooms: number;
  rooms: number;
  bathrooms: number;
  property_type_group: string[];
  amenities: string[];
}

const initFiltersState: FiltersType = {
  q: '',
  min_price: 100,
  max_price: 100_000_000,
  has_min_price: false,
  has_max_price: false,
  accommodation_type: [],
  living_rooms: 0,
  kitchens: 0,
  dining_rooms: 0,
  rooms: 0,
  bathrooms: 0,
  property_type_group: [],
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
  const [isRemoveFilters, setIsRemoveFilters] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (!Object.keys(router.query).length) {
      setRunFilterEffect(true);
      setIsRemoveFilters(true);
      return;
    }

    const filterObj = structuredClone(initFiltersState);
    const locationObj: any = {};

    const { query } = router;
    for (const key in query) {
      const element = query[key];

      if (key === 'q') {
        filterObj.q = element as string;
      }

      if (
        key === 'min_price' &&
        !isNaN(Number(element)) &&
        Number(element) >= 100
      ) {
        if ('max_price' in query) {
          if (Number(element) <= Number(query.max_price)) {
            filterObj.min_price = Number(element);
          }
        } else {
          filterObj.min_price = Number(element);
        }
        filterObj.has_min_price = true;
      }
      if (
        key === 'max_price' &&
        !isNaN(Number(element)) &&
        Number(element) >= 100
      ) {
        if ('min_price' in query) {
          if (Number(element) >= Number(query.min_price)) {
            filterObj.max_price = Number(element);
          }
        } else {
          filterObj.max_price = Number(element);
        }
        filterObj.has_max_price = true;
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
        filterObj.accommodation_type = arr;
      }

      if (
        key === 'living_rooms' ||
        key === 'kitchens' ||
        key === 'dining_rooms' ||
        key === 'rooms' ||
        key === 'bathrooms'
      ) {
        if (!isNaN(Number(element)) && Number(element) > 0) {
          filterObj[key] = Number(element);
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
        filterObj.property_type_group = arr;
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
    setRunFilterEffect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!runFilterEffect) return;
    (async () => {
      try {
        let query = '';
        if (!isRemoveFilters) {
          for (const key in filters) {
            if (key === 'q' && filters[key].length) {
              query += `${query.length ? '&' : ''}q=${filters[key]}`;
            }

            if (key === 'min_price' && filters.has_min_price) {
              query += `${query.length ? '&' : ''}min_price=${filters[key]}`;
            }
            if (key === 'max_price' && filters.has_max_price) {
              query += `&max_price=${filters[key]}`;
            }

            if (key === 'accommodation_type' && filters[key].length) {
              query += `${query.length ? '&' : ''}accommodation_type=${
                filters[key]
              }`;
            }

            if (key === 'living_rooms' && filters[key] > 0) {
              query += `${query.length ? '&' : ''}living_rooms=${filters[key]}`;
            }
            if (key === 'kitchens' && filters[key] > 0) {
              query += `${query.length ? '&' : ''}kitchens=${filters[key]}`;
            }
            if (key === 'dining_rooms' && filters[key] > 0) {
              query += `${query.length ? '&' : ''}dining_rooms=${filters[key]}`;
            }
            if (key === 'rooms' && filters[key] > 0) {
              query += `${query.length ? '&' : ''}rooms=${filters[key]}`;
            }
            if (key === 'bathrooms' && filters[key] > 0) {
              query += `${query.length ? '&' : ''}bathrooms=${filters[key]}`;
            }

            if (key === 'property_type_group' && filters[key].length) {
              query += `${query.length ? '&' : ''}property_type_group=${
                filters[key]
              }`;
            }
            if (key === 'amenities' && filters[key].length) {
              query += `${query.length ? '&' : ''}amenities=${filters[key]}`;
            }
          }

          if (location) {
            const { city, state, country, latitude, longitude } = location;
            if (country) {
              if (city) query += `${query.length ? '&' : ''}city=${city}`;
              if (state) query += `${query.length ? '&' : ''}state=${state}`;
              if (country)
                query += `${query.length ? '&' : ''}country=${country}`;
              if (latitude)
                query += `${query.length ? '&' : ''}lat=${latitude}`;
              if (longitude)
                query += `${query.length ? '&' : ''}lng=${longitude}`;
            }
          }
        }

        const { data } = await getCountAllListing({
          query,
        });
        setIsRemoveFilters(false);
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
    let URI = '/';
    if (queryStringParams.length) {
      URI += `?${queryStringParams}`;
    }
    router.push(URI);
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
                filters[data.name] === 0 ? 'primary' : 'default'
              }
              onClick={debounce(() => {
                setFilters((state) => ({
                  ...state,
                  [data.name]: 0,
                }));
              }, 500)}
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
              value={filters[data.name]}
              style={{ width: '100%' }}
              className="input-number"
              addonBefore={
                <Button
                  type="primary"
                  icon={<MinusCircleOutlined />}
                  size="large"
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      // @ts-ignore
                      [data.name]: state[data.name] - 1,
                    }));
                  }, 500)}
                  // @ts-ignore
                  disabled={filters[data.name] <= 0}
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      // @ts-ignore
                      [data.name]: state[data.name] + 1,
                    }));
                  }, 500)}
                  // @ts-ignore
                  disabled={filters[data.name] >= 10}
                />
              }
              // @ts-ignore
              onChange={debounce((value: number | null) => {
                setFilters((state) => {
                  let dataValue = 0;

                  if (value !== null && value >= 0 && value <= 10) {
                    dataValue = value;
                  }

                  return { ...state, [data.name]: dataValue };
                });
              }, 200)}
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
                  setIsRemoveFilters(true);
                }, 500)}
              >
                Quitar los filtros
              </Button>
            </Col>
            <Col xs={24} sm={12} className="show-properties-amount">
              <Button type="primary" block onClick={debounce(search, 500)}>
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
              max={filters.max_price}
              value={filters.min_price}
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
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      min_price:
                        state.min_price - 100 <= 100
                          ? 100
                          : state.min_price - 100,
                      has_min_price: true,
                      has_max_price: true,
                    }));
                  }, 200)}
                  disabled={filters.min_price <= 100}
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      min_price:
                        state.min_price + 100 >= state.max_price
                          ? state.max_price
                          : state.min_price + 100,
                      has_min_price: true,
                      has_max_price: true,
                    }));
                  }, 200)}
                  disabled={filters.min_price >= filters.max_price}
                />
              }
              onChange={debounce((value: number | null) => {
                setFilters((state) => ({
                  ...state,
                  min_price: !value || value < 100 ? 100 : value,
                  has_min_price: true,
                  has_max_price: true,
                }));
              }, 200)}
            />
          </Col>
          <Col xs={24} lg={12}>
            <p style={{ textAlign: 'center' }}>Precio máximo:</p>
            <InputNumber
              controls={false}
              size="large"
              min={filters.min_price}
              value={filters.max_price}
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
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      max_price:
                        state.max_price - 100 <= state.min_price
                          ? state.min_price
                          : state.max_price - 100,
                      has_min_price: true,
                      has_max_price: true,
                    }));
                  }, 200)}
                  disabled={filters.max_price <= filters.min_price}
                />
              }
              addonAfter={
                <Button
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={debounce(() => {
                    setFilters((state) => ({
                      ...state,
                      max_price: state.max_price + 100,
                      has_min_price: true,
                      has_max_price: true,
                    }));
                  }, 200)}
                />
              }
              onChange={debounce((value: number | null) => {
                setFilters((state) => ({
                  ...state,
                  max_price:
                    !value || value < state.min_price ? state.min_price : value,
                  has_min_price: true,
                  has_max_price: true,
                }));
              }, 200)}
            />
          </Col>
        </Row>

        <Divider />

        <h2>Ubicación:</h2>
        <FilterMapWithNoSSR
          locationState={location}
          setLocationState={setLocation}
        />

        <Divider />

        <h2>Tipo de alojamiento:</h2>
        <Row gutter={[16, 24]} align="middle">
          {accommodationType.map((type, i) => (
            <Col key={`${type.value}-${i}`} xs={24} sm={12} md={8}>
              <Checkbox
                checked={filters.accommodation_type.includes(type.value)}
                onChange={debounce(() => {
                  setFilters((state) => {
                    const includeType = state.accommodation_type.includes(
                      type.value
                    );

                    return {
                      ...state,
                      accommodation_type: includeType
                        ? state.accommodation_type.filter(
                            (value) => value !== type.value
                          )
                        : [...state.accommodation_type, type.value],
                    };
                  });
                }, 500)}
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
                  borderColor: filters.property_type_group.includes(
                    property.value
                  )
                    ? colors.black
                    : undefined,
                }}
                onClick={debounce(() => {
                  setFilters((state) => {
                    const includeGroup = state.property_type_group.includes(
                      property.value
                    );
                    return {
                      ...state,
                      property_type_group: includeGroup
                        ? state.property_type_group.filter(
                            (value) => value !== property.value
                          )
                        : [...state.property_type_group, property.value],
                    };
                  });
                }, 500)}
              >
                <div>
                  <property.Icon />
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
                  onChange={debounce(() => {
                    setFilters((state) => {
                      const includeAm = state.amenities.includes(am.value);

                      return {
                        ...state,
                        amenities: includeAm
                          ? state.amenities.filter(
                              (value) => value !== am.value
                            )
                          : [...state.amenities, am.value],
                      };
                    });
                  }, 500)}
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
                    onChange={debounce(() => {
                      setFilters((state) => {
                        const includeAm = state.amenities.includes(am.value);

                        return {
                          ...state,
                          amenities: includeAm
                            ? state.amenities.filter(
                                (value) => value !== am.value
                              )
                            : [...state.amenities, am.value],
                        };
                      });
                    }, 500)}
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
                    onChange={debounce(() => {
                      setFilters((state) => {
                        const includeAm = state.amenities.includes(am.value);

                        return {
                          ...state,
                          amenities: includeAm
                            ? state.amenities.filter(
                                (value) => value !== am.value
                              )
                            : [...state.amenities, am.value],
                        };
                      });
                    }, 500)}
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
          padding: 10px;
          margin: 0;
          text-align: center;
          transition: border-color 0.2s ease;
        }

        figure > div {
          height: 100px;
          margin-left: auto;
          margin-right: auto;
          width: 100px;
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

        @media (min-width: ${breakPoints.sm}) {
          figure > div {
            height: 150px;
            width: 150px;
          }
        }
      `}</style>
    </>
  );
}
