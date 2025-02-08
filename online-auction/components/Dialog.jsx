import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dialog, Portal, Text } from 'react-native-paper';

const MyDialog = ({ visible, setVisible, currentBid, currentActivePlayer ,bidsHistory}) => {


    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Icon icon="alert" />
                <Dialog.Title style={styles.title}>{currentBid ? "Sold" :"UnSold"}</Dialog.Title>
                <Dialog.Content>
                {
                    currentBid ? <View>
                    <Text>{currentActivePlayer.name } is Sold to ..</Text>
                    <Text>{bidsHistory[bidsHistory.length-1].bidderName }  in .. {bidsHistory[bidsHistory.length-1].bidAmount} </Text>

                    </View>:
                    <Text variant="bodyMedium">{currentActivePlayer.name} is unsold</Text>
                }
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

export const MyDialogNotify = ({ visible, setVisible, message}) => {
    const hideDialog = () => setVisible(false);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
             

                <Dialog.Content>
                <Text>{message}</Text>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
    },
})

export default MyDialog;