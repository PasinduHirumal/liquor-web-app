import APP_INFO from "../data/AppInfo.js";
import AppInfoService from "../services/appInfo.service.js";
import updateLiquorProductsActiveStatus from "../utils/updateActiveToggleForLiquor.js";

const appInfoService = new AppInfoService();

const getAllAppData = async (req, res) => {
	try {
        const apps = await appInfoService.findAll();
        if (!apps) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        // Sort by created_at in ascending order (oldest first)
        const sortedApps = apps.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.updatedAt);
        });
        
        return res.status(200).json({ 
            success: true, 
            message: "App-Info's fetched successfully",
            count: apps.length,
            data: sortedApps
        });
    } catch (error) {
        console.error("Get all app-info error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getMainAppInfo = async (req, res) => {
	try {
        const AppRegNumber = APP_INFO.REG_NUMBER;

        const appData = await appInfoService.findByRegNumber(AppRegNumber);
        if (!appData) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }

        return res.status(200).json({ success: true, message: "App-Info fetched successfully", data: appData});
    } catch (error) {
        console.error("Get main app-info error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateAppInfoById = async (req, res) => {
	try {
        const appInfo_id = req.params.id;
        const { is_liquor_show } = req.body;

        const appInfo = await appInfoService.findById(appInfo_id);
        if (!appInfo) {
            return res.status(404).json({ success: false, message: "App-Info not found"});
        }

        const AppRegNumber = APP_INFO.REG_NUMBER;
        if (appInfo.reg_number !== AppRegNumber) {
            return res.status(500).json({ success: false, message: "Failed to update" });
        }

        const updateData = { ...req.body };

        const updatedAppInfo = await appInfoService.updateById(appInfo_id, updateData);
        if (!updatedAppInfo) {
            return res.status(500).json({ success: false, message: "Failed to update" });
        }

        let result = null;
        if (is_liquor_show !== undefined) {
            const is_active = is_liquor_show;
            result = await updateLiquorProductsActiveStatus(is_active);
        }
        
        return res.status(200).json({ 
            success: true, 
            message: "App-Info updated successfully", 
            app_info_update: updatedAppInfo,
            liquor_update: {
                ...result
            }
        });
    } catch (error) {
        console.error("Update App-Info error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateActiveToggle = async (req, res) => {
	try {
        const AppRegNumber = APP_INFO.REG_NUMBER;
        const { is_liquor_show, is_active } = req.body;

        const app = await appInfoService.findByRegNumber(AppRegNumber);
        if (!app) {
            return res.status(404).json({ success: false, message: "App not found"});
        }

        if (is_liquor_show === undefined && is_active === undefined) {
            return res.status(400).json({ success: false, message: "Either is_liquor_show or is_active must be provided" });
        }

        const updateData = {};
        let toggleValue;
        
        if (is_liquor_show !== undefined) {
            toggleValue = Boolean(is_liquor_show);
            updateData.is_liquor_show = toggleValue;
        }
        
        if (is_active !== undefined) {
            toggleValue = Boolean(is_active);
            updateData.is_liquor_show = toggleValue;
        }

        // update app-info
        const updatedApp = await appInfoService.updateById(app.id, updateData);

        // update all liquors
        const productActiveStatus = toggleValue;
        const result = await updateLiquorProductsActiveStatus(productActiveStatus);

        return res.status(200).json({ 
            success: true, 
            message: "Successfully updated liquor settings",
            data: {
                app_liquor_show: toggleValue,
                products_updated: result.successful_updates
            }
        });
    } catch (error) {
        console.error("Update active toggle error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getAllAppData, getMainAppInfo, updateAppInfoById, updateActiveToggle };