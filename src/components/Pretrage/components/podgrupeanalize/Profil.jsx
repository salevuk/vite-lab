import { useState } from "react";
import { useStore } from "../../../../store";
import "./PodgrupeProfiliAutoimune.css";
import CheckBox from "../ui/CheckBox";

const Profil = () => {
  const [podGrupaProfil, setPodGrupaProfil] = useState("Unos profila");
  const pretrage = useStore((store) => store.pretrage);

  const grupa = pretrage
    .filter((u) => {
      return u.pretrage_grupa === "Profil";
    })
    .map((u) => {
      return u.pretrage_podgrupa;
    });
  const pg = [...new Set(grupa)];

  return (
    <div className="ia_profil">
      <div className="podgrupa_header profil_header">
        {pg.sort().map((podgrupa) => (
          <div
            className={`tab_profil ${
              podGrupaProfil === podgrupa ? "izabranaPodGrupa" : ""
            }`}
            onClick={() => setPodGrupaProfil(podgrupa)}
          >
            <p>{podgrupa}</p>
          </div>
        ))}
      </div>
      {podGrupaProfil === "Unos profila" && (
        <div className="up1">
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">OGTT</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "OGTT";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Glukagonski test</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Glukagonski test";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Hormon rasta</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Hormon rasta";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">IRI</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "IRI";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Insulin</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Insulin";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">C - Peptid</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "C - Peptid";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Kortizol</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Kortizol" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">ACTH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "ACTH" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Insulinski test</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "Insulinski test";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Prolaktin</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Prolaktin" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">PRO</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return u.grupa_pretraga === "PRO";
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">LH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "LH" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa p_podgrupa_zadnja">
              <p className="r_podnaslov">FSH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "FSH" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa p_podgrupa_zadnja">
              <p className="r_podnaslov">Kalcitonin</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Kalcitonin" &&
                      u.pretrage_podgrupa === "Unos profila"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {podGrupaProfil === "Unos profila 2" && (
        <div className="up2">
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Glukoza</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Glukoza" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">LH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "LH" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">FSH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "FSH" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Prolaktin</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Prolaktin" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Progesteron</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Progesteron" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Estradiol</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Estradiol" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa p_podgrupa_zadnja">
              <p className="r_podnaslov">Testosteron</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Testosteron" &&
                      u.pretrage_podgrupa === "Unos profila 2"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {podGrupaProfil === "Unos profila 3" && (
        <div className="up1">
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">DHEA</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "DHEA" &&
                      u.pretrage_podgrupa === "Unos profila 3"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Kortizol</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Kortizol" &&
                      u.pretrage_podgrupa === "Unos profila 3"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">ACTH</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "ACTH" &&
                      u.pretrage_podgrupa === "Unos profila 3"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa">
              <p className="r_podnaslov">Inzulin</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "Inzulin" &&
                      u.pretrage_podgrupa === "Unos profila 3"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
          <div>
            <div className="p_podgrupa p_podgrupa_zadnja">
              <p className="r_podnaslov">C-Peptid</p>
              <div className="p_checkbox">
                {pretrage
                  .filter((u) => {
                    return (
                      u.grupa_pretraga === "C-Peptid" &&
                      u.pretrage_podgrupa === "Unos profila 3"
                    );
                  })
                  .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
                  .map((pretraga) => (
                    <CheckBox pretraga={pretraga} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {podGrupaProfil === "Unos profila 4" && (
        <div className="p_podgrupa imunoloske_pretrage">
          <p className="r_podnaslov">Glukoza Hemolizat</p>
          <div className="p_checkbox imunoloske_checkbox">
            {pretrage
              .filter((u) => {
                return (
                  u.grupa_pretraga === "Glukoza Hemolizat" &&
                  u.pretrage_podgrupa === "Unos profila 4"
                );
              })
              .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
              .map((pretraga) => (
                <CheckBox pretraga={pretraga} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profil;
