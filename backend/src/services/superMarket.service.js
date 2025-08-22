import BaseService from "./BaseService.js";
import SuperMarket from "../models/SuperMarket.js";


class SuperMarketService extends BaseService {
    constructor() {
        super('super_markets', SuperMarket, {
            createdAtField: 'createdAt',
            updatedAtField: 'updatedAt',
            idField: 'id',
            searchableFields: [
                'superMarket_Name', 
                'city', 
                'state', 
                'country', 
                'streetAddress'
            ]
        });
    }

    async findByStreetAddress(address) {
        try {
            const docs = await this.findByFilter('streetAddress', '==', address);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByLocation(location) {
        try {
            const addDocs  = await this.findAll();
            
            const GPS_TOLERANCE = 0.0001; 

            const duplicateLocation = addDocs.find(place => {
                if (!place.location) return false;
                
                const latDiff = Math.abs(place.location.lat - location.lat);
                const lngDiff = Math.abs(place.location.lng - location.lng);
                
                return latDiff <= GPS_TOLERANCE && lngDiff <= GPS_TOLERANCE;
            });
            
            return duplicateLocation || null;
        } catch (error) {
            throw error;
        }
    }

    // GENERATE SEARCH TOKENS - override method
    generateSearchTokens(marketData) {
        const tokens = new Set();
        
        // Define searchable fields
        const searchableFields = [
            marketData.superMarket_Name,
            marketData.city,
            marketData.state,
            marketData.country,
            marketData.streetAddress // Added street address for more comprehensive search
        ];

        searchableFields.forEach(field => {
            if (field && typeof field === 'string') {
                this.addStringTokens(tokens, field);
            }
        });

        return Array.from(tokens);
    }

    
}

export default SuperMarketService;