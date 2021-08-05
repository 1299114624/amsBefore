const lines = [
  { from: 'DAS', to: 'AGG', x1: 20, y1: 50, x2: 235, y2: 50, dir: 'h', dash: true, color: '#2d83ec' },
  { from: 'AGG', to: 'DDR', x1: 250, y1: 50, x2: 465, y2: 50, dir: 'h', dash: true },
  { from: 'DDR', to: 'DTRCE', x1: 480, y1: 50, x2: 700, y2: 50, dir: 'h', dash: true },
  { from: 'DTRCE', to: 'DP', x1: 710, y1: 50, x2: 1045, y2: 50, dir: 'h', dash: true },
  { from: 'DDR', to: 'DP', x1: 500, y1: 100, x2: 1045, y2: 115, dir: 'v-h', dash: true },

  { from: 'TRADEAPI1', to: 'UGW', x1: 190, y1: 180, x2: 235, y2: 245, dir: 'h', dash: true, showStart: true },
  { from: 'TRADEAPI2', to: 'UGW', x1: 190, y1: 310, x2: 235, y2: 245, dir: 'h', dash: true, showStart: true },

  { from: 'UGW', to: 'PTRCE', x1: 420, y1: 180, x2: 465, y2: 180, dir: 'h', dash: true, showStart: true },
  { from: 'PTRCE', to: 'DP', x1: 480, y1: 180, x2: 1045, y2: 180, dir: 'h', dash: true },
  { from: 'UGW', to: 'DP', x1: 420, y1: 245, x2: 1045, y2: 245, dir: 'h', dash: true },
  { from: 'UGW', to: 'PA', x1: 420, y1: 310, x2: 465, y2: 310, dir: 'h', dash: true, showStart: true },
  { from: 'PA', to: 'TRADECOUNTER', x1: 650, y1: 310, x2: 700, y2: 310, dir: 'h', dash: true, showStart: true },
]

export { lines }