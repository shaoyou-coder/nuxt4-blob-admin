<template>
  <div v-if="!isMobileFlag" class="track-wrap">
    <div class="total-info">
      <div class="pv-wrap">
        <p>网站总访问量</p>
        <p class="number-p">{{ pv }}</p>
      </div>
      <div class="uv-wrap">
        <p>网站总访问人数</p>
        <p class="number-p">{{ uv }}</p>
      </div>
      <div class="at-wrap">
        <p>文章总阅读数</p>
        <p class="number-p">{{ watchs }}</p>
      </div>
      <div class="at-wrap">
        <p>文章总点赞数</p>
        <p class="number-p">{{ likes }}</p>
      </div>
    </div>
    <div class="chart-info">
      <div class="look-wrap">
        <p class="look-title">每日pv、uv、文章阅读数</p>
        <div ref="lookChart" class="look-chart"></div>
      </div>
    </div>
  </div>
  <div v-else class="track-wrap-wap">
    <div class="total-info">
      <div class="pv-wrap">
        <p>网站总访问量</p>
        <p class="number-p">{{ pv }}</p>
      </div>
      <div class="uv-wrap">
        <p>网站总访问人数</p>
        <p class="number-p">{{ uv }}</p>
      </div>
      <div class="at-wrap">
        <p>文章总阅读数</p>
        <p class="number-p">{{ watchs }}</p>
      </div>
      <div class="at-wrap">
        <p>文章总点赞数</p>
        <p class="number-p">{{ likes }}</p>
      </div>
    </div>
    <div class="chart-info">
      <div class="look-wrap">
        <p class="look-title">每日pv、uv、文章阅读数</p>
        <div ref="lookChart" class="look-chart"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import midApi from '@/apis/mid';
import { isMobile, formatDate } from '@/utils/commonUtils';

/** echarts 按需导入 S */
import * as echarts from 'echarts/core';
import {
  PieChart,
  LineChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 内置数据转换器组件 (filter, sort)
  TransformComponent,
  LegendComponent,
  ToolboxComponent
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type {
  // 系列类型的定义后缀都为 SeriesOption
  PieSeriesOption,
  LineSeriesOption
} from 'echarts/charts';
import type {
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption
} from 'echarts/components';
import type {
  ComposeOption,
  EChartsType
} from 'echarts/core';
// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
type ECOption = ComposeOption<
  | PieSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DatasetComponentOption
>;
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  ToolboxComponent,
  PieChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);
/** echarts 按需导入 E */

const isMobileFlag = ref(isMobile());
window.addEventListener('resize', () => {
  isMobileFlag.value = isMobile();
});

const pv = ref(0);
const uv = ref(0);
const watchs = ref(0);
const likes = ref(0);
const lookXData:any = [];
const lookPvData:any = [];
const lookUvData:any = [];
const lookWatchData:any = [];
const lookLikeData:any = [];

const getTrackData = async () => {
  const allCount = await midApi.getAllCount();
  const lookNum = await midApi.getLookNumByDay();

  animateNumber(pv, allCount.pv, 2000);
  animateNumber(uv, allCount.uv, 2000);
  animateNumber(watchs, allCount.watchs, 2000);
  animateNumber(likes, allCount.likes, 2000);

  lookNum.forEach((item: any) => {
    lookXData.push(formatDate(item.day, false));
    lookPvData.push(item.pv);
    lookUvData.push(item.uv);
    lookWatchData.push(item.watchs);
    lookLikeData.push(item.likes);
  });
  lookLineRender(lookXData, lookPvData, lookUvData, lookWatchData, lookLikeData);
};

// 设置数字动效
type RefNumType = {
  value: number
}
/**
 *
 * @param refNum 响应式对象
 * @param targetValue 目标值
 * @param duration 动效时间
 */
const animateNumber = (refNum: RefNumType, targetValue: number, duration: number) => {
  let currentValue = 0; // 设置初始值为0
  const frameDuration = 1000 / 60; // 这里用于计算出每帧花费的时间，1000是毫秒，即一秒钟；60是帧，一般屏幕都是60帧。所以这里计算出每帧的持续时间为16.67秒
  const totalFrames = Math.round(duration / frameDuration); // 这里计算出总共需要花费多少帧，通过上面拿到的帧率，可以计算出执行duration时间的动效总共需要花费多少帧
  const increment = targetValue / totalFrames; // 这里计算出每帧需要累加的数值

  const counter = setInterval(() => {
    currentValue += increment;
    refNum.value = Number(currentValue.toFixed(0));

    if (currentValue >= targetValue) {
      clearInterval(counter);
      refNum.value = targetValue;
    }
  }, frameDuration);
};

