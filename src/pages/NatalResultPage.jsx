/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Page, Navbar, Block } from 'konsta/react';

export default function NatalResultPage({ data }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function fetchNatal() {
      // Здесь в будущем можно вызвать внешний API, передав данные формы.
      // Пример:
      // const response = await fetch('YOUR_API_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const json = await response.json();
      // setResult(json);
      setResult(null);
    }
    fetchNatal();
  }, [data]);

  return (
    <Page>
      <Navbar title="Результат" />
      <Block strong>
        {result ? (
          <pre>{JSON.stringify(result, null, 2)}</pre>
        ) : (
          'Здесь будет результат натальной карты'
        )}
      </Block>
    </Page>
  );
}
