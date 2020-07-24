import { Router, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from '../services/CreateCategoryService';

const categoriesRouter = Router();

categoriesRouter.get('/', async (request: Request, response: Response) => {
  const categoriesRepository = getCustomRepository(CategoriesRepository);

  const categories = await categoriesRepository.find();

  return response.json(categories);
});

categoriesRouter.post('/', async (request: Request, response: Response) => {
  const title = request.body;

  const createCategory = new CreateCategoryService();

  const category = await createCategory.execute(title);

  return response.json(category);
});

export default categoriesRouter;
