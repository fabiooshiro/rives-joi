import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar, setStatusBarHidden } from 'expo-status-bar';

const { width: pageWidth, height: pageHeight } = Dimensions.get('window');

export default function App() {
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    setStatusBarHidden(true)
    
  }
  useEffect(() => {
    changeScreenOrientation()

  }, [])
  return (
    <>
      <View style={{ flex: 1, paddingTop: 0 }}>
        <WebView
          source={{
            uri: `https://wasm4.org/play/antcopter/`,
          }}
          style={{ flex: 1 }}
        />
      </View>
    </>
  );
};
