import { Fragment, useState } from "react";
import { useStore } from "../../../../store";
import "./PodgrupeRutina.css";
import CheckBox from "../ui/CheckBox";

const Hgu = () => {
  const [podGrupaGasne, setPodGrupaGasne] = useState("ASTRUPK");
  const [podGrupaUrin, setPodGrupaUrin] = useState("URIN");
  const pretrage = useStore((store) => store.pretrage);
  return (
    <div className="r_hgu">
      <div className="r_hgu_podgrupa r_hematologija">
        <h4>Hematologija</h4>
        <div className="r_podgrupa_checkbox r_hematologija_checkbox">
          {pretrage
            .filter((u) => {
              return u.grupa_pretraga === "Hematologija";
            })
            .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
            .map((pretraga) => (
              <CheckBox pretraga={pretraga} />
            ))}
        </div>
      </div>
      <div className="r_hgu_podgrupa r_gasne">
        <h4>Gasne analize</h4>
        <div className="r_okvir">
          <div className="podgrupa_header">
            <div
              className={
                podGrupaGasne === "ASTRUPK" ? "izabranaPodGrupaGas" : ""
              }
              onClick={() => setPodGrupaGasne("ASTRUPK")}
            >
              <p>Astrup k</p>
            </div>
            <div
              className={
                podGrupaGasne === "ASTRUPA" ? "izabranaPodGrupaGas" : ""
              }
              onClick={() => setPodGrupaGasne("ASTRUPA")}
            >
              <p>Astrup a</p>
            </div>
          </div>
          {podGrupaGasne === "ASTRUPK" && (
            <div className="r_podgrupa_checkbox r_gasne_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Astrup k";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
          {podGrupaGasne === "ASTRUPA" && (
            <div className="r_podgrupa_checkbox r_gasne_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Astrup a";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
        </div>
      </div>
      <div className="r_hgu_podgrupa r_urin">
        <h4>Urin/Stolica</h4>
        <div className="r_okvir">
          <div className="podgrupa_header urin_header">
            <div
              className={
                podGrupaUrin === "URINBIOHEMIJA" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaUrin("URINBIOHEMIJA")}
            >
              <p>Urin Biohemija</p>
            </div>
            <div
              className={podGrupaUrin === "URIN" ? "izabranaPodGrupa" : ""}
              onClick={() => setPodGrupaUrin("URIN")}
            >
              <p>Urin</p>
            </div>
            <div
              className={podGrupaUrin === "URIN24" ? "izabranaPodGrupa" : ""}
              onClick={() => setPodGrupaUrin("URIN24")}
            >
              <p>Urin 24</p>
            </div>
            <div
              className={podGrupaUrin === "STOLICA" ? "izabranaPodGrupa" : ""}
              onClick={() => setPodGrupaUrin("STOLICA")}
            >
              <p>Stolica</p>
            </div>
            <div
              className={
                podGrupaUrin === "SREDZAVISNOSTI" ? "izabranaPodGrupa" : ""
              }
              onClick={() => setPodGrupaUrin("SREDZAVISNOSTI")}
            >
              <p>Sredstva zavisnosti</p>
            </div>
          </div>
          {podGrupaUrin === "URINBIOHEMIJA" && (
            <div className="r_podgrupa_checkbox r_urin_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Urin biohemija";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
          {podGrupaUrin === "URIN" && (
            <>
              <div className="komplet_urin">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "UrinKomplet";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
              <div className="r_podgrupa_checkbox r_urin_checkbox urin_u">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Urin";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </>
          )}
          {podGrupaUrin === "URIN24" && (
            <div className="r_urin_checkbox r_urin24">
              <div className="razno_checkbox urin_checkbox">
                <p>Urin 24</p>
                <div>
                  {pretrage
                    .filter((u) => {
                      return u.grupa_pretraga === "Urin 24";
                    })
                    .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                    .map((pretraga) => (
                      <CheckBox pretraga={pretraga} />
                    ))}
                </div>
              </div>
              <div className="razno_checkbox">
                <p>Kateholamini u urinu</p>
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Kateholamini";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          )}
          {podGrupaUrin === "STOLICA" && (
            <div className="r_podgrupa_checkbox r_urin_checkbox stolica">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Stolica";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          )}
          {podGrupaUrin === "SREDZAVISNOSTI" && (
            <div className="r_podgrupa_checkbox r_urin_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Sredstva zavisnosti";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <Fragment>
                    <CheckBox pretraga={pretraga} />
                    {pretraga.pretraga_id === 245 && (
                      <ul>
                        <li>Amfetamini</li>
                        <li>Buprenorfini</li>
                        <li>Metamfetamini</li>
                        <li>Opijati (MOP i OPi)</li>
                        <li>Kokain, metabolit</li>
                        <li>Metadon</li>
                        <li>Kanabinoidi (THC)</li>
                        <li>Barbiturati</li>
                        <li>Benzodiazepini</li>
                        <li>Ecstasy</li>
                      </ul>
                    )}
                    {pretraga.pretraga_id === 247 && (
                      <ul>
                        <li>Amfetamini</li>
                        <li>Opijati (MOP i OPi)</li>
                        <li>Kokain, metabolit</li>
                        <li>Kanabinoidi (THC)</li>
                        <li>Benzodiazepini</li>
                        <li>Ecstasy</li>
                      </ul>
                    )}
                  </Fragment>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hgu;
