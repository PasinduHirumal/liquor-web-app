class Cart {
    constructor(id, data) {
        this.cart_item_id = id;

        this.product_id = data.product_id;
        this.productName = data.productName;
        this.productImage = data.productImage;
        this.quantity = data.quantity;
        this.unit_price = data.unit_price;

        this.created_at = data.created_at;
        this.updated_at = data.created_at;
    }
};

export default Cart;