import React, { useRef, useState, useCallback, useEffect } from 'react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore?: () => void;
  hasMore: boolean;
  loading: boolean;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  children,
  onLoadMore,
  hasMore,
  loading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const loadingRef = useRef(false);

  console.log('♾️ InfiniteScroll RENDER:', {
    hasMore,
    loading,
    childrenCount: React.Children.count(children),
    scrollPosition,
  });

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const currentPosition = scrollTop;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;

      console.log('📜 SCROLL EVENT:', {
        scrollTop,
        scrollHeight,
        clientHeight,
        isNearBottom,
        hasMore,
        loading: loadingRef.current,
        timestamp: Date.now(),
      });

      setScrollPosition(currentPosition);

      if (isNearBottom && hasMore && !loadingRef.current) {
        console.log('🔽 TRIGGERING LOAD MORE');
        loadingRef.current = true;
        onLoadMore?.();
      }
    },
    [hasMore, onLoadMore]
  );

  useEffect(() => {
    loadingRef.current = loading;
    console.log('🔄 Loading state changed:', loading);
  }, [loading]);

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="infinite-scroll-container"
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      {children}
    </div>
  );
};

export default InfiniteScroll;
