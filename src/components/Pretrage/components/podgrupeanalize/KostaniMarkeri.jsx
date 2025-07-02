//import { useState } from "react";
import { useStore } from "../../../../store";
import "./PodgrupeProfiliAutoimune.css";
import CheckBox from "../ui/CheckBox";

const KostaniMarkeri = () => {
  //const [podGrupaKostaniMarkeri, setPodGrupaKostaniMarkeri] = useState("KOSTANI");
  const pretrage = useStore((store) => store.pretrage);
  return (
    <div className="ia_kostani">
      <div className="podgrupa_header profil_header">
        {/* <div
            className={podGrupaKostaniMarkeri === "KOSTANI" ? "izabranaPodGrupa" : ""}
            onClick={() => setPodGrupaKostaniMarkeri("KOSTANI")}
          >
            <p>Koštani markeri</p>
          </div> */}
      </div>
      <div className="p_podgrupa imunoloske_pretrage">
        <p className="r_podnaslov">Koštani markeri</p>
        <div className="p_checkbox imunoloske_checkbox">
          {pretrage
            .filter((u) => {
              return u.grupa_pretraga === "Kostani markeri";
            })
            .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
            .map((pretraga) => (
              <CheckBox pretraga={pretraga} />
            ))}
        </div>
      </div>
    </div>
  );
};
export default KostaniMarkeri;
