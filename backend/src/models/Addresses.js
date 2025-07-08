
class Addresses {
    constructor (id, data) {
        this.id = id;
        this.userId = data.userId;

        this.city = data.city;
        this.state = data.state;
        this.postalCode = data.postalCode;
        this.country = data.country;

        this.latitude = data.latitude;
        this.longitude = data.longitude;

        this.isDefault = data.isDefault;

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    };
    
};



export default Addresses;