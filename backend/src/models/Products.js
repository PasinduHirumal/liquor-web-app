
class Products {
    constructor(id, data) {
        this.product_id = id;

        this.name = data.name;
        this.description = data.description;
        this.category_id = data.category_id;
        this.brand = data.brand;
        this.alcohol_content = data.alcohol_content
        this.volume = data.volume;
        this.main_image = data.main_image;
        this.images = data.images;
        this.price = data.price;

        // Pricing
        this.product_from = data.product_from; // keels, food city, where house
        this.cost_price = data.cost_price; // ex: keels price
        this.marked_price = data.marked_price; // product price to be sell
        this.selling_price = data.selling_price; // calculated from backend
        this.discount_percentage = data.discount_percentage; // if you give any discount
        this.discount_amount = data.discount_amount; // calculated from backend
        
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

export default Products;