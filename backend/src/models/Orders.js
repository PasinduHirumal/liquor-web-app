
class Orders {
    constructor (id, data) {
        this.order_id = id;

        this.order_number = data.order_number;
        this.order_date = data.order_date;
        this.user_id = data.user_id;
        this.items = data.items;
        
        this.delivery_address_id = data.delivery_address_id;
        this.distance = data.distance;
        this.estimated_delivery = data.estimated_delivery;
        this.delivered_at = data.delivered_at;
        
        this.delivery_fee = data.delivery_fee;
        this.subtotal = data.subtotal;
        this.tax_amount = data.tax_amount;
        this.total_amount = data.total_amount;

        this.payment_method = data.payment_method;
        this.payment_status = data.payment_status;

        this.notes = data.notes;
        this.status = data.status;
        this.assigned_driver_id = data.assigned_driver_id;
        this.is_driver_accepted = data.is_driver_accepted;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default Orders;