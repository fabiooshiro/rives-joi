import React, { useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  const cartridgeUrl = "https://release.eitri.calindra.com.br/build/organizations/cf5660ee-bf90-42cd-9a43-9d2c69ee3c89/applications/749d6f6f-f10f-4448-b36e-9c484b1293b8/eitri-apps/eitri-test-1716469363549/0.1.0/main.sqfs"
  const emulatorUrl = "https://emulator.rives.io/#simple=true&cartridge="
  const webviewRef = useRef(null);

  const injectJs = (run: string) => {
    if (webviewRef.current) {
      (webviewRef.current as any).injectJavaScript(run);
    }
  }

  const KEY_MAP: Record<string, any> = {
    "a": {
      key: 'a',
      code: 'KeyA',
      keyCode: 65, // Deprecated, but still widely used
      charCode: 97, // Deprecated, but still widely used
      which: 65, // Deprecated, but still widely used
      bubbles: true
    },
    "s": {
      key: 's',
      code: 'KeyS',
      keyCode: 83, // Deprecated, but still widely used
      charCode: 115, // Deprecated, but still widely used
      which: 83, // Deprecated, but still widely used
      bubbles: true
    },
    "ArrowUp": {
      key: 'ArrowUp',
      code: 'ArrowUp',
      keyCode: 38, // Deprecated, but still widely used
      charCode: 0, // Deprecated, but still widely used
      which: 38, // Deprecated, but still widely used
      bubbles: true
    },
    "ArrowDown": {
      key: 'ArrowDown',
      code: 'ArrowDown',
      keyCode: 40, // Deprecated, but still widely used
      charCode: 0, // Deprecated, but still widely used
      which: 40, // Deprecated, but still widely used
      bubbles: true
    },
    "ArrowLeft": {
      key: 'ArrowLeft',
      code: 'ArrowLeft',
      keyCode: 37, // Deprecated, but still widely used
      charCode: 0, // Deprecated, but still widely used
      which: 37, // Deprecated, but still widely used
      bubbles: true
    },
    "ArrowRight": {
      key: 'ArrowRight',
      code: 'ArrowRight',
      keyCode: 39, // Deprecated, but still widely used
      charCode: 0, // Deprecated, but still widely used
      which: 39, // Deprecated, but still widely used
      bubbles: true
    }
  };
  

  const handleButtonPressIn = (key: string) => {
    const k = KEY_MAP[key]
    injectJs(`
      // Create a new keyboard event
      var event = new KeyboardEvent('keydown', ${JSON.stringify(k)});

      // Dispatch the event to the target element
      document.dispatchEvent(event);
      document.body.style.backgroundColor = "rgb(255,0,"+Math.floor((Math.random()*255))+")";
      true;
    `);
  };

  const handleButtonPressOut = (key: string) => {
    const k = KEY_MAP[key]
    injectJs(`
      // Create a new keyboard event
      var event = new KeyboardEvent('keyup', ${JSON.stringify(k)});

      // Dispatch the event to the target element
      document.dispatchEvent(event);
      document.body.style.backgroundColor = "rgb(255,0,"+Math.floor((Math.random()*255))+")";
      true;
    `);
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webviewRef}
        source={{
          uri: `${emulatorUrl}${cartridgeUrl}`,
        }}
        style={{ flex: 1 }}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("a")}
          onPressOut={() => handleButtonPressOut("a")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>A</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("s")}
          onPressOut={() => handleButtonPressOut("s")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>S</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("ArrowUp")}
          onPressOut={() => handleButtonPressOut("ArrowUp")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("ArrowDown")}
          onPressOut={() => handleButtonPressOut("ArrowDown")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Down</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("ArrowLeft")}
          onPressOut={() => handleButtonPressOut("ArrowLeft")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Left</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => handleButtonPressIn("ArrowRight")}
          onPressOut={() => handleButtonPressOut("ArrowRight")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Right</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
