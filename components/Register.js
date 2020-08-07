import React from 'react';
import {View, ScrollView, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, ToastAndroid} from 'react-native'
import {useState, useEffect} from 'react'
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Entypo'
import Icon2 from 'react-native-vector-icons/FontAwesome'





const Login = ({navigation}) => {

    const [email, setEmail] = useState('');
    const [pass, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [repass, setRepass] = useState('');
    const [username, setUsername] = useState('')
    const [modal, setModal] = useState(false);
    const [modalBody, setModalBody] = useState('')


    let handleRegister = async () => {

        setModal(true);
        setModalBody(<ActivityIndicator size="large" color="#ef6c00"/>)
        try {
            const response = await fetch('https://password-manager.adityesh.vercel.app/api/register', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    phone,
                    email,
                    pass,
                    repass
                })
            });
    
            const result = await response.json();
            if(result && result.error == null) {
                setModalBody(<><Icon name="check" size={20} styles={{marginLeft:3}}/><Text style={{color : '#ef6c00'}}></Text></>)
                    setTimeout(()=> {
                        setModal(false);
                        navigation.navigate('Login')
                    }, 100)
        
                } else {
                    setModalBody(<><Icon2 name="exclamation" size={20} color="red"  styles={{marginLeft:3}}/><Text>{result.error}</Text></>)
                    setTimeout(()=> {
                        setModal(false);
        
                    }, 2000)
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
        <ScrollView contentContainerStyle={styles.container} >
            <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30}}>
            <Text style={styles.label}>Username :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%', borderRadius : 10  }}
                placeholder = "Enter your username" 
                onChangeText={username => setUsername(username)}
                defaultValue={username}
            />
            </View>

            <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30}}>
            <Text style={styles.label}>Email :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',  borderRadius : 10}}
                placeholder = "Enter your email" 
                onChangeText={email => setEmail(email)}
                defaultValue={email}
            />
            </View>

            <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30}}>
            <Text style={styles.label}>Phone number :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',borderRadius : 10  }}
                placeholder = "Enter your phone number" 
                onChangeText={phone => setPhone(phone)}
                defaultValue={phone}
            />
            </View>
            

            <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30}}>
            <Text style={styles.label}>Password :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',borderRadius : 10 }}
                placeholder = "Enter your password" 
                onChangeText={pass => setPassword(pass)}
                defaultValue={pass}
                secureTextEntry={true}
            />
            </View>

            <View style={{flexDirection : 'column', alignItems : 'flex-start', justifyContent : 'flex-start', width : '100%', padding : 30}}>
            <Text style={styles.label}>Re-type Password :</Text>
            <TextInput
                style={{ height: 50, borderColor: 'gray', borderWidth: 1, width : '100%',borderRadius : 10 }}
                placeholder = "Re-enter your password" 
                onChangeText={repass => setRepass(repass)}
                defaultValue={repass}
                secureTextEntry={true}
            />
            </View>
            

            <TouchableOpacity onPress={handleRegister} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>REGISTER <Icon name="upload" size={15} /></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.appButtonContainer}>
                <Text style={styles.appButtonText}>SIGN IN <Icon name="login" size={15} /></Text>
            </TouchableOpacity>

            <View>
                <Modal isVisible={modal} style={{flex : 1, alignItems : 'center'}} backdropOpacity={0.50} animationIn='fadeIn' animationOut='fadeOut' onBackButtonPress={() => setModal(false)} onBackdropPress={() => setModal(false)}>
                <View style={{ backgroundColor : 'white', width : '50%', height : '12%', flex : 0, alignItems : 'center', justifyContent : 'center',padding : 10 , borderRadius : 10}}>
                    <Text style={{fontSize: 15}}>{modalBody}</Text>
                </View>
                </Modal>
            </View>
            
                  
                
        </ScrollView>
    )
    
}

const styles = StyleSheet.create({  
      container : {
          backgroundColor : '#FFE0B2',
          
      },
      label : {
          fontSize : 20,
          marginBottom: 10
      },
      button : {
          height : 40
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