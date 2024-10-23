import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Header from './Header';
import Portfolio from './Portfolio';
import AddStock from './AddStock';
import AboutUs from './components/AboutUs';
import ContactUs from './ContactUs';
import LogIn from './LogIn';
import StockCalculator from './StockCalculator';
import UserProfile from './UserProfile';
import Dividend from './Dividend'

const API_KEY = 'YOUR_FINNHUB_API_KEY'; // Finnhub API key 
//const API_KEY = 'xyz'; // Finnhub API key

const dummyData = [
  {
    "Name": "Apple",
    "Symbol": "AAPL",
    "Price": 230,
    "Quantity": 10
  },
  {
    "Name": "Google",
    "Symbol": "GOOG",
    "Price": 182,
    "Quantity": 15
  },
  {
    "Name": "Boeing",
    "Symbol": "BA",
    "Price": 182,
    "Quantity": 20
  },
  {
    "Name": "Microsoft",
    "Symbol": "MSFT",
    "Price": 453,
    "Quantity": 25
  },
  {
    "Name": "Intel",
    "Symbol": "INTC",
    "Price": 34,
    "Quantity": 30
  }
];

function App() {
  const [stocks, setStocks] = useState(dummyData);
  const [sortConfig, setSortConfig] = useState({ key: 'Name', direction: 'ascending' });

  const fetchStockData = async (symbol) => {
    try {
      console.log(`Fetching data for symbol: ${symbol}`);
      const response = await axios.get(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
      console.log(response.data); // Log the response to see the data structure
      if (response.data.c) {
        const latestPrice = response.data.c;
        return {
          close: latestPrice,
          symbol
        };
      } else {
        console.error(`No data found for symbol: ${symbol}`);
        return { close: null, symbol };
      }
    } catch (error) {
      console.error(`Error fetching data for symbol: ${symbol}`, error);
      return { close: null, symbol };
    }
  };

  //const fetchData = async () => {
  //  console.log('Fetching data for all stocks');
  //  const updatedStocks = await Promise.all(
  //    stocks.map(async (stock) => {
  //      const result = await fetchStockData(stock.Symbol);
  //      return {
  //        ...stock,
  //        Price: result.close
  //      };
  //    })
  //  );
  //  console.log('Updated Stocks:', updatedStocks); // Log updated stocks to verify state
  //  setStocks(updatedStocks);
  //};

  const fetchData = async () => {
    console.log('Fetching data for all stocks');
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        const result = await fetchStockData(stock.Symbol);
        return {
          ...stock,
          Price: result.close !== null ? result.close : stock.Price // Use the price from dummyData if API call fails
        };
      })
    );
    console.log('Updated Stocks:', updatedStocks); // Log updated stocks to verify state
    setStocks(updatedStocks);
  };


  useEffect(() => {
    fetchData();

    // Set interval to fetch data periodically (every 5 minutes)
    const interval = setInterval(fetchData, 300000); // 300000 ms = 5 minutes

    return () => clearInterval(interval);
  }, []);

  const handleAddStock = (stock) => {
    setStocks([...stocks, stock]);
  };

  const handleDeleteStock = (index) => {
    const newStocks = stocks.filter((_, i) => i !== index);
    setStocks(newStocks);
  };

  const handleRefresh = () => {
    fetchData();
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/portfolio">Portfolio</Link></li>
            <li><Link to="/about">News</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/login">Log In</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/stockcalculator">P&L</Link></li>
            <li><Link to="/dividend">dividend</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<div>Welcome to the Stock Portfolio App!</div>} />
          <Route path="/portfolio" element={
            <>
              <AddStock handleAdd={handleAddStock} />
              <button className="refresh-button" onClick={handleRefresh}>Refresh Prices</button>
              <Portfolio stocks={sortedStocks} handleDelete={handleDeleteStock} requestSort={requestSort} sortConfig={sortConfig} />
            </>
          } />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/stockcalculator" element={<StockCalculator />} />
          <Route path="/dividend" element={<Dividend />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
