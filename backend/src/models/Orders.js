
class Orders {
    constructor (id, data) {
        this.order_id = id;

        this.order_number = data.order_number;
        this.order_date = data.order_date;
        this.user_id = data.user_id;
        this.items = data.items?.map(item => ({
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            unitCostPrice: item.unitCostPrice,
            unit_price: item.unit_price,
            quantity: item.quantity,
            total_cost_price: item.total_cost_price,
            total_price: item.total_price
        })) || [];
        
        this.delivery_address_id = data.delivery_address_id;
        this.distance = data.distance;
        this.estimated_delivery = data.estimated_delivery;
        this.delivered_at = data.delivered_at;
        
        this.delivery_fee = data.delivery_fee;
        this.subtotal = data.subtotal;
        this.tax_amount = data.tax_amount;
        this.total_cost_price = data.total_cost_price;
        this.total_amount = data.total_amount;

        this.payment_method = data.payment_method;
        this.payment_status = data.payment_status;

        this.notes = data.notes;
        this.status = data.status;
        this.warehouse_id = data.warehouse_id;
        this.superMarket_ids = data.superMarket_ids;
        this.assigned_driver_id = data.assigned_driver_id;
        this.driver_earning_id = data.driver_earning_id;
        this.is_driver_accepted = data.is_driver_accepted;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default Orders;