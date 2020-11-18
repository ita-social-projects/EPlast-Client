import StatisticsItemIndicator from './StatisticsItemIndicator';

interface RegionsStatisticsParameters {
    RegionIds: Array<number>;
    Years: Array<number>;
    Indicators: Array<StatisticsItemIndicator>;
}

export default RegionsStatisticsParameters;