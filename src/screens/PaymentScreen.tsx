import {
  BillingDetails,
  CardField,
  useStripe,
} from '@stripe/stripe-react-native';
import {Alert, Text, TouchableOpacity, View} from 'react-native';
import {API_URL} from '../components/constants';

export default function PaymentScreen() {
  const {confirmPayment} = useStripe();

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currency: 'usd',
      }),
    });
    const {clientSecret} = await response.json();

    return clientSecret;
  };

  const handleConfirmation = async () => {
    const billingDetails: BillingDetails = {
      email: 'dtrung@hugeinc.com',
    };
    const clientSecret = await fetchPaymentIntentClientSecret();
    if (clientSecret) {
      // Confirm the payment with the card details
      const {paymentIntent, error} = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      if (!error) {
        Alert.alert('Received payment', `Billed for ${paymentIntent?.amount}`);
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={cardDetails => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={focusedField => {
          console.log('focusField', focusedField);
        }}
      />
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          backgroundColor: 'green',
          height: 50,
          width: 150,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 15,
        }}
        onPress={handleConfirmation}>
        <Text style={{color: 'white'}}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
}
