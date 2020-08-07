import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Update from './components/Update'
import Vault from './components/Vault';
import Delete from './components/Delete';
import DeleteAccount from './components/DeleteAccount'


import IconAnt from 'react-native-vector-icons/AntDesign'
import IconFont from 'react-native-vector-icons/FontAwesome5'

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{
      headerStyle: {
        backgroundColor: '#ef6c00',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}>
        <Stack.Screen name="Home" component={Home} options={({ navigation }) => ({
              headerLeft : null,
              headerRight: () => (
                <IconAnt
                  onPress={() => navigation.navigate('Update')}
                  name="profile"
                  size={25}
                  color="white"
                  style={{marginRight : 10}}
                />
              ),
            })}
/>
        <Stack.Screen name="Vault" component={Vault}  />
        <Stack.Screen name="Update" component={Update} options={({ navigation }) => ({
              headerLeft : null,
              headerRight: () => (
                <IconFont
                  onPress={() => navigation.navigate('Home')}
                  name="house-user"
                  size={25}
                  color="white"
                  style={{marginRight : 10}}
                />
              ),
              title : 'Profile'
            })} />
        <Stack.Screen name="Login" component={Login} options={{title : "Login to your account"}}/>
        <Stack.Screen name="Delete" component={Delete} options={{title : "Delete Vault"}}/>
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{title : "Delete Account"}}/>
        <Stack.Screen name="Register" component={Register} options={{headerLeft : null, title : "Register yourself"}}/>
      </Stack.Navigator>
      
    </NavigationContainer>
  );
}

export default App;