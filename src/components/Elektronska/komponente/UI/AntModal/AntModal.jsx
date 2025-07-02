import {Modal} from "antd";
import {cloneElement} from "react";
import {SaveOutlined} from "@ant-design/icons";

const AntModal = ({closeModal, openModal, loading, width, naslov, ikona, style,
                      cancelText='Odustani', okText='Sačuvaj',
                      maskClosable=false, onOk, okButtonProps = {icon: <SaveOutlined/>},
                      footer = (_, { CancelBtn, OkBtn }) => (
                          <>
                              <CancelBtn />
                              <OkBtn />
                          </>
                      ), children}) => {
    return (
        <Modal onCancel={closeModal}
               loading={loading}
               style={style}
               open={openModal}
               width={width}
               title={<span>{ikona && cloneElement(ikona, { style: { marginRight: 8 } })}{naslov}</span>}
               cancelText={cancelText}
               okText={okText}
               maskClosable={maskClosable}
               onOk={onOk}
               okButtonProps={okButtonProps}
               footer={footer}
        >
            {children}
        </Modal>
    );
};

export default AntModal;