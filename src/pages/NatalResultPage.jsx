/* eslint-disable react/prop-types */
import React from 'react';
import { Page, Navbar, Block } from 'konsta/react';

export default function NatalResultPage({ result }) {
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
