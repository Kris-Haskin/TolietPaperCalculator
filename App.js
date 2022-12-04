import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import emptyTubes from './assets/full-tp-rolls.png';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);

function HomeScreen({ navigation }) {
  const [numberOfRolls, setNumberOfRolls] = useState(1);
  const [sheetsPerRoll, setsheetsPerRoll] = useState(1);
  const [price, setPrice] = useState(1);
  const [sqFtPerRoll, setSqFtPerRoll] = useState(1);
  const [brand, setBrand] = useState(1);

  const [pricePerRoll, setPricePerRoll] = useState(1);
  const [pricePerSqFt, setpricePerSqFt] = useState(1);
  const [pricePerSheet, setPricePerSheet] = useState(1);


  const onPress = () => {
// calculate()


    navigation.navigate('Details', {
      numberOfRolls: numberOfRolls,
      sheetsPerRoll: sheetsPerRoll,
      price: price,
      sqFtPerRoll: sqFtPerRoll,
      brand: brand,

      pricePerRoll: pricePerRoll,
      pricePerSqFt: pricePerSqFt,
      pricePerSheet: pricePerSheet,
    });
  }

const calculate = () => {
  const PPR = (price/numberOfRolls).toFixed(2);
  setPricePerRoll(PPR)

  const PPSF = ((price/numberOfRolls)/sqFtPerRoll).toFixed(5);
  setpricePerSqFt(PPSF)

  const PPS = ((price/numberOfRolls)/sheetsPerRoll).toFixed(5);
  setPricePerSheet(PPS)
}


  return (
    <View style={styles.container}>

      <Text style={styles.title}>Brand:</Text>
      <TextInput
        style={styles.TxtInput}
        placeholder="Brand Name"
        onChangeText={value => setBrand(value)}
      />

      <Text style={styles.title}>Price:</Text>
      <TextInput
        style={styles.TxtInput}
        placeholder="Enter Price"
        onChangeText={value => setPrice(value)}
      />

      <Text style={styles.title}>Rolls per package:</Text>
      <TextInput
        style={styles.TxtInput}
        placeholder="Enter the Number of Rolls"
        onChangeText={value => setNumberOfRolls(value)}
      />

      <Text style={styles.title}>Sheets per roll:</Text>
      <TextInput
        style={styles.TxtInput}
        placeholder="Enter the Number of Sheets per Roll"
        onChangeText={value => setsheetsPerRoll(value)}
      />
      <Text style={styles.title}>Sq feet per roll:</Text>

      <TextInput
        style={styles.TxtInput}
        placeholder="Enter the Number of square feet per Roll"
        onChangeText={value => setSqFtPerRoll(value)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={onPress}

      >
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>


    </View>
  );
}

function ResultsScreen({ route }) {
  /* 2. Get the param */
  const { numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, brand} = route.params;
 
  const PPR = (price/numberOfRolls).toFixed(2);
  const PPSF = ((price/numberOfRolls)/sqFtPerRoll).toFixed(5);
  const PPS = ((price/numberOfRolls)/sheetsPerRoll).toFixed(5);
   
  return (
    <View style={styles.details}>
            <Text style={styles.title}>{brand}:</Text>
      <Text style={styles.TPStats}>{numberOfRolls}-pack costs ${PPR} per roll:</Text>
      <Text style={styles.TPStats}>Thats is {PPSF} per square foot</Text>
      <Text style={styles.TPStats}>or {PPS} per sheet</Text>
      <Image source={emptyTubes} style={styles.picture} />

    </View>
  );
}
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4dbdea',
          },
          headerTintColor: '#fff',
        }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Toilet Paper Cost Calculator" }} />
        <Stack.Screen name="Details" component={ResultsScreen
        } options={{ title: "Toilet Paper Cost Calculator" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: '#fff',
   // alignItems: 'left',
   marginLeft: 10,
   justifyContent: 'center',

  },
  details: {
    flex: 1,
   justifyContent: 'center',
  },
  TPStats: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 15,
  },

  picture: {
    witdh: 305,
    Height: 159,
  },

  subtitle: {
    color: "black",
    fontSize: 25,
    marginBottom: 1,
    fontWeight: "bold",

  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5,

  },

  button: {
    backgroundColor: "gray",
    padding: 10,
    marginBottom: 20,

  },

  buttonText: {
    fontSize: 20,
    color: "white",
  },

  TxtInput: {
    height: 30,
    width: 200,
    marginBottom: 5,
    marginTop: 5,
  
  },
  txtOutput: {
    fontSize: 20,
  }

});

