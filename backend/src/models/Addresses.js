
class Addresses {
    constructor (id, data) {
        this.id = id;
        this.userId = data.userId;

        this.city = data.city;
        this.state = data.state;
        this.postalCode = data.postalCode;
        this.country = data.country;
        this.streetAddress = data.streetAddress;
        this.phoneNumber = data.phoneNumber;

        this.latitude = data.latitude;
        this.longitude = data.longitude;
        
        this.fullName = data.fullName;
        this.buildingName = data.buildingName;
        this.landmark = data.landmark;
        this.notes = data.notes;

        this.isDefault = data.isDefault;
        this.isActive = data.isActive;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    };
    
};



export default Addresses;