import React, { useEffect } from 'react';
import { Page } from 'konsta/react';
import InfiniteScroll from '../components/InfiniteScroll';
import ItemsList from '../components/ItemsList';
import useInfiniteData from '../hooks/useInfiniteData';
import { logDOMStructure } from '../utils/logDOMStructure';

const InfiniteScrollPage: React.FC = () => {
  const { data, loading, hasMore, loadMore } = useInfiniteData();

  console.log('🚀 APP RENDER:', {
    timestamp: new Date().toISOString(),
    dataCount: data.length,
    loading,
    hasMore,
  });

  useEffect(() => {
    const interval = setInterval(logDOMStructure, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Page className="app">
      <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} loading={loading}>
        <ItemsList items={data} onLoadMore={loadMore} />
        {loading && <div className="loading">Загрузка...</div>}
      </InfiniteScroll>
    </Page>
  );
};

export default InfiniteScrollPage;
