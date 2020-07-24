import { getCustomRepository, EntityRepository, Repository } from 'typeorm';
import AppError from '../errors/AppError';

import CategoryRepository from '../repositories/CategoriesRepository';
import Category from '../models/Category';

interface Request {
  title: string;
}

@EntityRepository(Category)
class CreateCategoryService extends Repository<Category> {
  public async execute({ title }: Request): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categories = await categoryRepository.findOne({
      where: { title },
    });

    if (categories) {
      throw new AppError('Category already exists', 401);
    }

    const category = categoryRepository.create({ title });

    await categoryRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
