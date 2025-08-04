
class OtherProducts {
    constructor(id, data) {
        this.product_id = id;

        this.name = data.name;
        this.description = data.description;
        this.category_id = data.category_id;
        this.main_image = data.main_image;
        this.images = data.images;

        this.weight = data.weight;

        // Pricing
        this.product_from = data.product_from;
        this.cost_price = data.cost_price;
        this.marked_price = data.marked_price;
        this.selling_price = data.selling_price; 
        this.discount_percentage = data.discount_percentage;
        this.discount_amount = data.discount_amount;

        this.add_quantity = data.add_quantity;
        this.withdraw_quantity = data.withdraw_quantity;
        this.stock_quantity = data.stock_quantity;

        this.stockHistory = data.stockHistory;
        
        this.is_active = data.is_active;
        this.is_in_stock = data.is_in_stock;
        this.is_liquor = data.is_liquor;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }


}

export default OtherProducts;