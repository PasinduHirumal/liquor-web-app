
class DriverDuties {
    constructor (id, data) {
        this.duty_id = id;

        this.driver_id = data.driver_id;
        this.order_id = data.order_id;

        this.is_completed = data.is_completed;
        this.is_driver_accepted = data.is_driver_accepted;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default DriverDuties;