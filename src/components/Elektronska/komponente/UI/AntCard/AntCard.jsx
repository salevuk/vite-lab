import React from "react";
import { Button, Card, Descriptions, Space, Tooltip } from "antd";
import {
  DownloadOutlined,
  FolderOpenOutlined,
  SendOutlined,
} from "@ant-design/icons";

const AntCard = ({
  data,
  fields,
  titlePrefix,
  titleField,
  onDetaljiClick,
  onPosaljiClick,
  onPreuzmiClick,
  onPosaljiRezultatClick,
  isPendingPosaljiRezultate,
  disabledPosalji,
  loadingSlanje = false,
  prikaziDugmeDetalji = true,
  titleIcon: TitleIcon,
}) => {
  const renderDescriptions = (item) => (
    <Descriptions bordered size={"small"}>
      {fields.map(({ label, key }) => (
        <Descriptions.Item label={label} key={key}>
          {key === "gender" ? (item[key] === "F" ? "Ž" : "M") : item[key]}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );

  return (
    <Space direction={"vertical"} size={16}>
      {data.map((item) => (
        <Card
          type={"inner"}
          style={{ marginBottom: "10px" }}
          key={item[titleField]}
          title={
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {`${titlePrefix} ${item[titleField]}`}
              {TitleIcon && (
                <Tooltip title={"Uputnica je evidentirana"}>
                  <TitleIcon
                    twoToneColor="#52c41a"
                    style={{ fontSize: "20px" }}
                  />
                </Tooltip>
              )}
            </div>
          }
          extra={
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Button
                type={"primary"}
                onClick={onPreuzmiClick}
                icon={<DownloadOutlined />}
              >
                Promjeni status
              </Button>
              <Button
                type={"primary"}
                onClick={onPosaljiRezultatClick}
                icon={<SendOutlined />}
                loading={loadingSlanje}
              >
                Pošalji rezultate
              </Button>
              <Button
                type={"primary"}
                onClick={onPosaljiClick}
                icon={<SendOutlined />}
                loading={isPendingPosaljiRezultate}
                disabled={disabledPosalji}
              >
                Pošalji
              </Button>
              {prikaziDugmeDetalji ? (
                <Button
                  type={"primary"}
                  ghost={true}
                  onClick={onDetaljiClick}
                  icon={<FolderOpenOutlined />}
                >
                  Vidi detalje
                </Button>
              ) : null}
            </div>
          }
        >
          {renderDescriptions(item)}
        </Card>
      ))}
    </Space>
  );
};

export default AntCard;
