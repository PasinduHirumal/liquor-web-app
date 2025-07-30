
class CompanyDetails {
    constructor(id, data) {
        this.id = id;

        this.where_house_location = data.where_house_location;
        this.delivery_charge_for_1KM = data.delivery_charge_for_1KM;
        this.service_charge = data.service_charge;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default CompanyDetails;