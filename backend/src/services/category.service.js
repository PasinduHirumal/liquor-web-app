import BaseService from "./BaseService.js";
import Categories from "../models/Categories.js";


class CategoryService extends BaseService {
    constructor () {
        super('categories', Categories, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

}

export default CategoryService;