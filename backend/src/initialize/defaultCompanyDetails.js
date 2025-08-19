import MAIN_WAREHOUSE_DATA from '../data/MainWarehouse.js';
import CompanyService from '../services/company.service.js';

const companyService = new CompanyService();

const createDefaultCompanyDetails = async () => {
    try {
        const defaultCode = MAIN_WAREHOUSE_DATA.CODE;
        const main_where_house = await companyService.findByFilter('where_house_code', '==', defaultCode);

        if (!main_where_house) {
            const companyData = { 
                where_house_code: MAIN_WAREHOUSE_DATA.CODE,
                where_house_name: MAIN_WAREHOUSE_DATA.NAME,
                where_house_location: MAIN_WAREHOUSE_DATA.LOCATION,
                delivery_charge_for_1KM: MAIN_WAREHOUSE_DATA.DELIVERY_CHARGE_FOR_1KM,
                service_charge: MAIN_WAREHOUSE_DATA.SERVICE_CHARGE,
                isActive: true
            };

            await companyService.create(companyData);
            console.log("✅ Default Company Details created.");
        } else if (main_where_house.length === 1) {
            console.log("✅ Default Company Details already exists.");
        } else {
            console.error("❌ There are more than 1 company details records. Please fix it.");
        }
    } catch (error) {
        console.error("❌ Error creating default Company Details:", error);
    }
}

const initializeDefaultCompanyDetails = async () => {
    try {
        await createDefaultCompanyDetails();
        console.log("✅ Default Company Details initialization completed...");
    } catch (error) {
        console.error("❌ Failed to initialize Default Company Details:", error.message);
    }
};

export {createDefaultCompanyDetails, initializeDefaultCompanyDetails};

