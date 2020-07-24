import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async getCategories(): Promise<Category[] | null> {
    const categories = await this.find();

    return categories || null;
  }
}

export default CategoriesRepository;
