import { router } from 'expo-router';
import React from 'react';
import {
    StyleProp,
    ViewStyle,
    Animated,
    StyleSheet,
    Platform,
    ScrollView,
    Text,
    SafeAreaView,
    I18nManager,
} from 'react-native';
import { AnimatedFAB } from 'react-native-paper';

const FloatingButton = ({
    animatedValue,
    visible,
    extended,
    label,
    animateFrom,
    style,
    iconMode,
}) => {
    const [isExtended, setIsExtended] = React.useState(true);

    const isIOS = Platform.OS === 'ios';

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
            Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const fabStyle = { [animateFrom]: 16 };

    return (
        <SafeAreaView style={styles.container}>

            <AnimatedFAB
                icon={'message-text'}
                label={'Group Chat'}
                extended={isExtended}
                onPress={() => router.push('groupChat')}
                visible={visible}
                animateFrom={'right'}
                iconMode={'dynamic'}
                style={[styles.fabStyle, style, fabStyle]}
            />
        </SafeAreaView>
    );
};

export default FloatingButton;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "transparent"
    },
    fabStyle: {
        bottom: 16,
        right: 16,
        position: 'absolute',
    },
});