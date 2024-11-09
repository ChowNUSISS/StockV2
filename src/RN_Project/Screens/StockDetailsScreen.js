import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const API_KEY = 'L5DYOAZVN6RAZQDS';

const StockDetailsScreen = ({ route }) => {
  const { stock } = route.params;
  const [loading, setLoading] = useState(true);
  const [historicalData, setHistoricalData] = useState([]);

  const fetchHistoricalData = async (symbol) => {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
  
      // Check if the response has 'Time Series (Daily)'
      if (!response.data || !response.data['Time Series (Daily)']) {
        Alert.alert('Error', 'No historical data available');
        setHistoricalData([]);
        return;
      }
  
      const timeSeries = response.data['Time Series (Daily)'];
  
      // Extract the dates and prices
      const dates = Object.keys(timeSeries).slice(0, 10).reverse();
      const prices = dates.map((date) => parseFloat(timeSeries[date]['4. close']));
  
      setHistoricalData({ dates, prices });
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch historical data');
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchHistoricalData(stock.symbol);
  }, [stock.symbol]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{stock.name} ({stock.symbol})</Text>
      <Text style={styles.price}>Current Price: ${stock.price.toFixed(2)}</Text>
      <Text style={[styles.change, stock.change >= 0 ? styles.positive : styles.negative]}>
        Change: {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.percentageChange.toFixed(2)}%)
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        historicalData.prices && historicalData.prices.length > 0 ? (
          <LineChart
            data={{
              labels: historicalData.dates,
              datasets: [{ data: historicalData.prices }],
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#e26a00',
              backgroundGradientFrom: '#fb8c00',
              backgroundGradientTo: '#ffa726',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={styles.chart}
          />
        ) : (
          <Text>No historical data available</Text>
        )
      )}
    </View>
  );
};

export default StockDetailsScreen; // Only one export default

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    marginBottom: 8,
  },
  change: {
    fontSize: 18,
    marginBottom: 12,
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
});
