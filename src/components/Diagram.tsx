import React, { type FC } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Diagram: FC = () => {
  const oprions: Highcharts.Options = {
    title: {
      text: 'Курс рубля'
    },
    xAxis: {
      title: {
        text: 'Дата',
      },
      categories: ['1', '2', '3', '4', '5', '6', '7', '8']
    },
    yAxis: {
      title: {
        text: 'Рубли',
      },
    },
    series: [{
      type: 'line',
      data: [1, 2, 3, 4, 5, 6, 7, 8]
    }]
  };
  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={oprions}
      />
    </div>
  );
};

export default Diagram;
