
class Products {
    constructor(id, data) {
        this.product_id = id;

        this.name = data.name;
        this.description = data.description;
        this.category_id = data.category_id;
        this.brand = data.brand;
        this.alcohol_content = data.alcohol_content
        this.volume = data.volume;
        this.country = data.country;
        this.flavour = {
            primary_flavour: data.flavour?.primary_flavour, // e.g., "Sweet", "Dry", "Bitter", "Smoky"
            flavour_notes: data.flavour?.flavour_notes, // Array of strings
            
            // Specific flavour categories
            fruit_flavours: data.flavour?.fruit_flavours, // e.g., ["Apple", "Citrus", "Berry"]
            spice_flavours: data.flavour?.spice_flavours, // e.g., ["Vanilla", "Cinnamon", "Pepper"]
            herbal_flavours: data.flavour?.herbal_flavours, // e.g., ["Mint", "Rosemary", "Thyme"]
            wood_flavours: data.flavour?.wood_flavours, // e.g., ["Oak", "Cedar", "Pine"]
            
            // Intensity and characteristics
            sweetness_level: data.flavour?.sweetness_level, // 1-10 scale or "Low/Medium/High"
            bitterness_level: data.flavour?.bitterness_level,
            smokiness_level: data.flavour?.smokiness_level,
            
            // Finish characteristics
            finish_type: data.flavour?.finish_type, // e.g., "Short", "Medium", "Long"
            finish_notes: data.flavour?.finish_notes, // e.g., ["Warm", "Smooth", "Peppery"]
            
            // Overall tasting profile
            tasting_profile: data.flavour?.tasting_profile, // e.g., "Bold", "Smooth", "Complex", "Light"
        };
        this.main_image = data.main_image;
        this.images = data.images;
        this.price = data.price;

        // Pricing
        this.superMarket_id = data.superMarket_id;
        this.product_from = data.product_from; // keels, food city, where house
        this.cost_price = data.cost_price; // ex: keels price
        this.marked_price = data.marked_price; // product price to be sell
        this.selling_price = data.selling_price; // calculated from backend
        this.discount_percentage = data.discount_percentage; // if you give any discount
        this.discount_amount = data.discount_amount; // calculated from backend
        
        this.add_quantity = data.add_quantity;
        this.withdraw_quantity = data.withdraw_quantity;
        this.stock_quantity = data.stock_quantity;

        this.stockHistory = data.stockHistory;

        this.is_active = data.is_active;
        this.is_in_stock = data.is_in_stock;
        this.is_liquor = data.is_liquor;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }
}

export default Products;