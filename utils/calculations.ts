
import { TradeRecord, OrderType } from '../types';

export const calculateTradeMetrics = (data: Partial<TradeRecord>): TradeRecord => {
  const qty = Number(data.quantity || 0);
  const entry = Number(data.entryPrice || 0);
  const exit = Number(data.exitPrice || 0);
  const brokerage = Number(data.brokerage || 0);
  const isBuy = data.orderType === OrderType.BUY;

  const buyValue = isBuy ? (qty * entry) : (qty * exit);
  const sellValue = isBuy ? (qty * exit) : (qty * entry);
  
  // Gross P&L logic
  // If Buy: (Exit - Entry) * Qty
  // If Sell: (Entry - Exit) * Qty
  const grossPnL = isBuy ? (exit - entry) * qty : (entry - exit) * qty;
  const netPnL = grossPnL - brokerage;
  
  // P&L Percentage based on total capital deployed (buy value)
  const pnlPercentage = buyValue !== 0 ? (netPnL / buyValue) * 100 : 0;
  
  let result: 'PROFIT' | 'LOSS' | 'BREAKEVEN' = 'BREAKEVEN';
  if (netPnL > 0) result = 'PROFIT';
  else if (netPnL < 0) result = 'LOSS';

  return {
    ...data,
    buyValue,
    sellValue,
    grossPnL,
    netPnL,
    pnlPercentage,
    result
  } as TradeRecord;
};

export const getJournalStats = (trades: TradeRecord[]) => {
  const totalTrades = trades.length;
  const winners = trades.filter(t => t.result === 'PROFIT');
  const losers = trades.filter(t => t.result === 'LOSS');
  
  const totalProfit = winners.reduce((sum, t) => sum + t.netPnL, 0);
  const totalLoss = Math.abs(losers.reduce((sum, t) => sum + t.netPnL, 0));
  const netPnL = trades.reduce((sum, t) => sum + t.netPnL, 0);
  
  return {
    totalTrades,
    winningTrades: winners.length,
    losingTrades: losers.length,
    winRatio: totalTrades > 0 ? (winners.length / totalTrades) * 100 : 0,
    totalProfit,
    totalLoss,
    netPnL,
    avgProfit: winners.length > 0 ? totalProfit / winners.length : 0,
    avgLoss: losers.length > 0 ? totalLoss / losers.length : 0,
  };
};
