import React from 'react';
import {Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, ToastAndroid, BackHandler, TouchableHighlightBase} from 'react-native'
import * as KeyChain from 'react-native-keychain'
import {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo';
import IconAnt from 'react-native-vector-icons/AntDesign'
import IconEntypo from 'react-native-vector-icons/Entypo'



const Home = ({navigation}) => {
    

    const [loading, setLoading] = useState(true);
    const [newVault, setNewVault] = useState(false);
    const [existingVault, setExistingVault] = useState(false);

    const [securePass, setSecurePass] = useState('');
    const [tokenVal, setToken] = useState('');
    const [uid, setUid] = useState('');
    const [logoutModal, setLogOutModal] = useState(false);



    const handleBackButton = () => {
        setLogOutModal(true);
        return true;
    }

    const handleExit = async () => {
        await KeyChain.resetGenericPassword();
        navigation.navigate('Login')
        ToastAndroid.show('Please Login again', ToastAndroid.SHORT);
    }


    const renderComponent = async() => {
        const credentials = await KeyChain.getGenericPassword();
        const token = JSON.parse(credentials['password']).token
        const userId = JSON.parse(credentials['password']).user._id
        setToken(token);
        setUid(userId);

            try {
                const response = await fetch('https://password-manager.adityesh.vercel.app/api/getVaults', {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json',
                        'Application-Type' : 'application/json',
                        'Authorization' : 'Bearer' + token
                    },
        
                    body : JSON.stringify({
                        userId
                    })
                })
        
                const result = await response.json();
                if(result.error === null) {
                    setVaultStatus(<View style={styles.statusWindow}><Text style={styles.error}>{result.message}</Text><TouchableOpacity onPress={checkExisitingVault} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>ACCESS VAULT <Icon name="lock-open" size={15} /></Text>
                    </TouchableOpacity></View>);
                } else {
                    setVaultStatus(<View style={styles.statusWindow}><Text>{result.error}</Text><TouchableOpacity onPress={handleNewVault} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>NEW VAULT</Text>
                    </TouchableOpacity></View>);
                }
                if(token) {
                    setLoading(false);
                } else {
                    KeyChain.resetGenericPassword()
                    navigation.navigate('Login')
                }
            } catch(err) {
                ToastAndroid.show("Network error.", ToastAndroid.SHORT);
                setLoading(false);
            }
        
            
        
        
    }


    const [vaultStatus, setVaultStatus] = useState(<ActivityIndicator size="small" color="#ef6c00"/>);

    const handleNewVault = async() => {
        setNewVault(true);
    }

    const postNewVault = async() => {

        try {
            const response = await fetch('https://password-manager.adityesh.vercel.app/api/newVault', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer' + tokenVal
                },
                body: JSON.stringify({userId: uid, masterPass : securePass})
    
            })
    
            const result = await response.json();
            setSecurePass('')
            ToastAndroid.show(result.message,ToastAndroid.LONG)
            await renderComponent();
            setNewVault(false);
        } catch(err) {
            ToastAndroid.show("Network error.", ToastAndroid.SHORT);
            setNewVault(false);
        }
        
        
        
    }

    const checkExisitingVault = () => {
        setExistingVault(true);
    }

    const handleExistingVault = async () => {
        try {
            const response = await fetch('https://password-manager.adityesh.vercel.app/api/getVault', {
                method : 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer' + tokenVal
                },
                body: JSON.stringify({userId: uid, masterPass : securePass})
            })
    
            const result = await response.json();
            if(result.error == null) {
                ToastAndroid.show(result.message,ToastAndroid.SHORT)
                setExistingVault(false);
                setSecurePass('')
                await navigation.navigate('Vault')
            } else {
                ToastAndroid.show(result.error,ToastAndroid.SHORT)
                await renderComponent();
                setExistingVault(false);
            }
        } catch(err) {
            ToastAndroid.show("Network error.", ToastAndroid.SHORT);
            setExistingVault(false);
        }
        

        

    }



    useEffect(() => {
        renderComponent()
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
            return () => {
                BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
        }
    });
    
        return (

            <>
                {vaultStatus}
               
            
            <View>
                


                <Modal isVisible={loading} style={{flex : 1, alignItems : 'center', borderRadius : 10}} backdropOpacity={0.50} animationIn='fadeIn' animationOut='fadeOut'>
                <View style={{ backgroundColor : 'white', width : '50%', height : '12%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, borderRadius : 10 }}>
                    <ActivityIndicator size="large" color="#ef6c00"/>
                </View>
                </Modal>

                <Modal isVisible={newVault} style={{ alignItems : 'center', backgroundColor : '#FFE0B2', height : '20%', borderRadius : 10}} backdropOpacity={0.50} animationIn='slideInUp' animationOut='slideOutDown' onBackButtonPress={() => setNewVault(false)} useNativeDriver={true}>
                    <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30, borderRadius : 10}}>
                    
                    <TextInput
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%', borderRadius : 10  }}
                        placeholder = "Enter Secure Password" 
                        onChangeText={securePass => setSecurePass(securePass)}
                        defaultValue={securePass}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity onPress={postNewVault} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}> CREATE VAULT<Icon name="lock" size={15} /></Text>
                    </TouchableOpacity>
                    </View>
                </Modal>


                <Modal isVisible={existingVault} style={{ alignItems : 'center', backgroundColor : '#FFE0B2', height : '20%'}} backdropOpacity={0.50} animationIn='slideInUp' animationOut='slideOutDown' onBackButtonPress={() => setExistingVault(false)} useNativeDriver={true}>
                    <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30, borderRadius : 10}}>
                    
                    <TextInput
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',borderRadius : 10  }}
                        placeholder = "Enter Secure Password" 
                        onChangeText={securePass => setSecurePass(securePass)}
                        defaultValue={securePass}
                        secureTextEntry={true}
                    />

                    <TouchableOpacity onPress={handleExistingVault} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>ENTER VAULT <IconAnt name="enter" size={15} /></Text>
                    </TouchableOpacity>
                    </View>
                </Modal>

                <Modal isVisible={logoutModal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.5} animationIn='bounceIn' animationOut='bounceOut' onBackdropPress={() => {setLogOutModal(false)}} useNativeDriver={true}>
                <View style={{ backgroundColor : 'white', width : '70%', height : '20%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, flexDirection : 'column', borderRadius : 10 }}>
                    <Text style={{fontSize : 20, fontWeight : 'bold'}}>
                        Exit the app ?
                    </Text>
                    <View style={{flexDirection : 'row', marginTop : 20}}>
                    <View style={{flexDirection : 'row', marginHorizontal : 10, alignItems : 'center'}}>
                        <Text style={{marginRight : 5}} onPress={handleExit}>YES</Text>
                        <IconEntypo name = "emoji-sad" size={24} color="red" onPress={handleExit}/>
                    </View>
                    <View style={{flexDirection : 'row', marginHorizontal : 10, alignItems : 'center'}}> 
                        <Text style={{marginRight : 5}} onPress={() => setLogOutModal(false)}>NO</Text>
                        <IconEntypo name = "emoji-happy" size={24} color="green" onPress={() => setLogOutModal(false)}/>
                    </View>
                    </View>
                    


                </View>
            </Modal>

            </View>
            
            
            </>
        )
    
}









const styles = StyleSheet.create({  
    container : {
        backgroundColor : '#FFE0B2',
        flex : 1, alignItems : 'center', justifyContent : 'center'
    },
    label : {
        fontSize : 20,
        marginBottom: 5
    },

    inputGroup : {
      flexDirection : 'column',
      alignItems : 'flex-start',
      justifyContent : 'flex-start',
      width : '100%',
      padding : 30
    },


    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#ef6c00",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      width : '50%',
      alignSelf : 'center',
      marginBottom : 30,
      marginTop : 30
    },
    appButtonText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },

    statusWindow : {flex : 1, flexDirection: 'column', alignItems : 'center', justifyContent : 'center'}
  
})  


export default Home;

