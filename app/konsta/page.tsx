"use client";

import { App as Framework7App, View } from "framework7-react";
import { Page, Navbar, Block, Button } from "konsta/react";

export default function KonstaPage() {
  return (
    <Framework7App theme="ios">
      <View main>
        <Page>
          <Navbar title="Konsta + Framework7" />
          <Block strong className="space-y-4">
            <p>Hello from Konsta!</p>
            <Button>Click Me</Button>
          </Block>
        </Page>
      </View>
    </Framework7App>
  );
}
