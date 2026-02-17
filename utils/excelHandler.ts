
import * as XLSX from 'xlsx';
import { TradeRecord } from '../types';

/**
 * In a real backend environment, this would write to /data/trading_journal.xlsx.
 * In the browser, we generate a blob and trigger a download, or provide a persistence simulation.
 */
export const exportTradesToExcel = (trades: TradeRecord[], filename: string = 'trading_journal.xlsx') => {
  const worksheetData = trades.map(trade => ({
    'Date': trade.date,
    'Symbol': trade.symbol,
    'Market Type': trade.marketType,
    'Order Type': trade.orderType,
    'Trade Type': trade.tradeType,
    'Qty': trade.quantity,
    'Entry Price': trade.entryPrice,
    'Exit Price': trade.exitPrice,
    'Brokerage': trade.brokerage,
    'Buy Value': trade.buyValue.toFixed(2),
    'Sell Value': trade.sellValue.toFixed(2),
    'Gross P&L': trade.grossPnL.toFixed(2),
    'Net P&L': trade.netPnL.toFixed(2),
    'P&L %': trade.pnlPercentage.toFixed(2) + '%',
    'Result': trade.result,
    'Timeframe': trade.timeframe,
    'Strategy': trade.strategy,
    'Remarks': trade.remarks
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Trades');

  // Trigger download
  XLSX.writeFile(workbook, filename);
};
