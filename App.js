import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import "expo-dev-client"; 
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import React, { useState, useEffect } from 'react';



export default function App() {

    // Set an initializing state whilst Firebase connects
    const [initializing, setInitializing] = useState(true);
    
    const [user, setUser] = useState("");

    
  GoogleSignin.configure({
    webClientId: '518045572856-nsem2q32h9fgicd6ef4rbtdvkgmf3s2p.apps.googleusercontent.com',
  });
  //518045572856-cqv14n60bil25ippao4cee3jadss6n7j.apps.googleusercontent.com

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);



  const onGoogleButtonPress = async() => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    // Sign-in the user with the credential
    const user_sign_in = auth().signInWithCredential(googleCredential);
    user_sign_in.then((user) => {
      console.log(user)
    })
    .catch((error) => {
      console.log(error);
    })
  };

  const signOut = async () => {
    try{
      await GoogleSignin.revokeAccess();
      await auth().signOut();
      //await GoogleSignin,signOut();
      setUser(null)
    }catch (error){
      console.error(error);
    }
  }

  if (initializing) return null;


if(!user){
  return(
  <View style={styles.container}>
    <View style={{marginLeft:15, marginTop: 30}}>
      <Text style={{fontWeight: 'bold', fontSize:28}}>
        Sign in with Google
      </Text>
    </View>

    <GoogleSigninButton
    style={{width: 300, height: 65, marginTop: 300}}
    onPress={() => onGoogleButtonPress()}
    />
  </View>
  )
} {

return(
  <View style={styles.container}>
    <View style={{marginLeft:15, marginTop: 30}}>
      <Text style={{fontWeight: 'bold', fontSize:28}}>
        Sign in with Google
      </Text>
    </View>
<View style={{marginTop: 100, alignItems: 'center'}}>
  <Text style={styles.text}> Welcome, {user.displayName}  </Text>
  <Text style={styles.text}> email: {user.email}</Text>
  {/* <Text style={styles.text}>Verified: {toString(JSON.stringify(user.lengthemailVerified))}</Text> */}
  <Image
  source={{uri: user.photoURL}}
  style={{height: 300, width: 300, borderRadius:150, margin: 50}}
  />
  <Button title='Sign Out' onPress={() => signOut()} />
</View>
  </View>
)
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
text: {
  fontSize: 23,
  fontWeight: 'bold',
}
});
