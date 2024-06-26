import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { type ICurrenciesData } from '../types/types';

interface IDiagramProps {
  data: ICurrenciesData,
  dates: string[],
}
const Diagram: React.FC<IDiagramProps> = ({ data, dates }) => {
  const oprions: Highcharts.Options = {
    title: {
      text: 'Курс рубля'
    },
    xAxis: {
      title: {
        text: 'Дата',
      },
      categories: dates,
    },
    yAxis: {
      title: {
        text: 'Рубли',
      },
    },
    series: [{
      name: 'EUR',
      type: 'line',
      data: data.eur,
    },
    {
      name: 'USD',
      type: 'line',
      data: data.usd,
    },
    {
      name: 'CNY',
      type: 'line',
      data: data.cny,
    }],
    accessibility: {
      enabled: false,
    },
  };
  return (
    <div className="col-12 col-md-8">
      <HighchartsReact
        highcharts={Highcharts}
        options={oprions}
      />
    </div>
  );
};

export default Diagram;
