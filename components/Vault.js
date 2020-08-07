import React from 'react';
import {Text, View, ActivityIndicator, TouchableOpacity, StyleSheet, TextInput, ToastAndroid, ScrollView, SafeAreaView} from 'react-native'
import * as KeyChain from 'react-native-keychain'
import {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import CryptoJS from "react-native-crypto-js";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/Ionicons';
import IconEntypo from 'react-native-vector-icons/Entypo'

const Vault = ({navigation}) => {

        const [tokenVal, setToken] = useState('');
        const [uid, setUid] = useState('');
        const [resOutput, setOutput] = useState(<ActivityIndicator size="small" color="#ef6c00"/>);
        const [passwords, setPasswords] = useState([]);
        const [loading, setLoading] = useState(true);
        const [openPasswordModal, setOpenPasswordModal] = useState(false);
        const [label, setLabel] = useState('')
        const [securePass, setSecurePass] = useState('');

        // Show password details upon click in a modal
        const [showPass, setShowPass] = useState(false);
        const [passwordBody, setPasswordBody] = useState('');

        

        const renderVault = async () => {

            const credentials = await KeyChain.getGenericPassword();
            const token = JSON.parse(credentials['password']).token
            const userId = JSON.parse(credentials['password']).user._id;
            setToken(token);
            setUid(userId);

            
                const response = await fetch('https://password-manager.adityesh.vercel.app/api/getPass',{
                    method : "POST",
                    headers : {
                        'Content-Type' : 'application/json',
                        'Application-Type' : 'application/json',
                        'Authorization' : 'Bearer' + tokenVal
                    },
                    body : JSON.stringify({
                        userId : uid
                    })
                })
                
                const result = await response.json();
                if(result.error === null) {
                    setOutput('HERE ARE YOUR VAULT DETAILS:');
                    setPasswords(result.passwords);
                } else if (result.error === "User id wasn't provided.") {
                    setOutput(<ActivityIndicator size="small" color="#ef6c00"/>);
                }
                    else {
                    setOutput(result.error)
                }

                setTimeout(() => {
                    setLoading(false);
                },200)
            

        }

        const openPasswordWindow = () => {
            setOpenPasswordModal(true);
        }

        const createPassword = async () => {

            setLoading(true);
            
            let encryptedPass = CryptoJS.AES.encrypt(securePass,uid).toString();
            try {
                const response = await fetch('https://password-manager.adityesh.vercel.app/api/new', {
                    method : 'POST',
                    headers : {
                        'Authorization' : 'Bearer ' + tokenVal,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        userId : uid,
                        label,
                        password : encryptedPass
                    })
                })

                const result = await response.json();
                

                if(result.error === null) {
                    setOpenPasswordModal(false);
                    ToastAndroid.show(result.message, ToastAndroid.LONG);
                    setLoading(false);
                    
                } else {
                    ToastAndroid.show(result.error, ToastAndroid.LONG);
                    setLoading(false);
                }


            } catch(err) {
                ToastAndroid.show(err, ToastAndroid.SHORT);
            }

        }

        


        const showPasswordModal = (label, decryptedText) => {
            setPasswordBody(<>
                            <Text>Label : {label + '\n'}</Text>
                            <Text>Secret : {decryptedText}</Text>
                            </>)

            setShowPass(true);
        }

        const deletePassword = async (label) => {
            setLoading(true);
            const userId = uid;
            try {
                const response = await fetch('https://password-manager.adityesh.vercel.app/api/deletePass', {
                    method : 'POST',
                    headers : {
                        'Authorization' : 'Bearer ' + tokenVal,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body : JSON.stringify({
                        userId,
                        label
                    })
                })

                const result = await response.json();
                if(result.error === null) {
                    ToastAndroid.show(result.message, ToastAndroid.LONG);
                    setLoading(false);
                    navigation.navigate('Home');
                } else if(result.error === "User id wasn't provided.") {
                    setOutput(<ActivityIndicator size="small" color="#ef6c00"/>);
                }
                
                
                else {
                    ToastAndroid.show(result.error, ToastAndroid.LONG);
                    setLoading(false);
                }


            } catch(err) {
                ToastAndroid.show(err, ToastAndroid.SHORT);
            }
        }

        useEffect(()=> {
            renderVault();
           
            return () => {
                
            }
        })
    
        return (
            <>

           <View style={{flex:1}}> 
                <Text style={{alignSelf:'center', fontSize : 20, marginTop : 20}}>{resOutput}</Text>
                <TouchableOpacity onPress={openPasswordWindow} style={styles.createButton}>
                        <Text style={styles.appButtonText}>CREATE <Icon2 name="create" size={15}/></Text>
                </TouchableOpacity>
                
           </View>

            <SafeAreaView style={{flex:3}}>
                <ScrollView> 
                        {passwords.map((password, index) => {
                            let bytes  = CryptoJS.AES.decrypt(password.password, uid);
                            let originalText = bytes.toString(CryptoJS.enc.Utf8);
                            return( 
                                    <View key={index} style={{flexDirection : 'row', alignItems : 'center', justifyContent : 'space-evenly',flexWrap: 'wrap', marginHorizontal : 10, marginBottom : 10, padding : 20, borderWidth : 4}}>
                                        <View style={styles.item}>
                                        <Text style={styles.label}>{password.label}</Text>
                                        </View>
                                        
                                        <View style={styles.item}>
                                            
                                            <Icon name="eye" size={30} onPress={() => showPasswordModal(password.label, originalText)} style={styles.iconButton} color="green"/>
                                            <Icon name='trash-o' size={30} onPress={() => deletePassword(password.label)} style={styles.iconButton} color="red"/>
                                        
                                        </View>
                                        
                                        
                                        
                                    </View>)
                        })}
                </ScrollView>
           </SafeAreaView>
            
                
            <Modal isVisible={loading} style={{flex : 1, alignItems : 'center', borderRadius : 10}} backdropOpacity={0.50} animationIn='fadeIn' animationOut='fadeOut'>
                <View style={{ backgroundColor : 'white', width : '50%', height : '12%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, borderRadius : 10 }}>
                    <ActivityIndicator size="large" color="#ef6c00"/>
                </View>
            </Modal>


            <Modal isVisible={openPasswordModal} style={{ alignItems : 'center', backgroundColor : '#FFE0B2', height : '20%', borderRadius : 10}} backdropOpacity={0.50} animationIn='slideInUp' animationOut='slideOutDown' onBackButtonPress={() => setOpenPasswordModal(false)} useNativeDriver={true}>
                    <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30, borderRadius : 10}} >

                    <TextInput
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%', marginBottom : 10, borderRadius : 10 ,fontSize : 20 }}
                        placeholder = "Enter Label" 
                        onChangeText={label => setLabel(label)}
                        defaultValue={label}
                        
                    />

                    <TextInput
                        style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',borderRadius : 10,fontSize : 20  }}
                        placeholder = "Enter Secure Password" 
                        onChangeText={securePass => setSecurePass(securePass)}
                        defaultValue={securePass}
                        secureTextEntry={false}
                    />

                    <TouchableOpacity onPress={createPassword} style={styles.appButtonContainer}>
                        <Text style={styles.appButtonText}>CREATE PASSWORD</Text>
                    </TouchableOpacity>
                    </View>
            </Modal>

            <Modal isVisible={showPass} style={{flex : 1, alignItems : 'center', borderRadius : 10}} backdropOpacity={1} animationIn='bounceIn' animationOut='bounceOut' onBackButtonPress={() => {setShowPass(false);setPasswordBody('')}} useNativeDriver={true}>
                <View style={{ backgroundColor : 'white', width : '50%', height : '12%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, borderRadius : 10 }}>
                    <Text>{passwordBody}</Text>
                </View>
            </Modal>

            

            
                
            </>
            
        )
    
}

const styles = StyleSheet.create({  
    container : {
        backgroundColor : '#FFE0B2',
        flex : 1, alignItems : 'center', justifyContent : 'center'
    },
    label : {
        fontSize : 15,
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
      paddingVertical: 10,
      paddingHorizontal: 12,
      width : '50%',
      alignSelf : 'center',
      marginBottom : 30,
      marginTop : 30,
      borderTopEndRadius : 10,
      borderBottomLeftRadius : 10
    },
    appButtonText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    },

    createButton : {
        
        elevation: 8,
        backgroundColor: "#ef6c00",
        paddingVertical: 10,
        paddingHorizontal: 12,
        width : '30%',
        alignSelf : 'center',
        marginBottom : 30,
        marginTop : 30,
        borderTopEndRadius : 10,
        borderBottomLeftRadius : 10
          
    },

    statusWindow : {flex : 1, flexDirection: 'column', alignItems : 'center', justifyContent : 'center'},
    label : {
        fontFamily : 'sans-serif',
        fontWeight : 'bold',
        fontSize : 30
    },

    iconButton : {
        alignSelf : 'center',
        marginLeft : 10,

    }

    ,
    item : {
        width : '50%',
        flexDirection : 'row',
        alignItems : 'flex-start',
        justifyContent : 'space-evenly'
    }
    
})  


export default Vault;

