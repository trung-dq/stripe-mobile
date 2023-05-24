import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const goP24Payment = () => {
    // @ts-ignore
    navigation.navigate('P24PaymentScreen');
  };
  const goCardPayment = () => {
    // @ts-ignore
    navigation.navigate('PaymentScreen');
  };
  return (
    <View style={styles.layout}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.btn} onPress={goP24Payment}>
            <Text>P24 Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={goCardPayment}>
            <Text>Card Payment</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
