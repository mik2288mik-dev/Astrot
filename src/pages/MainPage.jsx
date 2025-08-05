import React from 'react';
import { Page, Navbar, Block, Button } from 'konsta/react';

export default function MainPage() {
  return (
    <Page>
      <Navbar title="Astrot" />
      <Block strong className="text-center mt-8">
        <Button href="/natal-form/" className="neon-btn">Построить натальную карту</Button>
      </Block>
    </Page>
  );
}
