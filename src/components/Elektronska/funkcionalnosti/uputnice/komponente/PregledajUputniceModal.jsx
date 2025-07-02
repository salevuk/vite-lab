import React, {Fragment, useEffect, useState} from "react";
import AntModal from "../../../komponente/UI/AntModal/AntModal.jsx";
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import classes from "../stilovi/PregledajUputniceModal.module.scss";
import { rezultatKolone } from "../alati/koloneZaTabelu.jsx";
import AntTable from "../../../komponente/UI/AntTable/AntTable.jsx";
import { Radio } from "antd";

const PregledajUputniceModal = ({ closeModal, openModal, pacijent, listaUputnica, onSubmit, selektovanaUputnicaId }) => {
    const [selectedTable, setSelectedTable] = useState(selektovanaUputnicaId);
    const [selektovanaUputnica, setSelektovanaUputnica] = useState([]);
    const [detaljiUputnice, setDetaljiUputnice] = useState([]);

    useEffect(()=>{
        setSelectedTable(selektovanaUputnicaId);
    },[selektovanaUputnicaId])

    const handleRadioChange = (e, order_id, uputnica) => {
        setSelektovanaUputnica(uputnica.analysis)
        setSelectedTable(order_id);
        setDetaljiUputnice(uputnica);
        // console.log(uputnica);
    };

    return (
        <AntModal
            closeModal={closeModal}
            openModal={openModal}
            okText={"Prikaži odabranu uputnicu"}
            ikona={<UserOutlined />}
            onOk={()=>onSubmit(selectedTable, selektovanaUputnica, detaljiUputnice)}
            naslov={pacijent}
            width={"70%"}
            okButtonProps={{
                icon: <CheckOutlined />,
                disabled: selectedTable === null
            }}
            loading={listaUputnica?.length === 0}
            style={{ top: 20 }}
        >
            <div className={classes.lista_uputnica}>
                {listaUputnica?.map((uputnica, index) => (
                    <Fragment key={uputnica.order_id}>
                        {uputnica?.analysis ? <div
                            className={classes.uputnica}
                            key={uputnica.order_id}
                            style={{
                                backgroundColor: selectedTable === uputnica.order_id ? "#e6f4ff" : "transparent",
                                padding: "10px",
                                marginBottom: index < listaUputnica.length - 1 ? "0" : "20px",
                            }}
                        >
                            {uputnica.analysis && (
                                <Radio
                                    value={uputnica.order_id}
                                    checked={selectedTable === uputnica.order_id}
                                    onChange={(e) => handleRadioChange(e, uputnica.order_id, uputnica, )}
                                >
                                    Broj uputnice: {uputnica.order_id}
                                </Radio>
                            )}
                            {uputnica.analysis && (
                                <AntTable
                                    columns={rezultatKolone}
                                    dataSource={uputnica.analysis}
                                    rowKey="result_uid"
                                    style={{marginTop: "10px"}}
                                />
                            )}
                        </div> : null}
                    </Fragment>
                ))}
            </div>
        </AntModal>
    );
};

export default PregledajUputniceModal;