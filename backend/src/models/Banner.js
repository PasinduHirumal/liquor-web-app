
class Banners {
    constructor (id, data) {
        this.banner_id = id;
        
        this.name = data.name;
        this.description = data.description;

        this.isActive = data.isActive;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export default Banners;