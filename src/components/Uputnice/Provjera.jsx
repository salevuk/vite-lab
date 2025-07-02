import Popup from "../UI/Forms/Popup";
import IzborProvjera from "./IzborProvjera";
import { useStore } from "../../store";

const Provjera = ({ notifikacija, pretrageSve, closeProvjeraCijene }) => {
  const setOdabranePretrageProvjere = useStore(
    (store) => store.setOdabranePretrageProvjere
  );
  const zatvoriProvjeru = () => {
    closeProvjeraCijene();
    setOdabranePretrageProvjere([]);
  };
  return (
    <Popup
      title={"PROVJERA CIJENE PRETRAGA - U UPUTNICI"}
      openPopup={true}
      setOpenPopup={zatvoriProvjeru}
      fullScreen={true}
    >
      <IzborProvjera notifikacija={notifikacija} pretrageSve={pretrageSve} />
    </Popup>
  );
};

export default Provjera;
