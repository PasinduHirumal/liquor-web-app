
class DriverEarnings {
    constructor (id, data) {
        this.earning_id = id;

        this.driver_id = data.driver_id;
        this.order_id = data.order_id;
        this.delivery_fee = data.delivery_fee;
        this.commission_rate = data.commission_rate;
        this.earning_amount = data.earning_amount;

        this.is_delivery_completed = data.is_delivery_completed;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default DriverEarnings;