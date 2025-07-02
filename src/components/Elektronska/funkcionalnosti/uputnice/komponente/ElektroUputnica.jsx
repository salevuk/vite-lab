import { useState } from "react";
import classes from "../stilovi/NadjiUputnicu.module.scss";
import AntTab from "../../../komponente/UI/AntTab/AntTab.jsx";
import TraziPoUpitnici from "./TraziPoUpitnici.jsx";
import TraziPoJmbg2 from "./TraziPoJmbg2.jsx";
import PoveziSifarnike from "./PoveziSifarnike.jsx";
import Popup from "../../../../UI/Forms/Popup.jsx";

const ElektroUputnica = ({ closeListaElektroskih }) => {
  const [activeTabeKey, setActiveTabKey] = useState("1");

  const onChange = (key) => {
    setActiveTabKey(key);
  };

  const tabsData = [
    {
      label: "Pretraga po broju uputnice",
      key: "1",
      children: <TraziPoUpitnici />,
    },
    {
      label: "Pretraga po JMBG",
      key: "2",
      children: <TraziPoJmbg2 />,
    },
    {
      label: "Povezivanje",
      key: "3",
      children: <PoveziSifarnike tabKey={"3"} />,
    },
  ];

  return (
    <Popup
      setOpenPopup={closeListaElektroskih}
      title="ELEKTRONSKE UPUTNICE"
      openPopup={true}
      fullScreen={true}
    >
      <div className={classes.uputnica}>
        <AntTab
          activeTabKey={activeTabeKey}
          onChange={onChange}
          tabsData={tabsData}
        />
      </div>
    </Popup>
  );
};

export default ElektroUputnica;
