import React, {useEffect, useState} from 'react';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles';
import {useStripe} from '@stripe/stripe-react-native';
import {API_URL} from '../components/constants';

const CheckoutScreen = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {paymentIntent, ephemeralKey, customer} = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Trung Do',
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <View style={styles.layout}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.payment}
        onPress={openPaymentSheet}>
        <Text style={{color: 'white'}}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutScreen;
