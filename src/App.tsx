import React from 'react';
import { App as KonstaApp, View } from 'konsta/react';
import routes from './routes.js';

export default function App() {
  return (
    <KonstaApp theme="ios" routes={routes}>
      <View main url="/" />
    </KonstaApp>
  );
}
