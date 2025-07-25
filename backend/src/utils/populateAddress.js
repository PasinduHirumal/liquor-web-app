import AddressService from '../services/address.service.js';

const addressService = new AddressService();

const populateAddress = async (data) => {
    const populateOne = async (category) => {
        // Handle both string ID and object with ID
        const addressId = typeof category.delivery_address_id === 'string' 
            ? category.delivery_address_id 
            : category?.delivery_address_id?.id;
            
        if (addressId) {
            try {
                const address = await addressService.findById(addressId);
                if (address) {
                    category.delivery_address_id = {
                        id: address.id,
                        address: `${address.city}, ${address.state}, ${address.state}, ${address.postalCode}, ${address.country}`,
                        latitude: address.latitude,
                        longitude: address.longitude
                    };
                } else {
                    category.delivery_address_id = null;
                }
            } catch (error) {
                console.error('Error fetching delivery address id:', error);
                category.delivery_address_id = null;
            }
        }
        return category;
    };

    if (Array.isArray(data)) {
        return Promise.all(data.map(populateOne));
    } else {
        return populateOne(data);
    }
};

export default populateAddress;
