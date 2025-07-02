import React from "react";
import { List, Descriptions } from "antd";

const AntList = ({ data, fields, keyField, titleField }) => {
    const renderDescriptions = (item) => (
        <Descriptions bordered size={'small'}>
            {fields.map(({ label, key }) => (
                <Descriptions.Item label={label} key={key}>
                    {item[key]}
                </Descriptions.Item>
            ))}
        </Descriptions>
    );

    const renderListItem = (item) => (
        <List.Item key={item[keyField]}>
            <List.Item.Meta
                title={`${titleField}: ${item[keyField]}`} // Ensure correct title rendering
                description={renderDescriptions(item)}
            />
        </List.Item>
    );

    return (
        <List
            itemLayout="vertical"
            dataSource={data}
            renderItem={renderListItem}
        />
    );
};

export default AntList;