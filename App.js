import React, { useState, useEffect, Component } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, SafeAreaView, Alert } from 'react-native';
//import { StatusBar } from 'expo-status-bar';
import * as SQLite from "expo-sqlite";
import emptyTubes from './assets/full-tp-rolls.png';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);



function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => { },
        };
      },
    };
  }

  const db = SQLite.openDatabase("TPDBnumberTwo.db");

  return db;
}

const db = openDatabase();

//function totals() {
function Totals() {
  // const [totals, settotals] = useState(null);  
  const [totals, setTotals] = useState(null);


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select id, brand, numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, pricePerRoll, pricePerSqFt, pricePerSheet from totals order by pricePerSqFt;`,
        [],
        (_, { rows: { _array } }) => setTotals(_array)
      );
    });
  },[]);

  if (totals === null || totals.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>

      {/* <Text style={styles.title} >Totals</Text> */}

      {totals.map(({ id, brand, numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, pricePerRoll, pricePerSqFt, pricePerSheet }) => (
        <Text style={styles.map} key={id}>{brand}:{numberOfRolls}-pack  {("\n")}costs {pricePerRoll} per roll. {"\n"}
          That is {pricePerSheet} per sheet{"\n"}or {pricePerSqFt} per square foot </Text>

      ))}
    </View>



  );
}


function HomeScreen({ navigation }) {
  const [numberOfRolls, setNumberOfRolls] = useState("");
  const [sheetsPerRoll, setsheetsPerRoll] = useState("");
  const [price, setPrice] = useState("");
  const [sqFtPerRoll, setSqFtPerRoll] = useState("");
  const [brand, setBrand] = useState("");

  const [pricePerRoll, setPricePerRoll] = useState("");
  const [pricePerSqFt, setpricePerSqFt] = useState("");
  const [pricePerSheet, setPricePerSheet] = useState("");

  //////////////////////////////////////////////////////////
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists totals (id integer primary key not null, brand real, numberOfRolls real, sheetsPerRoll real, price real, sqFtPerRoll real, pricePerRoll real, pricePerSqFt real, pricePerSheet real);"
      );
    });
  }, []);
  //////////////////////////////////////////////////////////

  const addTotals = () => {
    if (brand === null || brand === "" || price === null || price === "" || numberOfRolls === null || numberOfRolls === "" ||
      sheetsPerRoll === null || sheetsPerRoll === "" || sqFtPerRoll === null || sqFtPerRoll === "") {
      Alert.alert('Data Validation Error', 'Please enter full and proper data.');
      return false;
    }
    
    const Totals = CalculateTotals();
    if (Totals === null || Totals === "") {
      return false;
    }
    
CalculateTotals();

    db.transaction(
      (tx) => {
        tx.executeSql("insert into totals (brand, numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, pricePerRoll, pricePerSqFt, pricePerSheet) values (?, ?, ?, ?, ?, ?, ?, ?)", [brand, numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, pricePerRoll, pricePerSqFt, pricePerSheet]);
        tx.executeSql("select * from totals", [], (_, { rows }) =>
          console.log(JSON.stringify(rows))
        );
      }
    );

    navigation.navigate('Details', {

    });



  }

  const CalculateTotals = () => {
    
    const PPR = (price / numberOfRolls).toFixed(2);
    const PPSF = ((price / numberOfRolls) / sqFtPerRoll).toFixed(5);
    const PPS = ((price / numberOfRolls) / sheetsPerRoll).toFixed(5);

    setPricePerRoll(PPR);
    setpricePerSqFt(PPSF);
    setPricePerSheet(PPS);
    return;
  }


  return (
    <View style={styles.container}>

      <Text style={styles.title}>Brand:</Text>
      <TextInput
        style={styles.TxtInput}
        placeholder="Enter Brand Name"
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
        placeholder="Number of Sheets per Roll"
        onChangeText={value => setsheetsPerRoll(value)}
      />
      <Text style={styles.title}>Sq feet per roll:</Text>

      <TextInput
        style={styles.TxtInput}
        placeholder="Number of square feet per Roll"
        onChangeText={value => setSqFtPerRoll(value)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={addTotals}

      >
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

    </View>
  );
}

function ResultsScreen({ route }) {
  /* 2. Get the param */
  // const { numberOfRolls, sheetsPerRoll, price, sqFtPerRoll, brand } = route.params;

  // const PPR = (price / numberOfRolls).toFixed(2);
  // const PPSF = ((price / numberOfRolls) / sqFtPerRoll).toFixed(5);
  // const PPS = ((price / numberOfRolls) / sheetsPerRoll).toFixed(5);
  const handleButtonPress = () => { WebBrowser.openBrowserAsync('https://www.sunrisespecialty.com/how-to-use-toilet-paper'); }
  return (

    <SafeAreaView style={styles.container}>

      {Platform.OS === "web" ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={styles.heading}>
            Expo SQlite is not supported on web!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>


          <Totals />

        </ScrollView>

      )}
      <Image source={emptyTubes} style={styles.picture} />

      <TouchableOpacity
        style={styles.button}
        onPress={handleButtonPress}
      // https://www.sunrisespecialty.com/how-to-use-toilet-paper
      >
        <Text style={styles.buttonText}>click here for more infomation {("\n")} on effecient use of toilet paper</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    witdh: 280,
    Height: 159,
    paddingBottom: 20,
  },

  subtitle: {
    color: "black",
    fontSize: 25,
    marginBottom: 1,
    fontWeight: "bold",

  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 5,

  },

  button: {
    backgroundColor: '#4dbdea',
    padding: 10,
    marginTop: 20,
    width: 420,

  },

  buttonText: {
    fontSize: 20,
    color: "white",
    textAlign: 'center',
  },

  TxtInput: {
    height: 30,
    width: 200,
    marginBottom: 5,
    marginTop: 5,
    fontSize: 15,

  },
  sectionContainer: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  map: {
    marginBottom: 5,
    fontSize: 20,
    marginLeft: 15,

  },


});

