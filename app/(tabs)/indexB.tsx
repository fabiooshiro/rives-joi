import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, UIManager, findNodeHandle, NativeTouchEvent } from 'react-native';

const App = () => {
    const [touches, setTouches] = useState<any[]>([]);
    const [targetMapping, setTargetMapping] = useState<Record<string, string>>({});

    const viewRefs = {
        view1: useRef(null),
        view2: useRef(null),
    };

    useEffect(() => {
        // Map nativeID to target IDs
        const mapTargets = async () => {
            const newMapping: any = {};
            for (const [nativeID, ref] of Object.entries(viewRefs)) {
                if (ref.current) {
                    const target = findNodeHandle(ref.current);
                    if (target) {
                        newMapping[target] = nativeID;
                    }
                }
            }
            setTargetMapping(newMapping);
        };

        mapTargets();
    }, []);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
                handleTouches(event.nativeEvent.touches);
            },
            onPanResponderMove: (event) => {
                handleTouches(event.nativeEvent.touches);
            },
            onPanResponderRelease: () => {
                setTouches([]);
            },
            onPanResponderTerminate: () => {
                setTouches([]);
            },
        })
    ).current;

    const handleTouches = (touches: NativeTouchEvent[]) => {
        console.log(touches.map(t => t.target))
        const updatedTouches = touches.map(touch => ({
            id: touch.identifier,
            x: touch.locationX,
            y: touch.locationY,
            target: touch.target,
            nativeID: targetMapping[touch.target],
        }));
        setTouches(updatedTouches);
    };

    return (
        <View style={styles.container} {...panResponder.panHandlers}>
            <View nativeID="view1" onLayout={(event) => {
                const target = findNodeHandle(event.target);
                console.log({ target })
                targetMapping[`${target}`] = "view1"
                setTargetMapping({...targetMapping});
            }} ref={viewRefs.view1} style={styles.joystick}>
                <Text style={styles.text}>View 1</Text>
            </View>
            <View nativeID="view2"
                onLayout={(event) => {
                    const target = findNodeHandle(event.target);
                    console.log({ target })
                    targetMapping[`${target}`] = "view2"
                    setTargetMapping({...targetMapping});
                }}
                ref={viewRefs.view2} style={styles.joystick}>
                <Text style={styles.text}>View 2</Text>
            </View>
            {touches.map(touch => (
                <Text key={touch.id} style={styles.text}>
                    Native ID: {touch.nativeID}
                    Touch ID: {touch.id}, X: {touch.x.toFixed(1)}, Y: {touch.y.toFixed(1)},
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    joystick: {
        width: '90%',
        height: 100,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
});

export default App;
