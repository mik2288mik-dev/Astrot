import React from 'react';
import { App as F7App, View } from 'framework7-react';
import { KonstaProvider } from 'konsta/react';
import Home from './pages/Home.jsx';

function App() {
  return (
    <KonstaProvider theme="ios">
      <F7App theme="ios">
        <View main>
          <Home />
        </View>
      </F7App>
    </KonstaProvider>
  );
}

export default App;
