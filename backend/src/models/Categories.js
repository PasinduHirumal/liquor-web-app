
class Categories {
    constructor(id, data) {
        this.category_id = id;

        this.name = data.name;
        this.description = data.description;

        this.is_active = data.is_active;

        this.created_at = data.created_at || new Date().toISOString();
        this.updated_at = data.updated_at || new Date().toISOString();
    }
}

export default Categories;