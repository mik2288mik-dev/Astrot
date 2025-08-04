import React from 'react';
import { Page, Navbar, Block } from 'framework7-react';

export default function Home() {
  return (
    <Page>
      <Navbar title="Home" />
      <Block>
        <p>Welcome to Astrot!</p>
      </Block>
    </Page>
  );
}
