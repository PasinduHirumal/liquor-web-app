import BaseService from "./BaseService.js";
import CompanyDetails from "../models/CompanyDetails.js";
import { getDistanceMatrix } from "../utils/googleMaps.js";


class CompanyService extends BaseService {
    constructor () {
        super('company_details', CompanyDetails, {
            createdAtField: 'created_at',
            updatedAtField: 'updated_at'
        })
    }

    async findByWarehouseName(warehouse_name) {
        try {
            const docs = await this.findByFilter('where_house_name', '==', warehouse_name);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByWarehouseCode(warehouse_code) {
        try {
            const docs = await this.findByFilter('where_house_code', '==', warehouse_code);
            
            if (docs.length === 0){
                return null;
            }

            return docs[0];
        } catch (error) {
            throw error;
        }
    }

    async findByWarehouseLocation(warehouse_location) {
        try {
            const allWarehouses  = await this.findAll();
            
            const GPS_TOLERANCE = 0.0001; 

            const duplicateWarehouse = allWarehouses.find(warehouse => {
                if (!warehouse.where_house_location) return false;
                
                const latDiff = Math.abs(warehouse.where_house_location.lat - warehouse_location.lat);
                const lngDiff = Math.abs(warehouse.where_house_location.lng - warehouse_location.lng);
                
                return latDiff <= GPS_TOLERANCE && lngDiff <= GPS_TOLERANCE;
            });
            
            return duplicateWarehouse || null;
        } catch (error) {
            throw error;
        }
    }


    // helper methods
    async getNearestWarehouse(address) {
        try {
            const { latitude, longitude } = address;

            const warehouses = await this.findByFilter('isActive', '==', true);

            if (!warehouses || warehouses.length === 0) {
                throw new Error('No active warehouses found');
            }

            const origins = warehouses.map(w => w.where_house_location);  // [{ lat, lng }, ...]
            const destination = `${latitude},${longitude}`;

            const data = await getDistanceMatrix(origins, destination);

            const warehouseDistances = warehouses.map((warehouse, index) => {
                const element = data.rows[index].elements[0];

                if (element.status !== 'OK') {
                    return { warehouse, distanceMeters: Infinity, distanceText: 'N/A', durationText: 'N/A' };
                }

                return {
                    warehouse,
                    distanceMeters: element.distance.value,
                    distanceText: element.distance.text,
                    durationText: element.duration.text,
                };
            });

            warehouseDistances.sort((a, b) => a.distanceMeters - b.distanceMeters);

            const nearest = warehouseDistances[0];

            return {
                warehouse: nearest.warehouse,
                distanceText: nearest.distanceText,
                durationText: nearest.durationText,
                distanceMeters: nearest.distanceMeters,
            };

        } catch (error) {
            throw error;
        }
    }
}

export default CompanyService;