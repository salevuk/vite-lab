import { useState } from "react";
import { useStore } from "../../../../store";
import CheckBox from "../ui/CheckBox";
import "../podgrupeanalize/PodgrupeAlergija.css";

const Alergija = () => {
  const [podGrupaAlergije, setPodGrupaAlergije] = useState("Hrana");
  const pretrage = useStore((store) => store.pretrage);

  const grupa = pretrage
    .filter((u) => {
      return u.pretrage_grupa === "Alergija";
    })
    .map((u) => {
      return u.pretrage_podgrupa;
    });
  const pg = [...new Set(grupa)];

  return (
    <div className="ia_alergija">
      <div className="ia_alergija_grupa">
        <div className="podgrupa_header alergija_header">
          {pg.map((g) => (
            <div
              className={podGrupaAlergije === g ? "izabranaPodGrupa" : ""}
              onClick={() => setPodGrupaAlergije(g)}
            >
              <p>{g}</p>
            </div>
          ))}
        </div>
        {podGrupaAlergije === "Hrana" && (
          <div className="ia_alergija_podgrupe">
            <div className="a_podgrupa a_hrana_podgrupa">
              <p className="r_podnaslov">Hrana</p>
              <div className="a_checkbox a_hrana_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Hrana";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="a_podgrupa a_hrana_ostalo_podgrupa">
              <p className="r_podnaslov">Ostalo</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Ostalo";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {podGrupaAlergije === "Zivotinje" && (
          <div className="ia_alergija_podgrupe">
            <div className="a_podgrupa">
              <p className="r_podnaslov">Životinje</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Zivotinje";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="a_podgrupa">
              <p className="r_podnaslov">Insekti</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Insekti";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="a_podgrupa">
              <p className="r_podnaslov">Derm</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Derm";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {podGrupaAlergije === "Spore" && (
          <div className="ia_alergija_podgrupe">
            <div className="a_podgrupa">
              <p className="r_podnaslov">Spore</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Spore";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="a_podgrupa">
              <p className="r_podnaslov">Latex</p>
              <div className="ia_latex_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Latex";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {podGrupaAlergije === "Lijekovi" && (
          <div className="ia_alergija_podgrupe">
            <div className="a_podgrupa">
              <p className="r_podnaslov">Lijekovi</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "LijekoviAL";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        )}
        {podGrupaAlergije === "Trava" && (
          <div className="ia_alergija_podgrupe">
            <div className="a_podgrupa">
              <p className="r_podnaslov">Trave</p>
              <div className="a_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Trave";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alergija;
