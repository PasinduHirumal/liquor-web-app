import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import '../../../styles/LocationEditForm.css'
import toast from 'react-hot-toast';

function DriverLocationInfo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
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
        setSubmitLoading(true);

        try {
            const lat = parseFloat(formData.currentLocation.lat);
            const lng = parseFloat(formData.currentLocation.lng);

            if (isNaN(lat) || isNaN(lng)) {
                setErrors({ 'currentLocation.lat': 'Invalid coordinates', 'currentLocation.lng': 'Invalid coordinates' });
                setSubmitLoading(false);
                return;
            }

            const deliveryZonesArray = formData.deliveryZones
                .split(',')
                .map(zone => zone.trim())
                .filter(zone => zone.length > 0);

            const preferredTypes = formData.preferredDeliveryTypes.filter(t =>
                deliveryTypes.includes(t)
            );

            const payload = {
                currentLocation: { lat, lng, timestamp: new Date().toISOString() },
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

            if (res?.data?.errors && Array.isArray(res.data.errors)) {
                const fieldErrors = {};
                res.data.errors.forEach(err => {
                    fieldErrors[err.field] = err.message;
                    toast.error(`${err.field}: ${err.message}`);
                });
                setErrors(fieldErrors);
            } else {
                toast.error(res?.data?.message || 'Update failed');
            }
        } finally {
            setSubmitLoading(false);
        }
    };


    if (loading) {
        return <div className="text-center py-5 bg-white">Loading driver data...</div>;
    }

    return (
        <div className="driver-location-delivery-form ">
            <h1 className="section-title">Driver Location & Delivery Information</h1>

            <form onSubmit={handleSubmit} className="driver-form">
                {/* Current Location */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Latitude</label>
                        <input
                            type="number"
                            name="lat"
                            value={formData.currentLocation.lat || ''}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="form-control"
                            placeholder="Enter latitude"
                            required
                        />
                        {errors['currentLocation.lat'] && (
                            <p className="error-text">{errors['currentLocation.lat']}</p>
                        )}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Longitude</label>
                        <input
                            type="number"
                            name="lng"
                            value={formData.currentLocation.lng || ''}
                            onChange={handleLocationChange}
                            step="0.000001"
                            className="form-control"
                            placeholder="Enter longitude"
                            required
                        />
                        {errors['currentLocation.lng'] && (
                            <p className="error-text">{errors['currentLocation.lng']}</p>
                        )}
                    </div>
                </div>

                {/* Delivery Zones */}
                <div className="mb-4">
                    <label className="form-label">Delivery Zones (comma separated)</label>
                    <input
                        type="text"
                        name="deliveryZones"
                        value={formData.deliveryZones}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="e.g. Downtown, Midtown, Uptown"
                    />
                    {errors.deliveryZones && (
                        <p className="error-text">{errors.deliveryZones}</p>
                    )}
                </div>

                {/* Max Delivery Radius */}
                <div className="mb-4">
                    <label className="form-label">Max Delivery Radius (km)</label>
                    <input
                        type="number"
                        name="maxDeliveryRadius"
                        min="1"
                        max="100"
                        value={formData.maxDeliveryRadius}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                    {errors.maxDeliveryRadius && (
                        <p className="error-text">{errors.maxDeliveryRadius}</p>
                    )}
                </div>

                {/* Preferred Delivery Types */}
                <div className="mb-4">
                    <label className="form-label">Preferred Delivery Types</label>
                    <div className="row">
                        {deliveryTypes.map(type => (
                            <div key={type} className="col-md-4 mb-2">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        id={`type-${type}`}
                                        checked={formData.preferredDeliveryTypes.includes(type)}
                                        onChange={() => handleDeliveryTypeToggle(type)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`type-${type}`} className="form-check-label text-capitalize">
                                        {type}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errors.preferredDeliveryTypes && (
                        <p className="error-text">{errors.preferredDeliveryTypes}</p>
                    )}
                </div>

                {/* Working Hours */}
                <div className="mb-4">
                    <label className="form-label">Working Hours</label>
                    <div className="working-hours-wrapper">
                        {Object.entries(formData.workingHours).map(([day, hours]) => (
                            <div key={day} className="working-day row align-items-center mb-3 gx-2">
                                <div className="col-md-2 d-flex align-items-center">
                                    <input
                                        type="checkbox"
                                        checked={hours.isWorking}
                                        onChange={() => handleDayToggle(day)}
                                        className="form-check-input me-2"
                                    />
                                    <label className="form-label mb-0 text-capitalize">{day}</label>
                                </div>

                                {hours.isWorking && (
                                    <div className="col-md-5">
                                        <label className="form-label small">Start</label>
                                        <input
                                            type="time"
                                            value={hours.start || ''}
                                            onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                )}
                                {hours.isWorking && (
                                    <div className="col-md-5">
                                        <label className="form-label small">End</label>
                                        <input
                                            type="time"
                                            value={hours.end || ''}
                                            onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.workingHours && (
                        <p className="error-text">{errors.workingHours}</p>
                    )}
                </div>

                {/* Form Actions */}
                <div className="form-footer mt-4 d-flex justify-content-end gap-2">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitLoading}
                    >
                        {submitLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DriverLocationInfo;