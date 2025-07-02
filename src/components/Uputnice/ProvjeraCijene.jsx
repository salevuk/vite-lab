import { useEffect, useState } from "react";
import "./ProvjeraCijene.css";
import Popup from "../UI/Forms/Popup";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select, { components } from "react-select"; //eslint-disable-line

const ProvjeraCijene = ({ pretrageSve, closeProvjeraCijene, notifikacija }) => {
  const [opcijeSve, setOpcijeSve] = useState([]);
  const [checked, setChecked] = useState({
    osiguran: true,
    komerc: false,
    neosiguran: false,
  });
  const [odabranePretrage, setOdabranePretrage] = useState([]);
  const [ukupno, setUkupno] = useState(0);

  useEffect(() => {
    const opcijePretrageSve = pretrageSve
      .filter((p) => {
        return (
          ["0022", "0020"].includes(p.pretraga_id) ||
          !odabranePretrage.some((e) => e.id === Number(p.pretraga_id))
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
    setOpcijeSve(opcijePretrageSve); // eslint-disable-next-line
  }, [pretrageSve]);

  useEffect(() => {
    if (odabranePretrage.length > 0) {
      if (checked.neosiguran === true) {
        setUkupno(
          odabranePretrage
            .reduce((a, c) => a + Number(c.kolicina) * Number(c.fond_cijena), 0)
            .toFixed(2)
        );
      }
      if (checked.osiguran === true) {
        setUkupno(
          odabranePretrage
            .reduce(
              (a, c) => a + Number(c.kolicina) * Number(c.fond_participacija),
              0
            )
            .toFixed(2)
        );
      }
      if (checked.komerc === true) {
        setUkupno(
          odabranePretrage
            .reduce((a, c) => a + Number(c.kolicina) * Number(c.mpc_cijena), 0)
            .toFixed(2)
        );
      }
    }
  }, [pretrageSve, odabranePretrage, checked]);

  const handleCheck = (e) => {
    const { name, checked } = e.target;
    if (checked === true) {
      setChecked((prevState) => {
        return Object.fromEntries(
          Object.keys(prevState).map((key) => [
            key,
            key === name ? checked : false,
          ])
        );
      });
    }
  };
  const tpr = pretrageSve.filter((p) => p.pretraga_id === "15140");
  const handlePretraga = (odabranaPretraga, { action }) => {
    //console.log("ODABRANA PRETRAGA", odabranaPretraga, action);
    if (action === "select-option") {
      if (odabranaPretraga.lab_sifra === "430050") {
        let tprprovjera = odabranePretrage.find((p) => p.lab_sifra === "15140");
        if (tprprovjera === undefined) {
          let usluga_sif =
            checked.komerc === true ? tpr[0].komerc_sif : tpr[0].usluga_sif;
          let usluga_cijena =
            checked.komerc === true
              ? tpr[0].mpc_cijena
              : checked.neosiguran === true
              ? tpr[0].fond_cijena
              : tpr[0].fond_participacija;
          setOdabranePretrage([
            ...odabranePretrage,
            {
              id: Number(tpr[0].pretraga_id),
              lab_sifra: tpr[0].labmedic_sifra,
              sifra_usluge: usluga_sif,
              pretraga_code: tpr[0].pretraga_code,
              naziv: tpr[0].pretraga_naz,
              cijena: usluga_cijena,
              fond_participacija: tpr[0].fond_participacija,
              mpc_cijena: tpr[0].mpc_cijena,
              fond_cijena: tpr[0].fond_cijena,
              kolicina: 1,
            },
          ]);
        }
      }
      let sifra_proizvoda =
        checked.komerc === true
          ? odabranaPretraga.komerc_sif
          : odabranaPretraga.usluga_sif;
      let cijena =
        checked.komerc === true
          ? odabranaPretraga.mpc_cijena
          : checked.neosiguran === true
          ? odabranaPretraga.fond_cijena
          : odabranaPretraga.fond_participacija;

      setOdabranePretrage([
        ...odabranePretrage,
        {
          id: odabranaPretraga.value, //ovdje ga pretvara u broj
          lab_sifra: odabranaPretraga.lab_sifra,
          sifra_usluge: sifra_proizvoda,
          pretraga_code: odabranaPretraga.pretraga_code,
          naziv: odabranaPretraga.pretraga_naz,
          cijena: cijena,
          fond_participacija: odabranaPretraga.fond_participacija,
          fond_cijena: odabranaPretraga.fond_cijena,
          mpc_cijena: odabranaPretraga.mpc_cijena,
          kolicina: 1,
        },
      ]);
      notifikacija(true, "Laboratorijska pretraga unešena!", "success", 1000);
    }
    if (action === "dodaj") {
      const existingPretraga = odabranePretrage.find(
        (pretraga) => pretraga.id === odabranaPretraga.id
      );
      if (existingPretraga) {
        setOdabranePretrage(
          odabranePretrage.map((pretraga) =>
            pretraga.id === odabranaPretraga.id
              ? { ...pretraga, kolicina: pretraga.kolicina + 1 }
              : pretraga
          )
        );
      }
      notifikacija(
        true,
        "Količina laboratorijska pretraga povećana!",
        "success",
        1000
      );
    }
    if (action === "oduzmi") {
      const existingPretraga = odabranePretrage.find(
        (pretraga) => pretraga.id === odabranaPretraga.id
      );
      if (existingPretraga) {
        if (existingPretraga.kolicina === 1) {
          setOdabranePretrage(
            odabranePretrage.filter(
              (pretraga) => pretraga.id !== odabranaPretraga.id
            )
          );
        } else {
          setOdabranePretrage(
            odabranePretrage.map((pretraga) =>
              pretraga.id === odabranaPretraga.id
                ? { ...pretraga, kolicina: pretraga.kolicina - 1 }
                : pretraga
            )
          );
        }
      }
      notifikacija(
        true,
        "Količina laboratorijska pretraga umanjena!",
        "success",
        1000
      );
    }
    if (action === "obrisi") {
      setOdabranePretrage(
        odabranePretrage.filter(
          (pretraga) => pretraga.id !== odabranaPretraga.id
        )
      );
      notifikacija(true, "Laboratorijska pretraga obrisana!", "success", 1000);
    }
  };
  //console.warn("ODABRANE PRETRAGE", odabranePretrage);
  //console.log("CHECKED", checked);
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
  const validSifre = ["0020", "0022"];
  return (
    <Popup
      title={`PROVJERA CIJENE PRETRAGA - U UPUTNICI`}
      openPopup={true}
      setOpenPopup={closeProvjeraCijene}
      backdropNonClose={true}
      fullWidth={true}
      maxWidth={"md"}
    >
      <div className="provjera_cijene">
        <Select
          placeholder="Pretraži i izaberi lab. pretragu"
          options={opcijeSve}
          isSearchable
          isClearable
          color="var(--color-labos-400)"
          onChange={handlePretraga}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              marginRight: "1rem",
            }),
          }}
          components={{ DropdownIndicator }}
        />
        <FormGroup sx={{ flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Checkbox
                name="komerc"
                checked={checked.komerc}
                onChange={handleCheck}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Komercijalno"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="neosiguran"
                checked={checked.neosiguran}
                onChange={handleCheck}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Neosiguran"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="osiguran"
                checked={checked.osiguran}
                onChange={handleCheck}
                inputProps={{ "aria-label": "controlled" }}
              />
            }
            label="Osiguran - OZ"
          />
        </FormGroup>
      </div>
      {odabranePretrage.length === 0 && (
        <p className="objava">
          Izaberite laboratorijske pretrage iz padajućeg menija. Ako želite
          dodati više pretraga, ponovite postupak. Tip osiguranika je
          podrazumjevano OZ, po potrebi mjenjajte u neosiguran ili komercijalna
          naplata. Kada završite sa dodavanjem pretraga, kliknite na dugme "X"
          da biste zatvorili prozor. NAPOMENA: komercijalne i fond cijene se
          razlikuju!
        </p>
      )}
      {odabranePretrage.length > 0 && (
        <div className="lista_dodatih_usluga cijene">
          <p>Izabrane laboratorijske pretrage:</p>
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
            {odabranePretrage
              .sort((a, b) => Number(a.id) - Number(b.id))
              .map((pretraga) => (
                <li key={pretraga.id}>
                  <div className="dodata_pretraga">
                    <div>{pretraga.lab_sifra}</div>
                    <div>{pretraga.naziv}</div>
                    <div>{pretraga.sifra_usluge}</div>
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
                      {pretraga.kolicina === undefined ? 1 : pretraga.kolicina}
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
                        {checked.komerc === true
                          ? `${(
                              pretraga.kolicina * pretraga.mpc_cijena
                            ).toFixed(2)} KM`
                          : checked.neosiguran === true
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
          <div>UKUPNA CIJENA: {`${Number(ukupno).toFixed(2)} KM`}</div>
        </div>
      )}
    </Popup>
  );
};

export default ProvjeraCijene;
