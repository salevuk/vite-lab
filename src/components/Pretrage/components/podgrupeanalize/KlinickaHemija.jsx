import { Fragment, useState } from "react";
import { useStore } from "../../../../store";
import CheckBox from "../ui/CheckBox";
import "./PodgrupeRutina.css";

const KlickaHemija = ({ tpr, provjera }) => {
  const [podGrupaSerum, setPodGrupaSerum] = useState("SERUM1");
  const [podGrupaLijekovi, setPodGrupaLijekovi] = useState("LIJEKOVI1");
  const [podGrupaLiquor, setPodGrupaLiquor] = useState("LIQUOR");
  const pretrage = useStore((store) => store.pretrage);

  return (
    <div className="r_klinicka">
      <h4>Klinička hemija</h4>
      <div className="r_klin">
        <div className="r_klin1">
          <div className="r_podgrupa">
            <div className="podgrupa_header">
              <div
                className={podGrupaSerum === "SERUM1" ? "izabranaPodGrupa" : ""}
                onClick={() => setPodGrupaSerum("SERUM1")}
              >
                <p>Serum</p>
              </div>
              {/*  <div
                className={podGrupaSerum === "SERUM2" ? "izabranaPodGrupa" : ""}
                onClick={() => setPodGrupaSerum("SERUM2")}
              >
                <p>Serum 1</p>
              </div> */}
            </div>
            {podGrupaSerum === "SERUM1" && (
              <div
                className={`r_podgrupa_checkbox ${
                  provjera ? "r_serum_provjera_checkbox" : "r_serum_checkbox"
                }`}
              >
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Serum";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} tpr={tpr} />
                  ))}
              </div>
            )}
            {/*podGrupaSerum === "SERUM2" && (
              <div className="r_podgrupa_checkbox r_serum_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Serum1";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )*/}
          </div>
          {/*  <div className="r_podgrupa r_hormoni">
            <div className="podgrupa_header">
              <div
                className={
                  podGrupaHormoni === "HORMONI1" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaHormoni("HORMONI1")}
              >
                <p>Hormoni</p>
              </div>
              <div
                className={
                  podGrupaHormoni === "HORMONI2" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaHormoni("HORMONI2")}
              >
                <p>Hormoni štitnjače</p>
              </div>
            </div>
            {podGrupaHormoni === "HORMONI1" && (
              <div className="r_podgrupa_checkbox r_hormoni_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Hormoni";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
            {podGrupaHormoni === "HORMONI2" && (
              <div className="r_podgrupa_checkbox r_hormoni_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Hormoni stitnjace";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
          </div> */}
        </div>
        <div className="r_klin2">
          <div className="r_podgrupa r_ip">
            <p className="r_podnaslov">Imunološke pretrage</p>
            <div className="r_podgrupa_checkbox r_imun_checkbox">
              {pretrage
                .filter((u) => {
                  return (
                    u.grupa_pretraga === "Imunologija" &&
                    u.pretrage_podgrupa === "Klinicka Hemija"
                  );
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          </div>
          <div
            className={`r_podgrupa ${provjera ? "r_provjera_spec" : "r_spec"}`}
          >
            <div className="podgrupa_header">
              <div
                className={
                  podGrupaLijekovi === "LIJEKOVI1" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaLijekovi("LIJEKOVI1")}
              >
                <p>Specifični proteini</p>
              </div>
              <div
                className={
                  podGrupaLijekovi === "LIJEKOVI2" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaLijekovi("LIJEKOVI2")}
              >
                <p>Lijekovi</p>
              </div>
            </div>
            {podGrupaLijekovi === "LIJEKOVI1" && (
              <div className="r_podgrupa_checkbox r_spec_checkbox ">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Specificni proteini";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
            {podGrupaLijekovi === "LIJEKOVI2" && (
              <div className="r_podgrupa_checkbox r_spec_checkbox ">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Lijekovi";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
          </div>
          <div
            className={`r_podgrupa ${
              provjera ? "r_provjera_tumor" : "r_tumor"
            }`}
          >
            <p className="r_podnaslov">Tumor markeri</p>
            <div className="r_podgrupa_checkbox r_tumor_checkbox">
              {pretrage
                .filter((u) => {
                  return u.grupa_pretraga === "Tumor markeri";
                })
                .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                .map((pretraga) => (
                  <CheckBox pretraga={pretraga} />
                ))}
            </div>
          </div>
          <div
            className={`r_podgrupa ${provjera ? "r_provjera_liq" : "r_liq"}`}
          >
            <div className="podgrupa_header">
              <div
                className={
                  podGrupaLiquor === "LIQUOR" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaLiquor("LIQUOR")}
              >
                <p>Liquor</p>
              </div>
              <div
                className={
                  podGrupaLiquor === "PUNKTAT" ? "izabranaPodGrupa" : ""
                }
                onClick={() => setPodGrupaLiquor("PUNKTAT")}
              >
                <p>Punktat</p>
              </div>
              <div
                className={podGrupaLiquor === "RAZNO" ? "izabranaPodGrupa" : ""}
                onClick={() => setPodGrupaLiquor("RAZNO")}
              >
                <p>Razno</p>
              </div>
            </div>
            {podGrupaLiquor === "LIQUOR" && (
              <div className="r_podgrupa_checkbox r_liq_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Liquor";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
            {podGrupaLiquor === "PUNKTAT" && (
              <div className="r_podgrupa_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Punktat";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            )}
            {podGrupaLiquor === "RAZNO" && (
              <div className="r_podgrupa_checkbox liquor_razno">
                <div className="prve_podgrupe_razno">
                  <div className="razno_checkbox">
                    {pretrage
                      .filter((u) => {
                        return u.grupa_pretraga === "Znoj";
                      })
                      .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                      .map((pretraga) => (
                        <Fragment>
                          <p className="razno_checkbox_podnaslov">
                            {pretraga.grupa_pretraga}
                          </p>
                          <CheckBox pretraga={pretraga} />
                        </Fragment>
                      ))}
                  </div>
                  <div className="razno_checkbox">
                    <p className="razno_checkbox_podnaslov">Bris</p>
                    {pretrage
                      .filter((u) => {
                        return u.grupa_pretraga === "Bris";
                      })
                      .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                      .map((pretraga) => (
                        <CheckBox pretraga={pretraga} />
                      ))}
                  </div>
                </div>
                <div className="zadnje_podgrupe_razno">
                  <div className="razno_checkbox">
                    {pretrage
                      .filter((u) => {
                        return u.grupa_pretraga === "Dijalizat";
                      })
                      .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                      .map((pretraga) => (
                        <Fragment>
                          <p className="razno_checkbox_podnaslov">
                            {pretraga.grupa_pretraga}
                          </p>
                          <CheckBox pretraga={pretraga} />
                        </Fragment>
                      ))}
                  </div>
                  <div className="razno_checkbox">
                    {pretrage
                      .filter((u) => {
                        return u.grupa_pretraga === "Zglobna tecnost";
                      })
                      .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                      .map((pretraga) => (
                        <Fragment>
                          <p className="razno_checkbox_podnaslov">
                            {pretraga.grupa_pretraga}
                          </p>
                          <CheckBox pretraga={pretraga} />
                        </Fragment>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KlickaHemija;
