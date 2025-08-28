import {Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RazorpayCheckout from 'react-native-razorpay';
import ContainerComponent from '../../../components/commonComponents/Container'

const imgURL =
  'https://m.media-amazon.com/images/I/61L5QgPvgqL._AC_UF1000,1000_QL80_.jpg';
const PaymentScreen = () => {
      const onPressBuy = async() => {
         try {
    // 1. Create Order from backend
    // const response = await fetch("http://YOUR_SERVER_IP:5000/create-order", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ amount: 1250 }) // in INR
    // });
    // const order = await response.json();
    
    //Order Api: Call POST api with body like (username, id, price etc) to create an Order and use order_id in below options object
    // const response = await .....

      let options = {
      description: 'Credits towards consultation',
      image: imgURL,
      currency: 'INR',
      key: 'rzp_test_nfY709knHa5l4u', // Razorpay Key ID (safe to use here)
      amount: 259,
      name: 'Acme Corp',
    //  order_id: 'order_R4NlR7d33M4pt2', // Important
      prefill: {
        email: 'hasan@example.com',
        contact: '9191919191',
        name: 'Hasan',
      },
      theme: { color: '#53a20e' },
    };

  
   RazorpayCheckout.open(options)
      .then(data => {
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        alert(`Error: ${error.code} | ${error.description}`);
      });

  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
  };
  return (
    <ContainerComponent>
        <View style={styles.container}>
      <Image
        source={{
          uri: imgURL,
        }}
        style={{width: 200, height: 100}}
        resizeMode="contain"
      />
      <Text>PRICE: 125000/-</Text>
      <Button title="Buy" color={'darkblue'} onPress={onPressBuy} />
    </View>
    </ContainerComponent>
  )
}

export default PaymentScreen

const styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
})