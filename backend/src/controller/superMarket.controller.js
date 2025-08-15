import SuperMarketService from "../services/superMarket.service.js";

const marketService = new SuperMarketService();

const createMarket = async (req, res) => {
	try {
        const { streetAddress, orders_count } = req.body;

        const existingSuperMarket = await marketService.findByStreetAddress(streetAddress);
        if (existingSuperMarket) {
            return res.status(400).json({ success: false, message: "Super Market already exists"});
        }

        if (orders_count !== undefined) {
            req.body.orders_count = 0;
        }
        
        const superMarket = await marketService.create(req.body);
        if (!superMarket) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        
        return res.status(200).json({ success: true, message: "Super market created successfully", data: superMarket });
    } catch (error) {
        console.error("Create super market error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { createMarket};