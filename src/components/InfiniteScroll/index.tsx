import React, { MutableRefObject, useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
  dataLength: number;
  hasMore: boolean;
  loader: React.ReactNode;
  next: () => Promise<void>;
  parent?: MutableRefObject<null>;
}

const InfiniteScroll = ({
  children,
  dataLength,
  hasMore,
  loader,
  parent,
  next,
}: Props) => {
  const [isNearScreen, setIsNearScreen] = useState(false);
  const [loadingNewData, setloadingNewData] = useState(false);

  useEffect(() => {
    if (dataLength === 0) return;
    const $element = document.querySelector('#visor');

    const options = { rootMargin: '100px', root: null };
    if (parent && parent.current !== null) {
      options.root = parent.current;
    }

    const observer = new IntersectionObserver(async (entries) => {
      const el = entries[0];
      if (el.isIntersecting) {
        setIsNearScreen(true);
      } else {
        setIsNearScreen(false);
      }
    }, options);

    if ($element) {
      observer.observe($element);
    }
    return () => {
      observer && observer.disconnect();
    };
  }, [dataLength, parent]);

  useEffect(() => {
    if (!isNearScreen) return;
    if (hasMore && !loadingNewData) {
      (async () => {
        setloadingNewData(true);
        await next();
        setloadingNewData(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNearScreen]);

  if (dataLength === 0) return null;

  return (
    <>
      {children}
      {loadingNewData && (
        <div
          style={{
            margin: '10px 0px',
            padding: '10px 0px',
            textAlign: 'center',
          }}
        >
          {loader}
        </div>
      )}
      <div id="visor"></div>
    </>
  );
};

export default React.memo(InfiniteScroll);
