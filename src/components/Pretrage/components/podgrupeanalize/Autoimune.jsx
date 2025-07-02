import { useState } from "react";
import { useStore } from "../../../../store";
import "./PodgrupeProfiliAutoimune.css";
import CheckBox from "../ui/CheckBox";

const Autoimune = () => {
  const [podGrupaAutoimune, setPodGrupaAutoimune] = useState("ALEGRIA");
  const pretrage = useStore((store) => store.pretrage);
  return (
    <div className="ia_autoimune">
      <div className="podgrupa_header profil_header">
        <div
          className={podGrupaAutoimune === "ALEGRIA" ? "izabranaPodGrupa" : ""}
          onClick={() => setPodGrupaAutoimune("ALEGRIA")}
        >
          <p>Autoimune bolesti - ALEGRIA</p>
        </div>
      </div>
      <div className="p_podgrupa imunoloske_pretrage">
        <p className="r_podnaslov">Imunološke pretrage</p>
        <div className="p_checkbox imunoloske_checkbox">
          {pretrage
            .filter((u) => {
              return u.grupa_pretraga === "Imunoloske pretrage";
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

export default Autoimune;
