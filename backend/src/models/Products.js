
class Products {
    constructor(id, data) {
        this.product_id = id;

        this.name = data.name;
        this.description = data.description;
        this.category_id = data.category_id;
        this.brand = data.brand;
        this.alcohol_content = data.alcohol_content
        this.volume = data.volume;
        this.images = data.images;
        this.price = data.price;

        this.add_quantity = data.add_quantity;
        this.withdraw_quantity = data.withdraw_quantity;
        this.stock_quantity = data.stock_quantity;

        this.is_active = data.is_active;
        this.is_in_stock = data.is_in_stock;
        this.is_liquor = data.is_liquor;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default Products;