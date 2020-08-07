import React, {useState, useEffect} from 'react';
import {View, Text, ActivityIndicator, TextInput, ToastAndroid} from 'react-native'
import KeyChain from 'react-native-keychain'
import Button from 'react-native-button'
import Modal from 'react-native-modal'


export default Delete = ({navigation}) => {

    const [securePass, setSecurePass] = useState('')
    const [modal, setModal] = useState(false);
    const [modalBody, setModalBody] = useState(<ActivityIndicator size="large" color="#ffaf49"/>)

    const renderComponent = async() => {
        const credentials = await KeyChain.getGenericPassword();
        const token = JSON.parse(credentials['password']).token
        const userId = JSON.parse(credentials['password']).user._id
       
        if(token) {
            
        } else {
            KeyChain.resetGenericPassword()
            navigation.navigate('Login')
        }
    }

    const handleDelete = async () => {
        setModal(true);
        const credentials = await KeyChain.getGenericPassword();
            const userId = JSON.parse(credentials['password']).user._id;
            const token = JSON.parse(credentials['password']).token
            
            try {
                const response = await fetch(`https://password-manager.adityesh.vercel.app/api/deleteVault`, {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Application-Type' : 'application/json',
                        'Authorization' : 'Bearer' + token
                    },
                    body : JSON.stringify({
                        userId,
                        masterPass : securePass
                    })
            })
                const result = await response.json();
                if(result.error === null) {
                    // No error in deleting vault
                    setModal(false);
                    ToastAndroid.show('Deletion successful', ToastAndroid.SHORT);
                    navigation.navigate('Home')
                } else {
                    setModalBody(<Text>{result.error}</Text>);
                }
                setSecurePass('')
    
            } catch(err) {
                setModal(false);
                ToastAndroid.show('Error fetching user details', ToastAndroid.SHORT)
            }
    }


    useEffect(() => {
        renderComponent();
        return () => {

        }
    })
    return (
        <View>
            <Text>Delete Vault ? </Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%', borderRadius : 10  }}
                placeholder = "Enter Master Password" 
                onChangeText={securePass => setSecurePass(securePass)}
                defaultValue={securePass}
                secureTextEntry={true}
            />

                <Button
                    containerStyle={{padding : 10,paddingHorizontal : 20, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={handleDelete}
                    >
                    DELETE
                </Button>

                <Modal isVisible={modal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.5} animationIn='bounceIn' animationOut='bounceOut' onBackdropPress={() => {setModal(false)}} onBackButtonPress={() => {setModal(false)}} useNativeDriver={true}>
                    <View style={{ backgroundColor : 'white', width : '70%', height : '20%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, flexDirection : 'column', borderRadius : 10 }}>
                        <View style={{marginHorizontal : 10, flex : 1, alignItems : 'center', justifyContent : 'center', marginTop : 10}}>{modalBody}</View>
                    </View>
                </Modal>
        </View>
    )
}