// 渲染每日数据折线图
const lookChart = ref(null);
let lookChartInstance: EChartsType | null;
const lookLineRender = (lookXData: any, lookPvData: any, lookUvData: any, lookWatchData: any, lookLikeData: any) => {
  if (lookChartInstance) {
    lookChartInstance.dispose();
  }
  // 基于准备好的dom，初始化echarts实例
  if (!lookChart.value) return;
  lookChartInstance = echarts.init(lookChart.value);

  const option: ECOption = {
    animationDuration: 2000, // 动画时间
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      nameLocation: 'middle',
      data: lookXData,
      axisLabel: {
        color: '#ffffff'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#ffffff'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffff'
      },
      splitLine: {
        lineStyle: {
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: 'pv',
        data: lookPvData,
        type: 'line',
        smooth: true,
        symbol: 'none',
        endLabel: {
          show: true,
          fontSize: 10,
          color: '#ffffff',
          formatter: function (params) {
            return params.seriesName + ': ' + params.value;
          }
        },
      },
      {
        name: 'uv',
        data: lookUvData,
        type: 'line',
        symbol: 'none',
        smooth: true,
        endLabel: {
          show: true,
          fontSize: 10,
          color: '#ffffff',
          formatter: function (params) {
            return params.seriesName + ': ' + params.value;
          }
        }
      },
      {
        name: 'watchs',
        data: lookWatchData,
        type: 'line',
        symbol: 'none',
        smooth: true,
        endLabel: {
          show: true,
          fontSize: 10,
          color: '#ffffff',
          formatter: function (params) {
            return params.seriesName + ': ' + params.value;
          }
        }
      },
      {
        name: 'likes',
        data: lookLikeData,
        type: 'line',
        symbol: 'none',
        smooth: true,
        endLabel: {
          show: true,
          fontSize: 10,
          color: '#ffffff',
          formatter: function (params) {
            return params.seriesName + ': ' + params.value;
          }
        }
      }
    ]
  };
  lookChartInstance.setOption(option);
};

const resizeChart = () => {
  lookLineRender(lookXData, lookPvData, lookUvData, lookWatchData, lookLikeData);
};

const { isCollapse } = storeToRefs(useUserStore());
watch(isCollapse, () => {
  resizeChart();
});

window.addEventListener('resize', resizeChart);

onUnmounted(() => {
  window.removeEventListener('resize', resizeChart, false);
});

onMounted(() => {
  getTrackData();
});
</script>

<style scoped lang="less">
.track-wrap {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/track-bg.jpg');
  padding-bottom: 20px;
}
.total-info {
  padding: 50px 100px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  min-height: 250px;
  div {
    flex-shrink: 0;
    box-shadow: inset 0px 0px 2px 2px #ecf5ff;
  }
  .pv-wrap, .uv-wrap, .at-wrap {
    text-align: center;
    p:nth-child(1) {
      font-size: 25px;
      color: #ecf5ff;
      margin-top: 25px;
    }
    p:nth-child(2) {
      font-size: 25px;
      color: #ecf5ff;
      margin-top: 20px;
    }
  }
  .pv-wrap {
    flex: 1;
  }
  .uv-wrap, .at-wrap {
    flex: 1;
    margin-left: 30px;
  }
  .number-p {
    animation: countUp 1s ease-in-out;
  }
  @keyframes countUp {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
.chart-info {
  padding: 0px 100px;
  display: flex;
  justify-content: space-between;
  height: 500px;
  .look-wrap {
    flex: 1;
    box-shadow: inset 0px 0px 2px 2px #ecf5ff;
    text-align: center;
    .look-title {
      width: 100%;
      height: 50px;
      font-size: 25px;
      line-height: 50px;
      color: #ecf5ff;
      box-shadow: 0px 2px 2px 0px #ecf5ff;
    }
    .look-chart {
      width: 100%;
      height: 420px;
      margin: 20px auto;
    }
  }
}

.track-wrap-wap {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/track-bg.jpg');
  overflow: auto;
  .total-info {
    height: auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .pv-wrap, .uv-wrap, .at-wrap {
      width: 90%;
      margin: 10px 0 0 0;
      p:nth-child(1) {
        font-size: 15px;
        color: #ecf5ff;
        margin-top: 10px;
      }
      p:nth-child(2) {
        font-size: 15px;
        color: #ecf5ff;
        margin-top: 5px;
        margin-bottom: 10px;
      }
    }
  }
  .chart-info {
    padding: 0;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    .type-wrap {
      width: 90%;
      box-shadow: inset 0px 0px 2px 2px #ecf5ff;
      text-align: center;
      margin-top: 10px;
      .type-title {
        width: 100%;
        height: 30px;
        font-size: 15px;
        line-height: 30px;
        color: #ecf5ff;
        box-shadow: 0px 2px 2px 0px #ecf5ff;
      }
      .type-chart {
        width: 100%;
        height: 300px;
      }
    }
    .look-wrap {
      margin: 10px 0 0 0;
      width: 90%;
      box-shadow: inset 0px 0px 2px 2px #ecf5ff;
      text-align: center;
      .look-title {
        width: 100%;
        height: 30px;
        font-size: 15px;
        line-height: 30px;
        color: #ecf5ff;
        box-shadow: 0px 2px 2px 0px #ecf5ff;
      }
      .look-chart {
        width: 100%;
        height: 300px;
      }
    }
  }
}
</style>