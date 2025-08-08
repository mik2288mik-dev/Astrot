export const logDOMStructure = () => {
  console.log('🏗 DOM STRUCTURE CHECK:');

  const containers = document.querySelectorAll(
    '[class*="container"], [class*="page"], [class*="scroll"]'
  );
  containers.forEach((el, index) => {
    console.log(`Container ${index}:`, {
      className: (el as HTMLElement).className,
      id: (el as HTMLElement).id,
      childrenCount: el.children.length,
      scrollHeight: (el as HTMLElement).scrollHeight,
      clientHeight: (el as HTMLElement).clientHeight,
      scrollTop: (el as HTMLElement).scrollTop,
    });
  });

  const allItems = document.querySelectorAll('[class*="item"]');
  const itemIds = Array.from(allItems).map((el) =>
    (el as HTMLElement).dataset.id || el.textContent?.slice(0, 20) || ''
  );
  const duplicateIds = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);

  if (duplicateIds.length > 0) {
    console.error('🚨 DUPLICATE DOM ELEMENTS:', duplicateIds);
  }
};
