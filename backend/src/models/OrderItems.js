
class OrderItems {
    constructor(id, data) {
        this.orderItems_id = id;

        this.order_id = data.order_id;
        this.order_number = data.order_number;
        this.user = data.user;
        this.product_id = data.product_id;
        this.product_name = data.product_name;
        this.product_image = data.product_image;
        this.product_quantity = data.product_quantity;
        this.unit_cost_price = data.unit_cost_price;
        this.unit_marked_price = data.unit_marked_price;
        this.unit_discount_value = data.unit_discount_value;
        this.unit_selling_price = data.unit_selling_price;
        this.unit_profit_value = data.unit_profit_value;
        this.isProfit = data.isProfit;

        this.total_price = data.total_price;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export default OrderItems;