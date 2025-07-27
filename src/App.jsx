import { useState, useEffect } from "react";
import axios from "axios";

import CurrencyInput from "./components/CurrencyInput";

const API_BASE_URL = 'https://api.frankfurter.app';

// Funzione helper per formattare i numeri, evita problemi con troppi decimali
function format(number) {
  return number.toFixed(4);
}

export default function App() {
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(0); // Inizializziamo a 0 
  const [currency1, setCurrency1] = useState('EUR');
  const [currency2, setCurrency2] = useState('USD');
  const [currencies, setCurrencies] = useState([]);

  // Carica le valute all'avvio 
  useEffect(() => {
    axios.get(`${API_BASE_URL}/currencies`)
      .then(res => setCurrencies(Object.keys(res.data)))
      .catch(err => console.error("Error fetching currencies:", err));
  }, []);

  // useEffect per la conversione
  useEffect(() => {
    // Non eseguire se i dati non sono pronti
    if (currencies.length === 0 || !amount1 || isNaN(amount1)) {
      return;
    }
    
    // Se le valute sono uguali, basta sincronizzare i valori
    if (currency1 === currency2) {
      setAmount2(amount1);
      return;
    }
    
    // Altrimenti, esegui la conversione
    axios.get(`${API_BASE_URL}/latest?amount=${amount1}&from=${currency1}&to=${currency2}`)
      .then(res => {
        if (res.data.rates && res.data.rates[currency2]) {
          setAmount2(Number(res.data.rates[currency2].toFixed(4)));
        }
      });
  // Questo effetto si attiva quando l'input 1 o le valute cambiano
  }, [amount1, currency1, currency2, currencies]);


  // GESTORI DEGLI EVENTI

  function handleAmount1Change(newAmount) {
    if (newAmount === '') {
      setAmount1('');
      setAmount2('');
    } else {
      setAmount1(Number(newAmount));
    }
  }

  function handleAmount2Change(newAmount) {
    if (newAmount === '') {
      setAmount1('');
      setAmount2('');
    } else {
      // Per convertire all'indietro, aggiorniamo il valore del primo input
      // e lasciamo che l'useEffect faccia la conversione avanti
      axios.get(`${API_BASE_URL}/latest?amount=${newAmount}&from=${currency2}&to=${currency1}`)
      .then(res => {
        if (res.data.rates && res.data.rates[currency1]) {
          setAmount1(Number(res.data.rates[currency1].toFixed(4)));
        }
      });
      setAmount2(Number(newAmount));
    }
  }

  function handleCurrency1Change(newCurrency) {
    // Se la nuova valuta è la stessa della seconda, le scambiamo
    if (newCurrency === currency2) {
      setCurrency2(currency1);
    }
    setCurrency1(newCurrency);
  }

  function handleCurrency2Change(newCurrency) {
    // Se la nuova valuta è la stessa della prima, le scambiamo
    if (newCurrency === currency1) {
      setCurrency1(currency2);
    }
    setCurrency2(newCurrency);
  }

  return (
    <div className="container">
      <h1>Convertitore di Valuta</h1>
      <p>Veloce e basato sui dati più recenti di Frankfurter.app</p>
      
      <div className="converter-body">
        <CurrencyInput
          currencies={currencies}
          amount={amount1}
          currency={currency1}
          onAmountChange={handleAmount1Change}
          onCurrencyChange={handleCurrency1Change}
          disabledCurrency={currency2}
        />
        <div className="equals">=</div>
        <CurrencyInput
          currencies={currencies}
          amount={amount2}
          currency={currency2}
          onAmountChange={handleAmount2Change}
          onCurrencyChange={handleCurrency2Change}
          disabledCurrency={currency1}
        />
      </div>
    </div>
  );
}