import React, { useEffect, useState } from 'react';
import {Text, View, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid, TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import Button from 'react-native-button'
import KeyChain from 'react-native-keychain'
import Modal from 'react-native-modal'
import IconEntypo from 'react-native-vector-icons/Entypo'

const Update = ({navigation}) => {

    const [isLoading, setLoading] = useState(true);
    const [userName, setUsername] = useState('')
    const [logoutModal, setLogOutModal] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalBody, setModalBody] = useState(<ActivityIndicator size="large" color="#ffaf49"/>)
    

    const renderComponent = async() => {
        const credentials = await KeyChain.getGenericPassword();
        const token = JSON.parse(credentials['password']).token
        const userId = JSON.parse(credentials['password']).user._id
       
        if(token) {
            setLoading(false);
        } else {
            KeyChain.resetGenericPassword()
            navigation.navigate('Login')
        }
    }


    const displayUpdateModal = async () => {
        setModal(true);
        const credentials = await KeyChain.getGenericPassword();
        const userId = JSON.parse(credentials['password']).user._id;
        const token = JSON.parse(credentials['password']).token


        try {
            const response = await fetch(`https://password-manager.adityesh.vercel.app/api/details?userId=${userId}`, {
            headers : {
                'Content-Type' : 'application/json',
                'Application-Type' : 'application/json',
                'Authorization' : 'Bearer' + token
            }
        })
            const result = await response.json();
            if(result.error === null) {
                // No error in fetching user data
                const data = result.userDetails;
                setModalBody(<View style={{flex : 1, flexDirection : 'column'}}>
                    <Text style={{fontWeight : 'bold', marginBottom : 20}}>User Details: </Text>
                    <Text style={{marginBottom : 5}}>Username : {data.username}</Text>
                    <Text style={{marginBottom : 5}}>Email : {data.email}</Text>
                    <Text style={{marginBottom : 5}}>Phone no. : {data.phone}</Text>
                
                </View>);
            } else {
                setModalBody(<Text>{result.error}</Text>);
            }

        } catch(err) {
            setModal(false);
            ToastAndroid.show('Error fetching user details', ToastAndroid.SHORT)
        }

        
    }

    const changeToDelete = () => {
        navigation.navigate('Delete');
        setModal(false);
    }

    const changeToDeleteAccount = () => {
        navigation.navigate('DeleteAccount');
        setModal(false);
    }

    const deleteAccount = () => {
        setModal(true);
        setModalBody(<View> 
            <Text style={{fontSize : 20, fontWeight : 'bold', color : "red"}}>
            This action is irreversible and deletes your entire account
            </Text>

            <View style={{flexDirection : 'row', marginTop : 20, justifyContent : 'space-around'}}>
                <Button
                    containerStyle={{padding:10,paddingHorizontal : 20, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={changeToDeleteAccount}
                    >
                    YES
                </Button>
                <Button
                    containerStyle={{padding : 10,paddingHorizontal : 20, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={() => {setModal(false)}}
                    >
                    NO
                </Button>
            </View>
        </View>)
    }

    const deleteVault = () => {
        setModal(true);
        setModalBody(<View> 
            <Text style={{fontSize : 20, fontWeight : 'bold', color : "red"}}>
            This action is irreversible
            </Text>

            <View style={{flexDirection : 'row', marginTop : 20, justifyContent : 'space-around'}}>
                <Button
                    containerStyle={{padding:10,paddingHorizontal : 20, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={changeToDelete}
                    >
                    YES
                </Button>
                <Button
                    containerStyle={{padding : 10,paddingHorizontal : 20, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
                    style={{fontSize: 20, color: 'white'}}
                    onPress={() => {setModal(false)}}
                    >
                    NO
                </Button>
            </View>
        </View>)

    }




    const handleBackButton = () => {
        setLogOutModal(true);
        
    }

    const handleExit = async () => {
        await KeyChain.resetGenericPassword();
        navigation.navigate('Login');
    }
    
    useEffect(() => {
        (async() => {
            renderComponent();
            const credentials = await KeyChain.getGenericPassword();
            const username = JSON.parse(credentials['password']).user.username
            setLoading(false);
            setUsername(username);
        })()

        
            return () => {
              
        }
    })




 
    return(
        <View style={{height : '100%'}}>
        <View style={{flex : 1, alignItems : 'center', justifyContent : 'center', marginTop : 60}}>
            <Icon name="emoji-happy" size={100}/>
            <Text style={{fontWeight : 'bold',fontSize : 25, marginTop : 10}}>{isLoading ? <ActivityIndicator size="small" color="#ffaf49"/> : 'HELLO ' + userName.toUpperCase()}</Text>
        </View>

        <View style={{flex : 3, alignItems : 'center', marginTop : 100}}>

        <Button
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
            style={{fontSize: 20, color: 'white'}}
            onPress={displayUpdateModal}
            >
            View Account Details
        </Button>

        <Button
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
            style={{fontSize: 20, color: 'red'}}
            onPress={deleteVault}
            >
            Delete Vault
        </Button>

        <Button
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
            style={{fontSize: 20, color: 'red'}}
            onPress={deleteAccount}
            >
            Delete Account
        </Button>

        <Button
            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#ffaf49', alignSelf : 'stretch', marginBottom : 10}}
            style={{fontSize: 20, color: 'white'}}
            onPress={handleBackButton}
            >
            LOGOUT
        </Button>
        </View>

        <Modal isVisible={logoutModal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.5} animationIn='bounceIn' animationOut='bounceOut' onBackdropPress={() => {setLogOutModal(false)}} useNativeDriver={true}>
                <View style={{ backgroundColor : 'white', width : '70%', height : '20%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, flexDirection : 'column', borderRadius : 10 }}>
                    <Text style={{fontSize : 20, fontWeight : 'bold'}}>
                        Logout of the app ?
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
            <View style={{flex: 1,alignItems : 'center', marginTop : 50}}>
                <Text style={{fontSize : 10}}>Made with <IconEntypo name="heart" size={10} color="red" /> by Adityesh</Text>
                <Text style={{fontSize : 10}}>v0.1</Text>
            </View>

            <Modal isVisible={modal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.5} animationIn='bounceIn' animationOut='bounceOut' onBackdropPress={() => {setModal(false)}} onBackButtonPress={() => {setModal(false)}} useNativeDriver={true}>
                <View style={{ backgroundColor : 'white', width : '70%', height : '40%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, flexDirection : 'column', borderRadius : 10 }}>
                    <View style={{marginHorizontal : 10, flex : 1, alignItems : 'center', justifyContent : 'center', marginTop : 10}}>{modalBody}</View>
                </View>
            </Modal>

            

        </View>
    )
}


const styles = StyleSheet.create({
    touchable: { flex: 0.5, borderColor: "black", borderWidth: 1 },
    text: { alignSelf: "center" }
})

export default Update;