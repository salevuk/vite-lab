import React from 'react';
import {Select} from "antd";
import PropTypes from "prop-types";

const AntSelect = ({id, mode, placeholder, maxCount, value, status, size, disabled, onClear, allowClear, isLoading, options, style, forwardRef, onSelectChange}) => {
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const onChange = (selectedValue) => {
        onSelectChange(selectedValue);
    };
    return (
        <Select
            id={id}
            mode={mode}
            showSearch
            placeholder={placeholder}
            optionFilterProp="children"
            onChange={onChange}
            maxCount={maxCount}
            value={value}
            status={status}
            size={size}
            disabled={disabled}
            onClear={onClear}
            allowClear={allowClear}
            loading={isLoading}
            filterOption={filterOption}
            options={options}
            style={style}
            ref={forwardRef}
        />
    );
};

AntSelect.propTypes = {
    id: PropTypes.string,
    mode: PropTypes.string,
    placeholder: PropTypes.string,
    maxCount: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    status: PropTypes.oneOf(['success', 'warning', 'error', 'default']),
    size: PropTypes.oneOf(['large', 'middle', 'small']),
    disabled: PropTypes.bool,
    onClear: PropTypes.func,
    allowClear: PropTypes.bool,
    isLoading: PropTypes.bool,
    options: PropTypes.array,
    style: PropTypes.object,
    forwardRef: PropTypes.object,
    onSelectChange: PropTypes.func,
}

export default AntSelect;