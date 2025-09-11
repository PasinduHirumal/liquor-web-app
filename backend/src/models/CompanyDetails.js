
class CompanyDetails {
    constructor(id, data) {
        this.id = id;

        this.where_house_code = data.where_house_code; // handle in backend
        this.where_house_name = data.where_house_name;
        this.where_house_location = data.where_house_location;
        this.address = data.address;
        this.delivery_charge_for_1KM = data.delivery_charge_for_1KM;
        this.service_charge = data.service_charge;
        this.tax_charge = data.tax_charge;

        this.isLiquorActive = data.isLiquorActive;
        this.isActive = data.isActive;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default CompanyDetails;