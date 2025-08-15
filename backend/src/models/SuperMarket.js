
class SuperMarket {
    constructor(id, data) {
        this.id = id,

        this.superMarket_Name = data.superMarket_Name;

        // Location
        this.city = data.name;
        this.state = data.state
        this.postalCode = data.postalCode;
        this.country = data.country;
        this.streetAddress = data.streetAddress;

        // For backend process
        this.isActive = data.isActive;
        this.orders_count = data.orders_count;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export default SuperMarket;