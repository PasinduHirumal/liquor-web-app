
class Drivers {
    constructor (id, data) {
        this.id = id;

        // Personal Information
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.nic_number = data.nic_number;
        this.license_number = data.license_number;
        this.dateOfBirth = data.dateOfBirth;
        this.profileImage = data.profileImage;
        this.address = data.address;
        this.city = data.city;
        this.emergencyContact = data.emergencyContact;
        this.where_house_id = data.where_house_id;

        // Vehicle Information
        this.vehicleType = data.vehicleType;
        this.vehicleModel = data.vehicleModel;
        this.vehicleNumber = data.vehicleNumber;
        this.vehicleColor = data.vehicleColor;
        this.vehicleYear = data.vehicleYear;
        this.vehicleInsurance = data.vehicleInsurance;
        this.vehicleRegistration = data.vehicleRegistration;

        // Account & Status
        this.role = data.role;
        this.googleId = data.googleId;
        this.isAvailable = data.isAvailable; // available or busy (he is on delivery)
        this.isActive = data.isActive; // active or inactive account
        this.isOnline = data.isOnline; // driver logged in or logout
        this.isDocumentVerified = data.isDocumentVerified;
        this.backgroundCheckStatus = data.backgroundCheckStatus;

        // Location & Delivery
        this.currentLocation = data.currentLocation; 
        this.deliveryZones = data.deliveryZones; // array of zone IDs they can deliver to
        this.workingHours = data.workingHours;
        this.maxDeliveryRadius = data.maxDeliveryRadius;
        this.preferredDeliveryTypes = data.preferredDeliveryTypes;

        // Performance & Ratings
        this.rating = data.rating;
        this.totalRatings = data.totalRatings;
        this.totalDeliveries = data.totalDeliveries;
        this.completedDeliveries = data.completedDeliveries;
        this.cancelledDeliveries = data.cancelledDeliveries;
        this.averageDeliveryTime = data.averageDeliveryTime;
        this.onTimeDeliveryRate = data.onTimeDeliveryRate;
        this.ordersHistory = data.ordersHistory;

        // Financial
        this.bankAccountNumber = data.bankAccountNumber;
        this.bankName = data.bankName;
        this.bankBranch = data.bankBranch;
        this.taxId = data.taxId;
        this.commissionRate = data.commissionRate; 
        this.totalEarnings = data.totalEarnings;
        this.totalWithdraws = data.totalWithdraws;
        this.currentBalance = data.currentBalance;
        this.paymentMethod = data.paymentMethod;

        // Documents
        this.documents = data.documents;
        
        // Verification & Security
        this.verifyOtp = data.verifyOtp;
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt;
        this.isAccountVerified = data.isAccountVerified;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpiredAt = data.resetOtpExpiredAt;
        this.deviceTokens = data.deviceTokens; // for push notifications
        this.lastLoginAt = data.lastLoginAt;

        // Timestamps
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
        this.lastActiveAt = data.lastActiveAt || null;
        this.approvedAt = data.approvedAt || null;
        this.suspendedAt = data.suspendedAt || null;
        this.deactivatedAt = data.deactivatedAt || null;
    };

    
    
};



export default Drivers;