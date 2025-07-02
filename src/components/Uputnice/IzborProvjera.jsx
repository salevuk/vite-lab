import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import Alergija from "../Pretrage/components/podgrupeanalize/Alergija";
import Profil from "../Pretrage/components/podgrupeanalize/Profil";
import Autoimune from "../Pretrage/components/podgrupeanalize/Autoimune";
import Hormoni from "../Pretrage/components/podgrupeanalize/Hormoni";
import KostaniMarkeri from "../Pretrage/components/podgrupeanalize/KostaniMarkeri";
import KlinickaHemija from "../Pretrage/components/podgrupeanalize/KlinickaHemija";
import Hgu from "../Pretrage/components/podgrupeanalize/HematologijaGasneUrin";
import Kou from "../Pretrage/components/podgrupeanalize/KoagulacijaOsmolaritetUsluge";
import ListaPretraga from "../Pretrage/components/ui/ListaPretraga";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import Select, { components } from "react-select"; // eslint-disable-line
import { FormControlLabel, FormGroup, Checkbox } from "@mui/material";

const IzborProvjera = ({ pretrageSve, notifikacija }) => {
  const [tab, setTab] = useState("Rutina");
  const [isPregledDrawerOpen, setIsPregledDrawerOpen] = useState(false);
  const [opcijePretrage, setOpcijePretrage] = useState([]);
  const openProvjeraCijene = useStore((store) => store.openProvjeraCijene);
  const pretrage = useStore((store) => store.pretrage);
  const statusProvjera = useStore((store) => store.statusProvjera);
  const setStatusProvjera = useStore((store) => store.setStatusProvjera);
  /* const [checked, setChecked] = useState({
    osiguran: true,
    komerc: false,
    neosiguran: false,
  }); */
  const odabranePretrageProvjere = useStore(
    (store) => store.odabranePretrageProvjere
  );
  const setOdabranePretrageProvjere = useStore(
    (store) => store.setOdabranePretrageProvjere
  );
  const [ukupno, setUkupno] = useState(0);

  const grupe = pretrage.map((u) => {
    return u.pretrage_grupa;
  });
  const gg = [...new Set(grupe)];

  const tpr = pretrageSve
    .filter((p) => p.pretraga_id === "15140")
    .map((t) => {
      return {
        id: Number(t.labmedic_sifra),
        lab_sifra: t.labmedic_sifra,
        sifra_usluge: t.usluga_sif,
        komerc_sif: t.komerc_sif,
        pretraga_code: t.pretraga_code,
        naziv: t.pretraga_naz,
        fond_participacija: t.fond_participacija,
        mpc_cijena: t.mpc_cijena,
        fond_cijena: t.fond_cijena,
        kolicina: 1,
      };
    });
  const validSifre = ["0020", "0022"];

  useEffect(() => {
    const opcijePretrageSve = pretrageSve
      .filter((p) => {
        return (
          ["0022", "0020"].includes(p.pretraga_id) ||
          !odabranePretrageProvjere.some((e) => e.id === Number(p.pretraga_id))
        );
      })
      .map((u) => {
        return {
          label: (u.labmedic_sifra + " - " + u.pretraga_naz).trim(),
          pretraga_naz: u.pretraga_naz,
          pretraga_code: u.pretraga_code,
          value: Number(u.pretraga_id),
          lab_sifra: u.labmedic_sifra,
          fond_participacija: u.fond_participacija,
          fond_cijena: u.fond_cijena,
          mpc_cijena: u.mpc_cijena,
          usluga_sif: u.usluga_sif,
          komerc_sif: u.komerc_sif,
        };
      });
    setOpcijePretrage(opcijePretrageSve);
  }, [pretrageSve, odabranePretrageProvjere]);

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    if (checked === true) {
      /* setChecked((prevState) => {
        return Object.fromEntries(
          Object.keys(prevState).map((key) => [
            key,
            key === name ? checked : false,
          ])
        );
      }); */
      setStatusProvjera(
        Object.fromEntries(
          Object.keys(statusProvjera).map((key) => [
            key,
            key === name ? checked : false,
          ])
        )
      );
    }
  };

  useEffect(() => {
    if (odabranePretrageProvjere.length > 0) {
      if (statusProvjera.neosiguran === true) {
        setUkupno(
          odabranePretrageProvjere
            .reduce((a, c) => a + Number(c.kolicina) * Number(c.fond_cijena), 0)
            .toFixed(2)
        );
      }
      if (statusProvjera.osiguran === true) {
        setUkupno(
          odabranePretrageProvjere
            .reduce(
              (a, c) => a + Number(c.kolicina) * Number(c.fond_participacija),
              0
            )
            .toFixed(2)
        );
      }
      if (statusProvjera.komerc === true) {
        setUkupno(
          odabranePretrageProvjere
            .reduce((a, c) => a + Number(c.kolicina) * Number(c.mpc_cijena), 0)
            .toFixed(2)
        );
      }
    }
  }, [pretrageSve, odabranePretrageProvjere, statusProvjera]);

  const handlePretraga = (odabranaPretraga, { action }) => {
    // console.log("ODABRANA PRETRAGA", odabranaPretraga, action);
    let pretraga = {
      id: odabranaPretraga.value, //ovdje ga pretvara u broj
      lab_sifra: odabranaPretraga.lab_sifra,
      sifra_usluge: odabranaPretraga.usluga_sif,
      komerc_sif: odabranaPretraga.komerc_sif,
      pretraga_code: odabranaPretraga.pretraga_code,
      naziv: odabranaPretraga.pretraga_naz,
      fond_participacija: odabranaPretraga.fond_participacija,
      fond_cijena: odabranaPretraga.fond_cijena,
      mpc_cijena: odabranaPretraga.mpc_cijena,
      kolicina: 1,
    };

    if (action === "select-option") {
      if (odabranaPretraga.lab_sifra === "430050") {
        let tprprovjera = odabranePretrageProvjere.find(
          (p) => p.lab_sifra === "15140"
        );
        if (tprprovjera === undefined) {
          setOdabranePretrageProvjere([
            ...odabranePretrageProvjere,
            tpr[0],
            pretraga,
          ]);
        }
      } else {
        setOdabranePretrageProvjere([...odabranePretrageProvjere, pretraga]);
      }
      notifikacija(true, "Laboratorijska pretraga unešena!", "success", 1000);
    }
    if (action === "dodaj") {
      const existingPretraga = odabranePretrageProvjere.find(
        (pretraga) => pretraga.id === odabranaPretraga.id
      );
      if (existingPretraga) {
        setOdabranePretrageProvjere(
          odabranePretrageProvjere.map((pretraga) =>
            pretraga.id === odabranaPretraga.id
              ? { ...pretraga, kolicina: pretraga.kolicina + 1 }
              : pretraga
          )
        );
      }
      notifikacija(
        true,
        "Količina laboratorijske pretrage povećana!",
        "success",
        1000
      );
    } else if (action === "oduzmi") {
      const existingPretraga = odabranePretrageProvjere.find(
        (pretraga) => pretraga.id === odabranaPretraga.id
      );
      if (existingPretraga) {
        if (existingPretraga.kolicina === 1) {
          setOdabranePretrageProvjere(
            odabranePretrageProvjere.filter(
              (pretraga) => pretraga.id !== odabranaPretraga.id
            )
          );
        } else {
          setOdabranePretrageProvjere(
            odabranePretrageProvjere.map((pretraga) =>
              pretraga.id === odabranaPretraga.id
                ? { ...pretraga, kolicina: pretraga.kolicina - 1 }
                : pretraga
            )
          );
        }
      }
      notifikacija(
        true,
        "Količina laboratorijske pretrage umanjena!",
        "success",
        1000
      );
    } else if (action === "obrisi") {
      setOdabranePretrageProvjere(
        odabranePretrageProvjere.filter(
          (pretraga) => pretraga.id !== odabranaPretraga.id
        )
      );
      notifikacija(true, "Laboratorijska pretraga obrisana!", "success", 1000);
    }
  };
  //console.warn("odabranePretrageProvjere", odabranePretrageProvjere);
  const DropdownIndicator = ({ children, ...props }) => {
    const style = {
      color: "#067bc2",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "1.5em",
    };
    return (
      <components.DropdownIndicator {...props}>
        <span style={style}>
          <i class="bx bx-list-ul"></i>
        </span>
        {children}
      </components.DropdownIndicator>
    );
  };
  const selectStyle = {
    control: (styles, state) => ({
      ...styles,
      /*       height: 32,
          minHeight: 32, */
      borderWidth: "1px",
      "&:hover": {
        borderColor: "#2684ff",
      },
      borderColor: state.isFocused ? "#2684ff" : "#84dcc6",
      borderRadius: "5px",
      fontSize: "0.95em",
      marginTop: "0.5em",
    }),

    dropdownIndicator: (styles) => ({
      ...styles,
      paddingTop: 4,
      paddingBottom: 4,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
  };

  const togglePregledDrawer = () => {
    setIsPregledDrawerOpen(!isPregledDrawerOpen);
  };

  return (
    <div className="ipa_container">
      <div className="ia_header">
        {gg.map((g) => (
          <div
            className={`ia_tab ${tab === g ? "izabranaGrupa" : ""}`}
            onClick={() => setTab(g)}
          >
            <p>{g.toUpperCase()}</p>
          </div>
        ))}
        <div className="ia_naslov"></div>

        <div className="dugme">
          <button onClick={togglePregledDrawer}>DODAJ / PREGLEDAJ</button>
        </div>
      </div>
      <div className={tab === "Uredi" ? "ia_lista" : "ia_main"}>
        {tab === "Rutina" && (
          <div className="ia_rutina">
            <KlinickaHemija tpr={tpr} provjera={true} />
            <Hgu />
            <Kou />
          </div>
        )}
        {tab === "Hormoni" && <Hormoni />}
        {tab === "Alergija" && <Alergija />}
        {tab === "Profil" && <Profil />}
        {tab === "Autoimune bolesti" && <Autoimune />}
        {tab === "Kostani markeri" && <KostaniMarkeri />}
        {tab === "Uredi" && <ListaPretraga />}
      </div>
      <Drawer
        open={isPregledDrawerOpen}
        onClose={togglePregledDrawer}
        direction="left"
        size="600px"
        className="draw_backdrop"
      >
        <div className="draw_menu">
          <p className="draw_menu_naslov">
            PROVJERI CIJENU I DODAJ LAB. PRETRAGU
          </p>
          <div className="draw_status">
            <FormGroup sx={{ flexDirection: "column" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="komerc"
                    checked={statusProvjera.komerc}
                    onChange={handleCheck}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={openProvjeraCijene ? { padding: "0 9px" } : {}}
                  />
                }
                label="Komercijalno"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="neosiguran"
                    checked={statusProvjera.neosiguran}
                    onChange={handleCheck}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={openProvjeraCijene ? { padding: "0 9px" } : {}}
                  />
                }
                label="Neosiguran"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="osiguran"
                    checked={statusProvjera.osiguran}
                    onChange={handleCheck}
                    inputProps={{ "aria-label": "controlled" }}
                    sx={openProvjeraCijene ? { padding: "0 9px" } : {}}
                  />
                }
                label="Osiguran - OZ"
              />
            </FormGroup>
          </div>
          <Select
            placeholder="Pretraži i izaberi laboratorijsku pretragu"
            options={opcijePretrage}
            isSearchable
            //isClearable
            color="var(--color-labos-400)"
            onChange={handlePretraga}
            styles={selectStyle}
            components={{ DropdownIndicator }}
          />
        </div>

        {odabranePretrageProvjere.length === 0 && (
          <div className="lista_dodatih_usluga dodate_usluge_provjera">
            <p>Nema dodatih laboratorijskih pretraga !</p>
          </div>
        )}
        {odabranePretrageProvjere.length > 0 && (
          <div className="lista_dodatih_usluga dodate_usluge_provjera">
            <p>Laboratorijske pretrage dodate u nalog:</p>
            <span className="dodata_pretraga_header">
              <p>R.br</p>
              <p>Šif. pret.</p>
              <p>Naziv</p>
              <p>Šif. usl.</p>
              <p></p>
              <p>Kol.</p>
              <p></p>
              <p>Cijena</p>
            </span>
            <ol>
              {odabranePretrageProvjere
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((pretraga) => (
                  <li key={pretraga.id}>
                    <div className="dodata_pretraga">
                      <div>{pretraga.lab_sifra}</div>
                      <div>{pretraga.naziv}</div>
                      <div>
                        {statusProvjera.komerc === true
                          ? `${pretraga.komerc_sif}`
                          : `${pretraga.sifra_usluge}`}
                      </div>
                      <div>
                        {validSifre.includes(pretraga.lab_sifra) && (
                          <i
                            class="bx bx-minus-circle"
                            onClick={() =>
                              handlePretraga(pretraga, { action: "oduzmi" })
                            }
                          ></i>
                        )}
                      </div>
                      <div>
                        {pretraga.kolicina === undefined
                          ? 1
                          : pretraga.kolicina}
                      </div>
                      <div>
                        {validSifre.includes(pretraga.lab_sifra) && (
                          <i
                            class="bx bx-plus-circle"
                            onClick={() =>
                              handlePretraga(pretraga, { action: "dodaj" })
                            }
                          ></i>
                        )}
                      </div>
                      {
                        <div>
                          {statusProvjera.komerc === true
                            ? `${(
                                pretraga.kolicina * pretraga.mpc_cijena
                              ).toFixed(2)} KM`
                            : statusProvjera.neosiguran === true
                            ? `${(
                                pretraga.kolicina * pretraga.fond_cijena
                              ).toFixed(2)} KM`
                            : `${(
                                pretraga.kolicina * pretraga.fond_participacija
                              ).toFixed(2)} KM`}
                        </div>
                      }
                      <i
                        className="bx bx-trash"
                        onClick={() =>
                          handlePretraga(pretraga, { action: "obrisi" })
                        }
                      ></i>
                    </div>
                  </li>
                ))}
            </ol>
            <div>UKUPNA CIJENA: {`${ukupno} KM`}</div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default IzborProvjera;
