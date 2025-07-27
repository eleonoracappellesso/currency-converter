import React from "react";

function CurrencyInput({
    amount,
    currency,
    currencies,
    onAmountChange,
    onCurrencyChange,
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
                    <option key={cur} value={cur}>
                        {cur}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CurrencyInput;