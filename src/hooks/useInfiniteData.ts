import { useState, useCallback } from 'react';

interface Item {
  id: string;
  text?: string;
}

// Simulated async data fetcher
const fetchData = async (page: number): Promise<Item[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return Array.from({ length: 20 }, (_, i) => ({
    id: `item-${page}-${i}`,
    text: `Item ${page}-${i}`,
  }));
};

const useInfiniteData = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log('💾 useInfiniteData STATE:', {
    dataLength: data.length,
    loading,
    page,
    hasMore,
    firstItems: data.slice(0, 3).map((item) => item.id),
  });

  const loadMore = useCallback(async () => {
    if (loading) {
      console.log('⏸️ Already loading, skipping...');
      return;
    }

    console.log('📥 LOADING MORE DATA:', { currentPage: page });
    setLoading(true);

    try {
      const newData = await fetchData(page);
      console.log('✅ DATA LOADED:', {
        page,
        newItemsCount: newData.length,
        newItemsIds: newData.map((item) => item.id),
        totalItemsAfter: data.length + newData.length,
      });

      setData((prevData) => {
        const combined = [...prevData, ...newData];
        console.log('🔀 COMBINING DATA:', {
          prevCount: prevData.length,
          newCount: newData.length,
          combinedCount: combined.length,
        });
        return combined;
      });

      setPage((prev) => prev + 1);
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error('❌ LOADING ERROR:', error);
    } finally {
      setLoading(false);
    }
  }, [data, loading, page]);

  return { data, loading, hasMore, loadMore };
};

export default useInfiniteData;
