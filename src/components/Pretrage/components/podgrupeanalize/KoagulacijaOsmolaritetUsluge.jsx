import { useState } from "react";
import { useStore } from "../../../../store";
import "./PodgrupeRutina.css";
import CheckBox from "../ui/CheckBox";

const Kou = () => {
  const [podGrupaKoagulacije, setPodGrupaKoagulacije] = useState("KOAGULACIJA");
  const [podGrupaOsmo, setPodGrupaOsmo] = useState("OSMOLALNOST");
  const pretrage = useStore((store) => store.pretrage);

  return (
    <div className="r_kou">
      <div className="r_hgu_podgrupa r_koagulacije">
        <h4>Koagulacija</h4>
        <div className="r_okvir">
          <div className="podgrupa_header">
            <div
              className={
                podGrupaKoagulacije === "KOAGULACIJA" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaKoagulacije("KOAGULACIJA")}
            >
              <p>Koagulacija rutina</p>
            </div>
            <div
              className={
                podGrupaKoagulacije === "FAKTORI" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaKoagulacije("FAKTORI")}
            >
              <p>Faktori</p>
            </div>
            <div
              className={
                podGrupaKoagulacije === "GENETICKE" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaKoagulacije("GENETICKE")}
            >
              <p>Genetičke</p>
            </div>
          </div>
          {podGrupaKoagulacije === "KOAGULACIJA" && (
            <div className="r_podgrupa_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Koagulacija rutina";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
          {podGrupaKoagulacije === "FAKTORI" && (
            <div className="r_podgrupa_checkbox r_koagulacije_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Faktori";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
          {podGrupaKoagulacije === "GENETICKE" && (
            <div className="r_podgrupa_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Geneticke";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="r_hgu_podgrupa r_osmolaritet">
        <h4>Osmolaritet</h4>
        <div className="r_okvir">
          <div className="podgrupa_header">
            <div
              className={
                podGrupaOsmo === "OSMOLALNOST" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaOsmo("OSMOLALNOST")}
            >
              <p>Osmolalnost</p>
            </div>
          </div>
          {podGrupaOsmo === "OSMOLALNOST" && (
            <div className="r_podgrupa_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Osmolalnost";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="r_hgu_podgrupa r_usluge">
        <h4>Pretrage laboratorije</h4>
        <div className="r_podgrupa_checkbox usluge_checkbox">
          {pretrage
            .filter((u) => {
              return u.grupa_pretraga === "Usluge labaratorije";
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

export default Kou;
