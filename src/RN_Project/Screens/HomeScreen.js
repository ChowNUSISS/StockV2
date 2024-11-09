import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const SYMBOLS = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL', 'META'];
const API_KEY = 'L5DYOAZVN6RAZQDS';

export default function HomeScreen({ navigation }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStockData = async () => {
    try {
      const stockPromises = SYMBOLS.map(async (symbol) => {
        const response = await axios.get(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
        );
        const data = response.data['Global Quote'];
        return {
          id: symbol,
          name: symbol,
          symbol: data['01. symbol'],
          price: parseFloat(data['05. price']),
          change: parseFloat(data['09. change']),
          percentageChange: parseFloat(data['10. change percent']),
        };
      });
      const stockData = await Promise.all(stockPromises);
      setStocks(stockData);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.stockContainer}
      onPress={() => navigation.navigate('Details', { stock: item })}
    >
      <Text style={styles.stockName}>{item.name} ({item.symbol})</Text>
      <Text style={styles.stockPrice}>${item.price.toFixed(2)}</Text>
      <Text style={[styles.stockChange, item.change >= 0 ? styles.positive : styles.negative]}>
        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.percentageChange.toFixed(2)}%)
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stocks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  stockContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    elevation: 3,
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#007AFF',
  },
  stockChange: {
    fontSize: 16,
    marginTop: 8,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
});
