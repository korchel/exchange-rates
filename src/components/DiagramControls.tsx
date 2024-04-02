import React, { useState, useEffect, type FC, type ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';

import { useLazyGetCurrencyRateQuery as getCurrencyRate } from '../store/exchangeRatesApi';
import { type ICheckboxState, type ICurrenciesData } from '../types/types';
import Diagram from './Diagram';
import getDates from '../auxiliaryFunctions/getDates';
import stringifyDate from '../auxiliaryFunctions/stringifyDate';
import { getCounter } from '../store/requestCounterSlice';

const today = stringifyDate(new Date());

const Controls: FC = () => {
  const [triggerGetCurrencyRate] = getCurrencyRate();

  const counter = useSelector(getCounter);

  const [data, setData] = useState<ICurrenciesData>({ eur: [], usd: [], cny: [] });
  const [dates, setDates] = useState<string[]>([]);

  const [chosenCurrencies, setChosenCurrencies] = useState<ICheckboxState>({ eur: false, usd: false, cny: false });

  const [fromDate, setFromDate] = useState<string>('');
  const [tillDate, setTillDate] = useState<string>('');

  useEffect(() => {
    const dates: string[] = getDates(fromDate, tillDate);
    const getResponses = async (currency: keyof ICheckboxState): Promise<void> => {
      const promises = dates.map(async (date: string) => await triggerGetCurrencyRate({ date, currency })
        .then((response) => response.data[currency].rub)
        .catch(() => null));
      const responses = await Promise.all(promises);
      setData((data) => ({ ...data, [currency]: responses }));
    };
    for (const currency in chosenCurrencies) {
      if (chosenCurrencies[currency as keyof ICheckboxState]) {
        getResponses(currency as keyof ICheckboxState);
      } else {
        setData((data) => ({ ...data, [currency]: [] }));
      }
    }
    setDates(dates);
  }, [fromDate, tillDate, chosenCurrencies]);

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>): void => {
    setChosenCurrencies({ ...chosenCurrencies, [event.target.value]: event.target.checked });
  };

  const handleFromDate = (e): void => {
    setFromDate(e.target.value);
  };

  const handleTillDate = (e): void => {
    setTillDate(e.target.value);
  };

  return (
    <div className="container">
      <div className='controls'>
        <div>
          {
            Object.keys(data).map((currency) => (
              <div key={currency}>
                <input
                  type="checkbox"
                  name="currencies"
                  id={currency}
                  value={currency}
                  onChange={(event) => { handleCheckbox(event); }}
                  checked={chosenCurrencies[currency as keyof ICheckboxState]}
                />
                <label htmlFor={currency}>{currency.toUpperCase()}</label>
              </div>
            ))
          }
        </div>
        <div>
          <div className='date-input-group'>
            <label htmlFor='from'>Дата с</label>
            <Form.Control
              type="date"
              id="from"
              onChange={(e) => { handleFromDate(e); }}
              min="2024-03-01"
              max={today}
            />
          </div>
          <div className='date-input-group'>
            <label htmlFor='till'>Дата по</label>
            <input
              type="date"
              id="till"
              onChange={(e) => { handleTillDate(e); }}
              min={fromDate}
              max={today}
            />
          </div>
        </div>
      </div>
      <Diagram data={data} dates={dates} />
      <p>{counter}</p>
    </div>
  );
};

export default Controls;
