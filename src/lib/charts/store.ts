import { getActiveChart } from '../birth/storage';

export const ChartsStore = {
  getPinned: () => {
    return getActiveChart();
  }
};