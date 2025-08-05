import React from 'react';
import { App as KonstaApp } from 'konsta/react';
import { View } from 'framework7-react';
import routes from './routes.js';

export default function App() {
  return (
    <KonstaApp theme="ios" routes={routes}>
      <View main url="/" />
    </KonstaApp>
  );
}
