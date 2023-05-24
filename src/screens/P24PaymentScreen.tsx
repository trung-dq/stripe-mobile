import type {BillingDetails} from '@stripe/stripe-react-native';
import React, {useState} from 'react';
import {Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useConfirmPayment} from '@stripe/stripe-react-native';
import {API_URL} from '../components/constants';
import Button from '../components/Button';
import styles from '../styles';

export default function P24PaymentScreen() {
  const [email, setEmail] = useState('');
  const {confirmPayment, loading} = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        currency: 'pln',
        items: ['id-1'],
        payment_method_types: ['p24'],
      }),
    });
    const {clientSecret, error} = await response.json();

    return {clientSecret, error};
  };

  const handlePayPress = async () => {
    const {clientSecret, error: clientSecretError} =
      await fetchPaymentIntentClientSecret();

    if (clientSecretError) {
      Alert.alert('Error', clientSecretError);
      return;
    }

    const billingDetails: BillingDetails = {
      email,
    };

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      paymentMethodType: 'P24',
      paymentMethodData: {billingDetails},
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`,
      );
    }
  };

  return (
    <View style={styles.layout}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={value => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.payment}
        onPress={handlePayPress}>
        <Text style={{color: 'white'}}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}
