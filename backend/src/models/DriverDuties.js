
class DriverDuties {
    constructor (id, data) {
        this.duty_id = id;

        this.driver_id = data.driver_id;
        this.order_id = data.order_id;
        this.warehouse_id = data.warehouse_id;
        this.superMarket_ids = data.superMarket_ids;

        this.is_completed = data.is_completed;
        this.is_driver_accepted = data.is_driver_accepted;
        this.is_re_assigning_driver = data.is_re_assigning_driver;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default DriverDuties;