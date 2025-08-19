const SUPER_ADMIN_DATA = {
    EMAIL: process.env.SUPER_ADMIN_EMAIL || "superadmin@test.lk",
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "super123",
    FIRST_NAME: process.env.SUPER_ADMIN_FIRST_NAME || "Super",
    LAST_NAME: process.env.SUPER_ADMIN_LAST_NAME || "Admin",
    PHONE: process.env.SUPER_ADMIN_PHONE || "+94552233555"
};

export default SUPER_ADMIN_DATA;