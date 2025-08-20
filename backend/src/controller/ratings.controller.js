import RatingsService from "../services/ratings.service.js";
import ProductService from "../services/product.service.js";
import OtherProductService from "../services/otherProduct.service.js";
import populateUser from "../utils/populateUser.js";

const ratingsService = new RatingsService();
const liquorService = new ProductService();
const groceryService = new OtherProductService()

const getAllRatingsForProduct = async (req, res) => {
	try {
        const product_id = req.params.id;

        let product = await liquorService.findById(product_id);
        if (!product) {
            product = await groceryService.findById(product_id);
        }
        if (!product) {
            return res.status(400).json({ success: false, message: "Invalid product id"});
        }

        const ratings = await ratingsService.findAllByProductId(product_id);
        const populatedRatings = await populateUser(ratings);

        const result = await ratingsService.getAverageRatingValue(product_id);
         
        return res.status(200).json({ 
            success: true, 
            message: result.message ? result.message : `Ratings for ${product_id}: ${product.name} fetched successfully`,
            total_rating_value: result.totalRating,
            number_of_ratings: result.count,
            average_rating_value: result.average,
            data: populatedRatings
        });
    } catch (error) {
        console.error("Get all ratings for product error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllRatingsForProduct };