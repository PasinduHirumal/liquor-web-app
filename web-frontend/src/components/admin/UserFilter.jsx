import React from 'react';
import { Select, Button, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import '../../styles/UserFilter.css';

const { Option } = Select;

const UserFilter = ({ filter, onFilterChange, onClearFilters }) => {
    return (
        <div
            style={{
                background: '#fafafa',
                padding: '16px 24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Space wrap size="large">
                <Select
                    name="isActive"
                    value={filter.isActive !== '' ? filter.isActive : null}

                    onChange={(value) =>
                        onFilterChange({ target: { name: 'isActive', value } })
                    }
                    placeholder="Filter by Active Status"
                    style={{ width: 220 }}
                    allowClear
                    dropdownClassName="highlight-dropdown"
                    status={filter.isActive !== '' ? 'success' : undefined}

                >
                    <Option value="true">🟢 Active</Option>
                    <Option value="false">🔴 Inactive</Option>
                </Select>

                <Select
                    name="isAccountCompleted"
                    value={filter.isAccountCompleted !== '' ? filter.isAccountCompleted : undefined}
                    onChange={(value) =>
                        onFilterChange({ target: { name: 'isAccountCompleted', value } })
                    }
                    placeholder="Filter by Account Completed"
                    style={{ width: 250 }}
                    allowClear
                    dropdownClassName="highlight-dropdown"
                    status={filter.isAccountCompleted ? 'success' : ''}
                >
                    <Option value="true">✅ Completed</Option>
                    <Option value="false">❌ Not Completed</Option>
                </Select>

                {(filter.isActive || filter.isAccountCompleted) && (
                    <Button
                        onClick={onClearFilters}
                        type="primary"
                        danger
                        icon={<CloseCircleOutlined />}
                    >
                        Clear Filters
                    </Button>
                )}
            </Space>
        </div>
    );
};

export default UserFilter;
