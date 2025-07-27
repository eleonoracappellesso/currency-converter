import React from "react";

function CurrencyInput({
    amount,
    currency,
    currencies,
    onAmountChange,
    onCurrencyChange,
    disabledCurrency,
}) {

    return (
        <div className="group">
            <input 
              type="number"
              value={amount}
              onChange={(e)=> onAmountChange(e.target.value)}
              min="0" 
            />
            <select 
              value={currency}
              onChange={(e)=> onCurrencyChange(e.target.value)}
            >
                {currencies.map((cur) => (
                    <option 
                        key={cur} 
                        value={cur}
                        disabled={cur === disabledCurrency} //se la valuta corrente cur è uguale a quella da disabilitare, l'attributo 'disabled' sarà true, altrimenti false 
                    >
                        {cur}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CurrencyInput;