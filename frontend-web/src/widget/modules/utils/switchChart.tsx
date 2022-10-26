import React, { FC } from 'react';
import { WIDGET_TYPE } from '@/constant';
import LineChart from '@/widget/modules/linechart/LineChart';
import PieChart from '@/widget/modules/piechart/PieChart';
import ScatterChart from '@/widget/modules/scatterchart/ScatterChart';
import NumericBoard from '@/widget/modules/board/NumericBoard';
import TableBoard from '@/widget/modules/board/TableBoard';
import BubbleChart from '@/widget/modules/scatterchart/BubbleChart';
import RadarChart from '@/widget/modules/radarchart/RadarChart';
import HeatmapChart from '@/widget/modules/heatmapchart/HeatmapChart';
import TreemapChart from '@/widget/modules/treemapchart/TreemapChart';
import GaugeChart from '@/widget/modules/gaugechart/GaugeChart';
import CandlestickChart from '@/widget/modules/candlestickchart/CandlestickChart';

// 리팩터링 중...
// option을 동적으로 받아올 수 없는 문제 해결 필요
interface ChartProps {
  widgetType?: string;
  option?: any;
  dataSet?: any[];
}

export const ChartComponent: FC<ChartProps> = ({ widgetType, option, dataSet }) => {
  const rest = { option, dataSet };

  const {
    area,
    bar,
    column,
    stackedArea,
    stackedBar,
    stackedLine,
    stackedColumn,
    mixedLineBar,
    donut,
    nightingale,
    funnel,
    sunburst,
  } = {
    area: {
      seriesOp: { areaStyle: {} },
    },
    bar: {
      seriesOp: { type: 'bar' },
      defaultOp: {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        yAxis: { boundaryGap: [0, 0.01] },
        emphasis: { focus: 'none' },
      },
    },
    column: {
      axis: 'y',
      seriesOp: { type: 'bar' },
      defaultOp: {
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: { boundaryGap: [0, 0.01] },
        emphasis: { focus: 'none' },
      },
    },
    stackedLine: {
      seriesOp: {
        stack: 'total',
        label: { show: true, position: 'top' },
      },
    },
    stackedArea: {
      seriesOp: {
        areaStyle: {},
        stack: 'total',
        label: { show: true, position: 'top' },
      },
    },
    stackedBar: {
      seriesOp: {
        type: 'bar',
        stack: 'total',
        label: { show: true },
      },
    },
    stackedColumn: {
      axis: 'y',
      seriesOp: { type: 'bar', stack: 'total', label: { show: true } },
      defaultOp: {
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      },
    },
    mixedLineBar: {
      defaultOp: {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        yAxis: { boundaryGap: [0, 0.01] },
        emphasis: { focus: 'none' },
      },
      seriesOp: { smooth: false },
    },
    donut: {
      seriesOp: {
        radius: !option ? '' : option.series.radius,
      },
    },
    nightingale: {
      seriesOp: {
        radius: !option ? '' : option.series.radius,
        roseType: 'area',
        itemStyle: { borderRadius: 8 },
      },
    },
    funnel: {
      seriesOp: {
        type: 'funnel',
        width: '70%',
        gap: 4,
        label: {
          show: !option ? '' : option.series.name && true,
          position: 'inside',
        },
      },
    },
    sunburst: {
      seriesOp: { type: 'sunburst', label: { rotate: 'radial' } },
    },
  };

  const ChartLookUpTable = {
    [WIDGET_TYPE.BOARD_NUMERIC.type]: NumericBoard,
    [WIDGET_TYPE.BOARD_TABLE.type]: TableBoard,
    [WIDGET_TYPE.CHART_LINE.type]: LineChart,
    [WIDGET_TYPE.CHART_AREA.type]: () => LineChart({ area, ...rest }),
    [WIDGET_TYPE.CHART_BAR.type]: () => LineChart({ bar, ...rest }),
    [WIDGET_TYPE.CHART_COLUMN.type]: () => LineChart({ column, ...rest }),
    [WIDGET_TYPE.CHART_STACKED_LINE.type]: () => LineChart({ stackedLine, ...rest }),
    [WIDGET_TYPE.CHART_STACKED_AREA.type]: () => LineChart({ stackedArea, ...rest }),
    [WIDGET_TYPE.CHART_STACKED_BAR.type]: () => LineChart({ stackedBar, ...rest }),
    [WIDGET_TYPE.CHART_STACKED_COLUMN.type]: () => LineChart({ stackedColumn, ...rest }),
    [WIDGET_TYPE.MIXED_CHART_LINE_BAR.type]: () => LineChart({ mixedLineBar, ...rest }),
    [WIDGET_TYPE.CHART_PIE.type]: PieChart,
    [WIDGET_TYPE.CHART_DONUT.type]: () => PieChart({ donut, ...rest }),
    [WIDGET_TYPE.CHART_NIGHTINGALE.type]: () => PieChart({ nightingale, ...rest }),
    [WIDGET_TYPE.CHART_FUNNEL.type]: () => PieChart({ funnel, ...rest }),
    [WIDGET_TYPE.CHART_SCATTER.type]: ScatterChart,
    [WIDGET_TYPE.CHART_BUBBLE.type]: BubbleChart,
    [WIDGET_TYPE.CHART_RADAR.type]: RadarChart,
    [WIDGET_TYPE.CHART_TREEMAP.type]: TreemapChart,
    [WIDGET_TYPE.CHART_SUNBURST.type]: () => TreemapChart({ sunburst, ...rest }),
    [WIDGET_TYPE.CHART_HEATMAP.type]: HeatmapChart,
    [WIDGET_TYPE.CHART_GAUGE.type]: GaugeChart,
    [WIDGET_TYPE.CHART_CANDLESTICK.type]: CandlestickChart,
  };

  console.log(option);
  // console.log(widgetType, ChartLookUpTable[WIDGET_TYPE[widgetType]]);
  // console.log(option, dataSet);
  return React.createElement(ChartLookUpTable[widgetType], { ...rest });
};
