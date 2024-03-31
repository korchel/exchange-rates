import React, { useState, useEffect, type FC, type ChangeEvent } from 'react';

import { useLazyGetCurrencyRateQuery as getCurrencyRate } from '../store/exchangeRatesApi';
import { type ICheckboxState, type ICurrenciesData } from '../types/types';
import Diagram from './Diagram';

const getDates = (start: string, end: string): string[] => {
  const result: string[] = [];
  for (let d = new Date(start); d <= new Date(end); d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    result.push(`${year}-${month > 9 ? month : `0${month}`}-${day > 9 ? day : `0${day}`}`);
  }
  return result;
};

const Controls: FC = () => {
  const [triggerGetCurrencyRate] = getCurrencyRate();

  const [data, setData] = useState<ICurrenciesData>({ eur: [], usd: [], cny: [] });
  console.log(data);

  const [chosenCurrencies, setChosenCurrencies] = useState<ICheckboxState>({ eur: false, usd: false, cny: false });

  const [fromDate, setFromDate] = useState<string>('');
  const [tillDate, setTillDate] = useState<string>('');

  useEffect(() => {
    const dates = getDates(fromDate, tillDate);
    const getResponses = async (currency: keyof ICheckboxState): Promise<void> => {
      const promises = dates.map(async (date) => await triggerGetCurrencyRate({ date, currency })
        .then((response) => response.data?.[currency].rub));
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
  }, [fromDate, tillDate, chosenCurrencies]);

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>): void => {
    setChosenCurrencies({ ...chosenCurrencies, [event.target.value]: event.target.checked });
  };

  const handleFromDate = (e: ChangeEvent<HTMLInputElement>): void => {
    setFromDate(e.target.value);
  };

  const handleTillDate = (e: ChangeEvent<HTMLInputElement>): void => {
    setTillDate(e.target.value);
  };

  return (
    <div className="container">
      <div>

        <div>
          <div>
            <input
              type="checkbox"
              name="currencies"
              id="eur"
              value="eur"
              onChange={(event) => { handleCheckbox(event); }}
              checked={chosenCurrencies.eur}
            />
            <label htmlFor="eur">Евро</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="currencies"
              id="usd"
              value="usd"
              onChange={(event) => { handleCheckbox(event); }}
              checked={chosenCurrencies.usd}
            />
            <label htmlFor="usd">Доллар</label>
          </div>
          <div>
            <input
              type="checkbox"
              name="currencies"
              id="cny"
              value="cny"
              onChange={(event) => { handleCheckbox(event); }}
              checked={chosenCurrencies.cny}
            />
            <label htmlFor="cny">Юань</label>
          </div>
        </div>
        <div>
          <div>
            <label htmlFor='from'>Дата с</label>
            <input
              type="date"
              id="from"
              onChange={(e) => { handleFromDate(e); }}
            />
          </div>
          <div>
            <label htmlFor='till'>Дата по</label>
            <input
              type="date"
              id="till"
              onChange={(e) => { handleTillDate(e); }}
            />
          </div>
        </div>
      </div>
      <Diagram />
    </div>
  );
};

export default Controls;
