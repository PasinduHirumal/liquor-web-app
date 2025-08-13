
class Banners {
    constructor (id, data) {
        this.banner_id = id;
        
        this.title = data.title;
        this.image = data.image;
        this.description = data.description;

        this.isActive = data.isActive;
        this.isLiquor = data.isLiquor;

        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }
}

export default Banners;