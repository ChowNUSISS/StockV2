import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const API_KEY = 'L5DYOAZVN6RAZQDS';
  const SYMBOLS = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL', 'META'];

  // Function to fetch stock data
  const fetchStockData = async () => {
    try {
      setLoading(true);
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
          history: generateDummyData(), // Dummy data for chart
        };
      });
      const stockData = await Promise.all(stockPromises);
      setStocks(stockData);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch stock data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  // Generate dummy data for chart
  const generateDummyData = () => {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * 300));
  };

  // Render each stock item
  const renderItem = ({ item }) => (
    <View style={styles.stockContainer}>
      <Text style={styles.stockName}>{item.name} ({item.symbol})</Text>
      <Text style={styles.stockPrice}>${item.price.toFixed(2)}</Text>
      <Text
        style={[
          styles.stockChange,
          item.change >= 0 ? styles.positive : styles.negative,
        ]}
      >
        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.percentageChange.toFixed(2)}%)
      </Text>
      <LineChart
        data={{
          labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          datasets: [{ data: item.history }],
        }}
        width={Dimensions.get('window').width - 32} // Full width
        height={200}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        style={styles.chart}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={stocks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

// Styling for the dashboard and charts
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  stockContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 8,
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
  chart: {
    marginVertical: 16,
  },
});

export default App;







  

  
