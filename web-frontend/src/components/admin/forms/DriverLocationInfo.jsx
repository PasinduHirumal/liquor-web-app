import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import toast from 'react-hot-toast';

function DriverLocationInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        currentLocation: { lat: '', lng: '', timestamp: new Date().toISOString() },
        deliveryZones: '',
        maxDeliveryRadius: 10,
        preferredDeliveryTypes: [],
        workingHours: {
            monday: { start: '', end: '', isWorking: true },
            tuesday: { start: '', end: '', isWorking: true },
            wednesday: { start: '', end: '', isWorking: true },
            thursday: { start: '', end: '', isWorking: true },
            friday: { start: '', end: '', isWorking: true },
            saturday: { start: '', end: '', isWorking: true },
            sunday: { start: '', end: '', isWorking: true }
        }
    });
    const [errors, setErrors] = useState({});

    const deliveryTypes = [
        'food', 'grocery', 'pharmacy', 'electronics',
        'documents', 'other'
    ];

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const driverData = response.data.data;

                setFormData({
                    currentLocation: driverData.currentLocation || {
                        lat: '', lng: '', timestamp: new Date().toISOString()
                    },
                    deliveryZones: (driverData.deliveryZones || []).join(', '),
                    maxDeliveryRadius: driverData.maxDeliveryRadius || 10,
                    preferredDeliveryTypes: (driverData.preferredDeliveryTypes || []).filter(t =>
                        deliveryTypes.includes(t)
                    ),
                    workingHours: driverData.workingHours || formData.workingHours
                });
            } catch (error) {
                toast.error('Failed to fetch driver data');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            currentLocation: {
                ...prev.currentLocation,
                [name]: value,
                timestamp: new Date().toISOString()
            }
        }));
    };

    const handleDeliveryTypeToggle = (type) => {
        setFormData(prev => {
            const updated = prev.preferredDeliveryTypes.includes(type)
                ? prev.preferredDeliveryTypes.filter(t => t !== type)
                : [...prev.preferredDeliveryTypes, type];
            return { ...prev, preferredDeliveryTypes: updated };
        });
    };

    const handleWorkingHoursChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: { ...prev.workingHours[day], [field]: value }
            }
        }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    isWorking: !prev.workingHours[day].isWorking
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            const lat = parseFloat(formData.currentLocation.lat);
            const lng = parseFloat(formData.currentLocation.lng);

            if (isNaN(lat) || isNaN(lng)) {
                return setErrors({ 'currentLocation.lat': 'Invalid coordinates', 'currentLocation.lng': 'Invalid coordinates' });
            }

            const deliveryZonesArray = formData.deliveryZones
                .split(',')
                .map(zone => zone.trim())
                .filter(zone => zone.length > 0);

            const preferredTypes = formData.preferredDeliveryTypes.filter(t => deliveryTypes.includes(t));

            const payload = {
                currentLocation: {
                    lat,
                    lng,
                    timestamp: new Date().toISOString()
                },
                deliveryZones: deliveryZonesArray,
                maxDeliveryRadius: Number(formData.maxDeliveryRadius),
                preferredDeliveryTypes: preferredTypes,
                workingHours: formData.workingHours
            };

            await axiosInstance.patch(`/drivers/update-locationAndDelivery/${id}`, payload);

            toast.success('Driver location info updated');
            navigate(-1);
        } catch (error) {
            const res = error.response;
            if (res?.data?.errors) {
                const parsed = res.data.errors.reduce((acc, curr) => {
                    acc[curr.field] = curr.message;
                    return acc;
                }, {});
                setErrors(parsed);
            } else {
                toast.error(res?.data?.message || 'Update failed');
            }
        }
    };


    if (loading) {
        return <div className="text-center py-8 mt-5">Loading driver data...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Driver Location & Delivery Information</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                        <input
                            type="number"
                            name="lat"
                            value={formData.currentLocation.lat || ''}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter latitude"
                            required
                        />
                        {errors['currentLocation.lat'] && (
                            <p className="mt-1 text-sm text-red-600">{errors['currentLocation.lat']}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                        <input
                            type="number"
                            name="lng"
                            value={formData.currentLocation.lng || ''}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter longitude"
                            required
                        />
                        {errors['currentLocation.lng'] && (
                            <p className="mt-1 text-sm text-red-600">{errors['currentLocation.lng']}</p>
                        )}
                    </div>
                </div>

                {/* Delivery Zones */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Zones (comma separated)</label>
                    <input
                        type="text"
                        name="deliveryZones"
                        value={formData.deliveryZones}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Downtown, Midtown, Uptown"
                    />
                    {errors.deliveryZones && (
                        <p className="mt-1 text-sm text-red-600">{errors.deliveryZones}</p>
                    )}
                </div>

                {/* Max Delivery Radius */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Delivery Radius (km)
                    </label>
                    <input
                        type="number"
                        name="maxDeliveryRadius"
                        min="1"
                        max="100"
                        value={formData.maxDeliveryRadius}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                    {errors.maxDeliveryRadius && (
                        <p className="mt-1 text-sm text-red-600">{errors.maxDeliveryRadius}</p>
                    )}
                </div>

                {/* Preferred Delivery Types */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Delivery Types
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {deliveryTypes.map(type => (
                            <div key={type} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`type-${type}`}
                                    checked={formData.preferredDeliveryTypes.includes(type)}
                                    onChange={() => handleDeliveryTypeToggle(type)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700 capitalize">
                                    {type}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.preferredDeliveryTypes && (
                        <p className="mt-1 text-sm text-red-600">{errors.preferredDeliveryTypes}</p>
                    )}
                </div>

                {/* Working Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours
                    </label>
                    <div className="space-y-3">
                        {Object.entries(formData.workingHours).map(([day, hours]) => (
                            <div key={day} className="flex flex-col md:flex-row md:items-center gap-3 p-2 bg-gray-50 rounded-md">
                                <div className="flex items-center w-24">
                                    <input
                                        type="checkbox"
                                        checked={hours.isWorking}
                                        onChange={() => handleDayToggle(day)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700 capitalize">
                                        {day}
                                    </label>
                                </div>

                                {hours.isWorking && (
                                    <div className="flex-1 grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Start</label>
                                            <input
                                                type="time"
                                                value={hours.start || ''}
                                                onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">End</label>
                                            <input
                                                type="time"
                                                value={hours.end || ''}
                                                onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border rounded-md"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.workingHours && (
                        <p className="mt-1 text-sm text-red-600">{errors.workingHours}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DriverLocationInfo;