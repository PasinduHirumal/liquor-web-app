import BaseService from "./BaseService.js";
import Categories from "../models/Categories.js";


class CategoryService extends BaseService {
    constructor () {
        super('categories', Categories, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    async clearCategories() {
        try {
            const docsRef = await this.collection.get();

            if (docsRef.empty) {
                return true;
            }

            // Firestore batch delete (max 500 per batch)
            const BATCH_SIZE = 500;
            const docs = docsRef.docs;

            for (let i = 0; i < docs.length; i += BATCH_SIZE) {
                const batch = db.batch();
                const chunk = docs.slice(i, i + BATCH_SIZE);

                chunk.forEach(doc => batch.delete(doc.ref));

                await batch.commit();
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

}

export default CategoryService;