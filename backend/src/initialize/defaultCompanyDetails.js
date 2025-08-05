import CompanyService from '../services/company.service.js';

const companyService = new CompanyService();

const createDefaultCompanyDetails = async () => {
    try {
        const defaultCode = "B-1";
        const main_where_house = await companyService.findByFilter('where_house_code', '==', defaultCode);

        if (!main_where_house) {
            const code = 1;
            const companyData = { 
                where_house_code: `B-${code}`,
                where_house_name: "where_house_0",
                where_house_location: {
                    lat: null,
                    lng: null
                },
                delivery_charge_for_1KM: 0.00,
                service_charge: 0.00,
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

