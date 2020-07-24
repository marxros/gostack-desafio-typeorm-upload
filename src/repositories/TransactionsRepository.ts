import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const outcomes = await this.find({
      where: { type: 'outcome' },
    });

    const incomes = await this.find({
      where: { type: 'income' },
    });

    const balanceOutcomes: number = outcomes.reduce((total, transaction) => {
      return Number(total) + Number(transaction.value);
    }, 0);

    const balanceIncomes: number = incomes.reduce((total, transaction) => {
      return Number(total) + Number(transaction.value);
    }, 0);

    return {
      income: balanceIncomes,
      outcome: balanceOutcomes,
      total: balanceIncomes - balanceOutcomes,
    };
  }
}

export default TransactionsRepository;
