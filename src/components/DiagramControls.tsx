import React, { useState, useEffect, type FC, type ChangeEvent } from 'react';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import { subDays, format } from 'date-fns';

import { useLazyGetCurrencyRateQuery as getCurrencyRate } from '../store/exchangeRatesApi';
import { type ICheckboxState, type ICurrenciesData } from '../types/types';
import Diagram from './Diagram';
import getDates from '../auxiliaryFunctions/getDates';
import { getCounter } from '../store/requestCounterSlice';

const today = format(new Date(), 'yyyy-MM-dd');
const weekAgo = format(subDays(today, 7), 'yyyy-MM-dd');

const Controls: FC = () => {
  const [triggerGetCurrencyRate] = getCurrencyRate();

  const counter = useSelector(getCounter);

  const [data, setData] = useState<ICurrenciesData>({ eur: [], usd: [], cny: [] });
  const [dates, setDates] = useState<string[]>([]);

  const [chosenCurrencies, setChosenCurrencies] = useState<ICheckboxState>({ eur: false, usd: false, cny: false });

  const [fromDate, setFromDate] = useState<string>(weekAgo);
  const [tillDate, setTillDate] = useState<string>(today);

  useEffect(() => {
    const dates: string[] = getDates(fromDate, tillDate);
    const getResponses = async (currency: keyof ICheckboxState): Promise<void> => {
      const promises = dates.map(async (date: string) => await triggerGetCurrencyRate({ date, currency }, true)
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
    <div className="vh-100  d-flex flex-column justify-content-center">
      <div className="container border rounded shadow-sm p-3">
        <div className="row">
          <div className='controls col-12 col-md-4 d-flex flex-column justify-content-around'>
            <Form>
              {
                Object.keys(data).map((currency) => (
                  <Form.Group key={currency}>
                    <Form.Check
                      inline
                      type="checkbox"
                      name="currencies"
                      id={currency}
                      value={currency}
                      onChange={(event) => { handleCheckbox(event); }}
                      checked={chosenCurrencies[currency as keyof ICheckboxState]}
                    />
                    <Form.Label htmlFor={currency}>{currency.toUpperCase()}</Form.Label>
                  </Form.Group>
                ))
              }
            </Form>
            <Form>
              <Form.Group className="my-1">
                <Form.Label className="m-0" htmlFor='from'>Дата с</Form.Label>
                <Form.Control
                  type="date"
                  id="from"
                  onChange={(e) => { handleFromDate(e); }}
                  min="2024-03-01"
                  max={today}
                  value={fromDate}
                />
              </Form.Group>
              <Form.Group className="my-1">
                <Form.Label className="m-0" htmlFor='from'>Дата по</Form.Label>
                <Form.Control
                  type="date"
                  id="till"
                  onChange={(e) => { handleTillDate(e); }}
                  min={fromDate}
                  max={today}
                  value={tillDate}
                />
              </Form.Group>
            </Form>
          </div>
          <Diagram data={data} dates={dates} />
        </div>
        <div className="row mt-3 border-top">
          <p className="mb-0">Число запросов в API: {counter}</p>
        </div>
      </div>
    </div>
  );
};

export default Controls;
