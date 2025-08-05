import React, { useRef } from 'react';

interface Item {
  id: string;
  text?: string;
}

interface ItemsListProps {
  items: Item[];
  onLoadMore?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ItemsList: React.FC<ItemsListProps> = ({ items, onLoadMore }) => {
  const renderCount = useRef(0);
  renderCount.current++;

  console.log('📋 ItemsList RENDER:', {
    renderNumber: renderCount.current,
    itemsCount: items?.length || 0,
    itemsIds: items?.map((item) => item.id).slice(0, 5) || [],
    timestamp: Date.now(),
  });

  // Duplicate check
  const duplicates =
    items?.filter(
      (item, index) => items.findIndex((i) => i.id === item.id) !== index
    ) || [];

  if (duplicates.length > 0) {
    console.error('🚨 DUPLICATE ITEMS FOUND:', duplicates.map((d) => d.id));
  }

  return (
    <div className="items-list">
      {items?.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className="item"
          data-id={item.id}
        >
          {item.text || item.id}
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
