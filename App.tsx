import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {StripeProvider} from '@stripe/stripe-react-native';
import RootNavigator from './src/navigator/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <StripeProvider
        publishableKey="pk_test_51N7sfhIQlvjPuhNbFpoHJoN6SYcfKvUYuAoHIRQ3MIOWUZdjdqI3eRbRz6UeQNp1QSX6c4Vpmhbbk5br0kwXwQKj00hmxbivEO"
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <RootNavigator />
      </StripeProvider>
    </SafeAreaProvider>
  );
}

export default App;
