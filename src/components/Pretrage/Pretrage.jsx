import { useEffect } from "react";
import { useStore } from "../../store";
import "./Pretrage.css";
import IzborAnaliza from "./components/grupeanalize/IzborAnaliza";

function Pretrage({
  pretrageSve,
  zatvoriPretrage,
  pacijentPodaci,
  //podaciUputnice,
  otvoriDetalj,
  izmjenaStatusa,
}) {
  const podaciUputnice = useStore((store) => store.podaciUputnice);
  const unesiPretrageUputnice = useStore(
    (store) => store.unesiPretrageUputnice
  );

  // USEFFECT DA UBACI ODABRANE PRETRAGE IZ UPUTNICE
  useEffect(() => {
    if (podaciUputnice.pretrage === undefined) return;
    if (podaciUputnice.pretrage.length > 0) {
      //useStore.setState({ odabranePretrage: podaciUputnice.pretrage });
      unesiPretrageUputnice({
        id: podaciUputnice.id,
        novePretrage: podaciUputnice.pretrage,
      });
    } //eslint-disable-next-line
  }, [podaciUputnice]);

  //console.log("pretrageSve", pretrageSve);
  /* console.log(
    "pretrageUputnice",
    podaciUputnice.pretrage,
    podaciUputnice.pretrage.length
  ); */
  //console.log("podaci pacijenta", pacijentPodaci);
  return (
    <div className="App">
      <IzborAnaliza
        zatvoriPretrage={zatvoriPretrage}
        pacijentPodaci={pacijentPodaci}
        otvoriDetalj={otvoriDetalj}
        //podaciUputnice={podaciUputnice}
        pretrageSve={pretrageSve}
        izmjenaStatusa={izmjenaStatusa}
      />
    </div>
  );
}

export default Pretrage;
