import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { getAggregationDataForChart, getGridSize, getLegendOption } from '@/widget/modules/utils/chartUtil';
import { AGGREGATION_LIST } from '@/constant';

const MixedLinePieChart = props => {
  const { option, dataSet, axis = 'x', seriesOp, defaultOp, createOp } = props;
  const reverseAxis = axis === 'x' ? 'y' : 'x';

  const [componentOption, setComponentOption] = useState({});

  const defaultComponentOption = {
    grid: { top: '3%', right: '3%', bottom: '3%', left: '3%' },
    tooltip: { trigger: 'axis' },
    [axis + 'Axis']: {
      type: 'category',
    },
    [reverseAxis + 'Axis']: {
      type: 'value',
    },
    series: [],
    emphasis: {
      focus: 'series',
      blurScope: 'coordinateSystem',
    },
    ...defaultOp,
  };

  useEffect(() => {
    if (option && dataSet) {
      const newOption = createComponentOption();
      setComponentOption(newOption);
    }
  }, [option, dataSet]);

  /**
   *
   * 위젯옵션과 데이터로
   * 컴포넌트에 맞는 형태로 생성
   */
  const createComponentOption = () => {
    console.log('createComponentOption', option);
    let newOption = {};

    const newSeries = [];
    let aggrData = [];
    option.series.forEach(item => {
      aggrData = getAggregationDataForChart(dataSet, option[axis + 'Field'], item.field, item.aggregation);
      console.log('aggrData : ', aggrData);
      if (item.field) {
        const series = {
          name:
            (item?.fieldLabel ? item.fieldLabel : item.field) +
            (option?.legendAggregation
              ? ` (${AGGREGATION_LIST.find(element => element.value === item.aggregation).label})`
              : ''),
          data: aggrData.map(dataItem => dataItem[item.field]),
          type: item.type ? item.type : 'line',
          color: item.color,
          label: { show: option.label },
          markPoint: option.mark && {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' },
            ],
          },
          ...seriesOp,
        };
        newSeries.push(series);
      }
    });
    if (option.pie.field) {
      const pieAggrData = getAggregationDataForChart(dataSet, option.pie.name, option.pie.field, option.pie.aggregation);

      const series = {
        name: option.pie.name,
        data: pieAggrData.map(item => ({
          value: item[option.pie.field],
          name: item[option.pie.name],
        })),
        type: 'pie',
        color: [...option.pie.color],
        center: option.pie.center,
        radius: option.pie.radius,
        label: {
          show: !!option.pie.label,
          formatter: option.pie.label,
          bleedMargin: 70,
        },
        tooltip: {
          trigger: 'item',
        },
        z: 100,
      };
      newSeries.unshift(series);
    }

    // if (aggrData && option[axis + 'Field']) {
    const op = {
      [axis + 'Axis']: {
        type: 'category',
        data: option[axis + 'Field'] ? aggrData.map(item => item[option[axis + 'Field']]) : '',
      },
      series: newSeries,
      grid: getGridSize(option.legendPosition),
      legend: option.legendPosition && {
        ...getLegendOption(option.legendPosition),
        type: 'scroll',
      },
      ...createOp,
    };

    newOption = { ...defaultComponentOption, ...op };
    // }

    // console.log(newOption);
    return newOption;
  };

  return (
    <ReactECharts
      option={componentOption}
      style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}
      lazyUpdate={true}
      notMerge={true}
    />
  );
};

export default MixedLinePieChart;
