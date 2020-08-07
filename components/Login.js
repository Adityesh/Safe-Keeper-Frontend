import React from 'react';
import {View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ToastAndroid} from 'react-native'
import {useState, useEffect} from 'react'
import Modal from 'react-native-modal';
import { TouchableOpacity } from 'react-native';
import * as KeyChain from 'react-native-keychain';
import Icon from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/FontAwesome'





const Login = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modal, setModal] = useState(false);
    const [modalBody, setModalBody] = useState('')
    


    let handleLogin = async () => {

        setModal(true);
        setModalBody(<ActivityIndicator size="large" color="#ef6c00"/>)
       
            try {
                const response = await fetch('https://password-manager.adityesh.vercel.app/api/login', {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email,password})
                });
        
                const result = await response.json();
                if(result && result.error == null) {
                    setModalBody(<><Icon name="check" size={30} color='green'/><Text style={{color : '#ef6c00', fontSize : 20}}></Text></>)
                    await KeyChain.setGenericPassword('user', JSON.stringify(result));
                    setTimeout(()=> {
                        setModal(false);
                        navigation.navigate('Home')
                    }, 1000)
        
                } else {
                    setModalBody(<><Icon2 name="exclamation" size={20} color="red"/><Text>{result.error.toString()}</Text></>)
                    setTimeout(()=> {
                        setModal(false);
        
                    }, 1500)
                }
            } catch(err) {
                ToastAndroid.show("Network error.", ToastAndroid.SHORT);
                setModal(false);
            }
            
        

        
            
        
        

        
        
   

        
        
    }

    useEffect(() => {
        return () => {
            
        }
    })


    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',  borderRadius : 10 }}
                placeholder = "Enter your email" textContentType = "emailAddress"
                onChangeText={email => setEmail(email)}
                defaultValue={email}
            />
            </View>
            

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Password :</Text>
                <TextInput
                    style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%', marginBottom : 30, borderRadius : 10 }}
                    placeholder = "Enter your password" textContentType = "emailAddress" secureTextEntry={true}
                    onChangeText={password => setPassword(password)}
                    defaultValue={password}
                />
            </View>

                
            <TouchableOpacity onPress={handleLogin} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>LOGIN <Icon name="login" size={15} /></Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>SIGN UP <Icon name="upload" size={15} /></Text>
            </TouchableOpacity>

            <View style={{borderRadius : 10}}>
                <Modal isVisible={modal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.50} animationIn='fadeIn' animationOut='fadeOut' onBackButtonPress={() => setModal(false)} onBackdropPress={() => setModal(false)}>
                <View style={{ backgroundColor : 'white', width : '50%', height : '12%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10, borderRadius : 10 }}>
                    <Text style={{fontSize: 15}}>{modalBody}</Text>
                    {/* {modalBody === 'Logging in...' ? <><ActivityIndicator size="large" color="#ef6c00"/><Text>{modalBody}</Text></> : <Text>Logged in</Text>} */}
                </View>
                </Modal>
            </View>

            

            
                
        </View>
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
        marginBottom : 30
      },
      appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
    
})  

export default Login;