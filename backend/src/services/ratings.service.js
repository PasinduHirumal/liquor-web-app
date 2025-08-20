import BaseService from "./BaseService.js";
import Ratings from "../models/Ratings.js";

class RatingsService extends BaseService {
    constructor() {
        super('ratings', Ratings, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    async findAllByProductId(product_id) {
        try {
            const docs = await this.findByFilter('product_id', '==', product_id);

            return docs;
        } catch (error) {
            throw error;
        }
    }

    async getAverageRatingValue(product_id) {
        try {
            const ratings = await this.findAllByProductId(product_id);

            if (!ratings || ratings.length === 0){
                return {
                    average: 0,
                    count: 0,
                    totalRating: 0,
                    message: "No ratings found for this product"
                };
            }
            
            const totalRating = ratings.reduce((sum, rating) => {
                const ratingValue = rating.rating;
                return sum + ratingValue;
            }, 0);

            const average = totalRating / ratings.length;

            return {
                average: parseFloat(average.toFixed(2)), // Round to 2 decimal places
                count: ratings.length,
                totalRating: totalRating
            };
        } catch (error) {
            throw error;
        }
    }
}

export default RatingsService;