import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, PanResponder, NativeTouchEvent, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width: pageWidth, height: pageHeight } = Dimensions.get('window');

function hit(x: number, y: number, oX: number, oY: number, oW: number, oH: number) {
  return x > oX && x < oX + oW && y > oY && y < oY + oH;
}

function isButtonPressed(e: { pageX: number, pageY: number }, btn: { left: number, top: number, width: number, height: number }) {
  return hit(e.pageX, e.pageY, btn.left, btn.top, btn.width, btn.height)
}

export default function App() {
  // https://emulator.rives.io/#simple=true&cartridge=https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs
  // const cartridgeUrl = "https://release.eitri.calindra.com.br/build/organizations/cf5660ee-bf90-42cd-9a43-9d2c69ee3c89/applications/749d6f6f-f10f-4448-b36e-9c484b1293b8/eitri-apps/eitri-test-1716469363549/0.1.0/main.sqfs"
  const cartridgeUrl = "https://raw.githubusercontent.com/edubart/cartridges/main/gamepad.sqfs"
  const emulatorUrl = "https://emulator.rives.io/#simple=true&cartridge="
  const webviewRef = useRef(null);
  const [pressed, setPressed] = useState<Record<string, boolean>>({})

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (event, _gestureState) => {
        updateTouches(event.nativeEvent.touches);
      },
      onPanResponderMove: (event, _gestureState) => {
        updateTouches(event.nativeEvent.touches);
      },
      // onPanResponderEnd: (event, _gestureState) => {
      //   updateTouches(event.nativeEvent.touches);
      // },
      onPanResponderRelease: (_event, _gestureState) => {
        stopMove();
      },
      onPanResponderTerminate: (_event, _gestureState) => {
        stopMove();
      },
    })
  ).current;

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
    "d": {
      key: 'd',
      code: 'KeyD',
      keyCode: 68, // Deprecated, but still widely used
      charCode: 100, // Deprecated, but still widely used
      which: 68, // Deprecated, but still widely used
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
    if (pressed[key]) {
      return;
    }
    pressed[key] = true
    console.log('Pressed', key)
    setPressed({ ...pressed })
    const k = KEY_MAP[key]
    injectJs(`
      // Create a new keyboard event
      var event = new KeyboardEvent('keydown', ${JSON.stringify(k)});

      // Dispatch the event to the target element
      document.dispatchEvent(event);
      document.body.style.backgroundColor = "rgb(100,100,"+Math.floor((Math.random()*255))+")";
      true;
    `);
  };

  const handleButtonPressOut = (key: string) => {
    if (!pressed[key]) {
      return;
    }
    console.log('Released', key)
    pressed[key] = false
    setPressed({ ...pressed })
    const k = KEY_MAP[key]
    injectJs(`
      // Create a new keyboard event
      var event = new KeyboardEvent('keyup', ${JSON.stringify(k)});

      // Dispatch the event to the target element
      document.dispatchEvent(event);
      document.body.style.backgroundColor = "rgb(100,100,100)";
      true;
    `);
  };

  const stopMove = () => {
    handleButtonPressOut('ArrowRight')
    handleButtonPressOut('ArrowLeft')
    handleButtonPressOut('ArrowDown')
    handleButtonPressOut('ArrowUp')
    handleButtonPressOut('a')
    handleButtonPressOut('s')
    handleButtonPressOut('d')
  }

  const updateTouches = (touches: NativeTouchEvent[]) => {
    const pressed: Record<string, boolean> = {
      s: false,
      a: false,
      d: false,
      ArrowRight: false,
      ArrowLeft: false,
      ArrowDown: false,
      ArrowUp: false,
    }
    touches.forEach((e) => {
      if (isButtonPressed(e, styles.buttonS)) {
        pressed["s"] = true
      } else if (isButtonPressed(e, styles.buttonA)) {
        pressed["a"] = true
      } else if (isButtonPressed(e, styles.buttonD)) {
        pressed["d"] = true
      }
      if (isButtonPressed(e, styles.joystickUp)) {
        pressed["ArrowUp"] = true
      } else if (isButtonPressed(e, styles.joystickDown)) {
        pressed["ArrowDown"] = true
      }
      if (isButtonPressed(e, styles.joystickLeft)) {
        pressed["ArrowLeft"] = true
      } else if (isButtonPressed(e, styles.joystickRight)) {
        pressed["ArrowRight"] = true
      }
    })
    for (const k in pressed) {
      if (pressed[k]) {
        // console.log("-pressed", k)
        handleButtonPressIn(k)
      } else {
        // console.log("-released", k)
        handleButtonPressOut(k)
      }
    }
    // const updatedTouches = touches.map(touch => ({
    //   id: touch.identifier,
    //   x: touch.pageX,
    //   y: touch.locationY
    // }));
    // console.log(updatedTouches.length)
  };

  return (
    <>
      <View style={{ flex: 1, paddingTop: 40 }} {...panResponder.panHandlers}>
        <WebView
          ref={webviewRef}
          source={{
            uri: `${emulatorUrl}${cartridgeUrl}`,
          }}
          style={{ flex: 1 }}
        />
        <View style={styles.joystickUp}></View>
        <View style={styles.joystickDown}></View>
        <View style={styles.joystickLeft}></View>
        <View style={styles.joystickRight}></View>
        <View style={styles.buttonA}><Text style={styles.buttonText}>A</Text></View>
        <View style={styles.buttonS}><Text style={styles.buttonText}>S</Text></View>
        <View style={styles.buttonD}><Text style={styles.buttonText}>D</Text></View>
      </View>
    </>
  );
};

const PCT_ARROW = 0.36
const PADDING_BOTTOM = 25

const styles = StyleSheet.create({
  joystickUp: {
    position: 'absolute',
    width: 150,
    height: Math.floor(150 * PCT_ARROW),
    left: pageWidth - 150 - 20,
    top: pageHeight - 150 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 2,
  },
  joystickDown: {
    position: 'absolute',
    width: 150,
    height: Math.floor(150 * PCT_ARROW),
    left: pageWidth - 150 - 20,
    top: pageHeight - 150 - PADDING_BOTTOM + (150 - Math.floor(150 * PCT_ARROW)),
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 2,
  },
  joystickLeft: {
    position: 'absolute',
    width: Math.floor(150 * PCT_ARROW),
    height: 150,
    left: pageWidth - 150 - 20,
    top: pageHeight - 150 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 2,
  },
  joystickRight: {
    position: 'absolute',
    width: Math.floor(150 * PCT_ARROW),
    height: 150,
    left: pageWidth - 150 - 20 + (150 - Math.floor(150 * PCT_ARROW)),
    top: pageHeight - 150 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 2,
  },
  buttonText: {
    color: "white",
  },
  buttonA: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 20,
    top: pageHeight - 105 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 3,
  },
  buttonS: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 20,
    top: pageHeight - 50 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 3,
  },
  buttonD: {
    position: 'absolute',
    width: 50,
    height: 50,
    left: 20,
    top: pageHeight - 160 - PADDING_BOTTOM,
    backgroundColor: 'rgba(255,100,100,0.4)',
    zIndex: 3,
  },
});
