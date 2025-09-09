
class DriverPayments {
    constructor (id, data) {
        this.payment_id = id;

        this.driver_id = data.driver_id;
        this.current_balance_before = data.current_balance_before;
        this.payment_value = data.payment_value;
        this.current_balance_new = data.current_balance_new;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default DriverPayments;