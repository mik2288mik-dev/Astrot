import React from 'react';
import { Page, Navbar, Block, Button, Link } from 'konsta/react';
import StarField from '../components/StarField';
import Koteus from '../components/Koteus';

export default function MainPage() {
  return (
    <Page className="relative overflow-hidden text-center">
      <StarField />
      <Navbar title="Astrot" right={<Link navbar href="/settings/">⚙️</Link>} />
      <Block strong className="mt-8 glassy inline-block mx-auto">
        <Koteus />
        <Button href="/natal-form/" className="neon-btn mt-4">
          Построить натальную карту
        </Button>
      </Block>
    </Page>
  );
}
