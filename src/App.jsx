import { useState, useEffect } from "react";
import axios from "axios";

import CurrencyInput from "./components/CurrencyInput";

const API_BASE_URL = 'https://api.frankfurter.app';

export default function App() {
  // Stati per gestire valori e valute dei due input
  const [amount1, setAmount1] = useState(1);
  const [amount2, setAmount2] = useState(1);
  const [currency1, setCurrency1] = useState('EUR');
  const [currency2, setCurrency2] = useState('USD');
  const [currencies, setCurrencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch delle valute disponibili al primo caricamento
  useEffect(()=>{
    setIsLoading(true);
    axios.get(`${API_BASE_URL}/currencies`)
         .then(res => {
            setCurrencies(Object.keys(res.data));
            setIsLoading(false);
         })
         .catch(err => {
            console.error("Error during currencies fetch:", err);
            setIsLoading(false);
         });
  }, []); // viene eseguito una sola volta

// useEffect per conversione iniziale e per i cambi di valuta
  useEffect(() => {
    if(currency1 === currency2) {
      setAmount2(amount1);
      return;
    }

    setIsLoading(true);
    axios.get(`${API_BASE_URL}/latest?amount=${amount1}&from=${currency1}&to=${currency2}`)
        .then(res => {
          setAmount2(res.data.rates[currency2]);
          setIsLoading(false);
        })
        .catch(err => {
            console.error("Conversion error:", err);
          setIsLoading(false);
          });
  }, [amount1, amount2, currency1, currency2, currencies]);


  // FUNZIONI PER LA GESTIONE DEGLI EVENTI

  // l'utente modifica il primo importo
  function handleAmount1Change(newAmount) {
    setAmount1(newAmount);
  }

  // l'utente modifica la prima valuta
  function handleCurrency1Change(newCurrency) {
    setCurrency1(newCurrency);
  }

  // l'utente modifica il secondo importo
  function handleAmount2Change(newAmount) {
    setAmount2(newAmount);

    // Se l'input è vuoto, non fare la chiamata
      if (newAmount === '' || parseFloat(newAmount) === 0) {
        setAmount1('');
        return;
      }
      // Convertiamo da currency2 a currency1
      setIsLoading(true);
      axios.get(`${API_BASE_URL}/latest?amount=${newAmount}&from=${currency2}&to=${currency1}`)
        .then(response => {
          setAmount1(response.data.rates[currency1]);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Errore nella conversione inversa:", error);
          setIsLoading(false);
        });
    }

    // L'utente modifica la seconda valuta
    function handleCurrency2Change(newCurrency) {
      setCurrency2(newCurrency);
    }

  return (
      <div className="container">
        <h1>Convertitore di Valuta</h1>
        <p>Veloce e basato sui dati più recenti di Frankfurter.app</p>
        {isLoading && <p className="loading">Aggiornamento...</p>}
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
    )
}







