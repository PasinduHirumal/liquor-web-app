import APP_INFO from "../data/AppInfo.js";
import AppInfoService from "../services/appInfo.service.js";

const appInfoService = new AppInfoService();


const createDefaultAppInfo = async () => {
    try {
        const AppRegNumber = APP_INFO.REG_NUMBER;
        const isExistingMainInfo = await appInfoService.findByRegNumber(AppRegNumber);

        if (!isExistingMainInfo) {
            const appInfoData = { 
                description: APP_INFO.DESCRIPTION,
                app_version: APP_INFO.APP_VERSION,
                is_liquor_show: APP_INFO.IS_LIQUOR_SHOW,
                commissionRate_drivers: APP_INFO.COMMISSION_RATE_FOR_DRIVERS
            };

            await appInfoService.create(appInfoData);
            console.log("✅ Default App-Info Details created.");
        } else {
            console.log("✅ Default App-Info Details already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating default App-Info Details:", error);
    }
}

const initializeDefaultAppInfo = async () => {
    try {
        await createDefaultAppInfo();
        console.log("✅ Default App-Info Details initialization completed...");
    } catch (error) {
        console.error("❌ Failed to initialize Default App-Info Details:", error.message);
    }
};

export {createDefaultAppInfo, initializeDefaultAppInfo};