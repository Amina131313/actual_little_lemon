import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, FlatList, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { ProfileImage } from './ProfileImage';
import * as SQLite from 'expo-sqlite';

let db;
const openDatabase = async () => {
  db = await SQLite.openDatabaseAsync('actual_little_lemon.db');
};

const setupDatabase = async () => {
  if (!db) await openDatabase();
  try {
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);'
    );
    console.log('Table setup successful');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

const insertMenuItems = async (menu) => {
  if (!db) await openDatabase();
  try {
    await db.withTransactionAsync(async (tx) => {
      for (const item of menu) {
        await tx.execAsync(
          'INSERT OR IGNORE INTO menu (id, name, description, price, image, category) VALUES (?, ?, ?, ?, ?);',
          [item.id, item.name, item.description, item.price, item.image, item.category]
        );
      }
    });
    console.log('Menu items inserted');
  } catch (error) {
    console.error('Error inserting menu items:', error);
  }
};


const fetchMenuFromDB = async () => {
  if (!db) await openDatabase();
  try {
    return await db.getAllAsync('SELECT * FROM menu;');
  } catch (error) {
    console.error('Error fetching menu from DB:', error);
    return [];
  }
};

const fetchMenuItems = async () => {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
    );
    const json = await response.json();
    const menu = json.menu || [];

    await insertMenuItems(menu);
    return menu;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
};

const useFetchMenu = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await setupDatabase();
        const localMenu = await fetchMenuFromDB();

        if (localMenu.length > 0) {
          setData(localMenu);
        } else {
          const remoteMenu = await fetchMenuItems();
          setData(remoteMenu);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  return { data, isLoading };
};


export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(null);
  const {data, isLoading} = useFetchMenu();

  const categories = ["Starters", "Mains", "Desserts", "Drinks", "Specials"]; 
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevSelected) => 
      prevSelected.includes(category)
        ? prevSelected.filter((item) => item !== category) 
        : [...prevSelected, category]
    );
  };

  useEffect(() => {
    const loadData = async () => {
        try {
            const storedFirstName = await AsyncStorage.getItem('firstName');
            const storedEmail = await AsyncStorage.getItem('email');
            const storedProfileImage = await AsyncStorage.getItem('profileImage');
            if  (storedFirstName) setFirstName(storedFirstName);
            if  (storedEmail) setEmail(storedEmail);
            if  (storedProfileImage) setProfileImage(storedProfileImage);
        } catch (error) {
            console.error('Error loading data', error);
        }
    };
    loadData();
}, []);

  return (
    <View style={styles.container}>
    <View style={styles.heading_container}>
        <Pressable 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityLabel="Go back"
        >
            <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Image 
            style={styles.logo}
            source={require('../../assets/images/logo.jpg')}
        />
        <Text style={styles.heading}>Little Lemon</Text>
        <ProfileImage 
            profileImage={profileImage}
            firstName={firstName}
            lastName={lastName}
            onPress={() => router.push('/screens/Profile2')} 
            customStyle={{ width: 50, height: 50, borderRadius: 30, right: -10 }} 
        />
      </View>
      <Text style = {styles.order}>Order For Delivery!</Text>
      <ScrollView horizontal style={styles.container2} contentContainerStyle={styles.contentContainer} showsHorizontalScrollIndicator={false}>
    {categories.map((category) => (
    <TouchableOpacity
      key={category}
      style={[styles.categoryItem, selectedCategories.includes(category) && styles.selectedItem]}
      onPress={() => toggleCategory(category)}
    >
      <Text style={[styles.categoryText, selectedCategories.includes(category) && styles.selectedText]}>
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      <View style = {{flex: 1, padding: 24}}>
        {isLoading ? (
          <ActivityIndicator/>
        ) : (
          <FlatList
            data = {data}
            keyExtractor = {({id}, index) => id}
            renderItem = {({item}) => (
             <View style={styles.menuItem}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                <Text style={styles.price}>${item.price}</Text>
              </View>
              {item.image && (
                <Image
                    source={{
                    uri: `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${item.image}`,
                    }}  
          style={styles.menuImage}
        />
      )}
             </View>
            )}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container2: {
    maxHeight: 60, 
    paddingTop: 15,
  },
  contentContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItem: {
    padding: 8,
    marginHorizontal: 5, 
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: 'center',
    height: 35, 
    width: 85,
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    fontSize: 16,
    color: "#333",
    fontWeight: 'bold',
    fontColor: '#495E57'
  },
  selectedText: {
    color: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
},
heading_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginLeft: 10,
},
heading: {
    fontFamily: 'times', 
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 5,
    paddingHorizontal: 10,
    color: '#495E57',
},
logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
},
backButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#495E57',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 0,
  left: -20,
},
menuItem: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderBottomWidth: 0.15,
  borderBottomColor: '#495E57',
  borderTopWidth: 0.25,
  borderTopColor: '#495E57',
  paddingVertical: 20,
},
textContainer: {
  flex: 1,
},
title: {
  fontSize: 20,
  fontWeight: '600',
  color: 'black',
  paddingVertical: 5,
},
description: {
  fontSize: 16,
  color: '#495E57',
  paddingVertical: 5,
},
price: {
  fontSize: 16,
  color: '#495E57',
  paddingVertical: 5,
},
menuImage: {
  width: 120,
  height: 120,
  resizeMode: 'cover',
  padding: 10,
},
order: {
  fontWeight: 'bold',
  fontSize: 20, 
  paddingHorizontal: 20,
  marginTop: 15, 
  marginBottom: 5, 
  fontFamily: 'times',
  borderTopWidth: 1,
  paddingTop: 20,
}
})