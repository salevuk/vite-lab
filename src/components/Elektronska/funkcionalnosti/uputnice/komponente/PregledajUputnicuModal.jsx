import {UserOutlined} from "@ant-design/icons";
import classes from "../stilovi/PregledajUputnicuModal.module.scss";
import AntTable from "../../../komponente/UI/AntTable/AntTable.jsx";
import {rezultatKolone} from "../alati/koloneZaTabelu.jsx";
import AntModal from "../../../komponente/UI/AntModal/AntModal.jsx";

const PregledajUputnicuModal = ({ closeModal, openModal, pacijent, detaljiUputnice }) => {

    return (
        <AntModal
            closeModal={closeModal}
            openModal={openModal}
            ikona={<UserOutlined />}
            footer={false}
            naslov={pacijent}
            width={"70%"}
            loading={detaljiUputnice?.length === 0}
            style={{ top: 20 }}
        >
            <div className={classes.detalji_uputnice}>
                <AntTable
                    dataSource={detaljiUputnice}
                    columns={rezultatKolone}
                    scroll={{y: 'calc(100dvh - 180px)'}}
                    rowKey={'result_uid'}/>
            </div>
        </AntModal>
    );
};

export default PregledajUputnicuModal;