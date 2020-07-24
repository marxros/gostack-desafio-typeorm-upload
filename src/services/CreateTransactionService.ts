import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

import CreateCategoryService from './CreateCategoryService';
import CategoryRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);
    const createCategory = new CreateCategoryService();
    let category_id;

    if (type === 'outcome') {
      const balance = await transactionRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Saldo Insuficiente', 400);
      }
    }

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    category_id = categoryExists?.id;

    if (!categoryExists) {
      const newCategory = await createCategory.execute({ title: category });

      category_id = newCategory.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
