import AppInfoService from "../services/appInfo.service.js";

const appInfoService = new AppInfoService();


const createDefaultAppInfo = async () => {
    try {
        const description = "Main App-Info"
        const isExistingMainInfo = await appInfoService.findByDescription(description);

        if (!isExistingMainInfo) {
            const appInfoData = { 
                description: description,
                app_version: "1.0",
                is_liquor_show: true
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