import Select from "react-select";
import "./DizajnFormi.css";
import { useFormik } from "formik";
import { useStore } from "../../../../store";
import { useState, useEffect } from "react";

const PretragaIzmjenaForm = () => {
  const pretrage = useStore((store) => store.pretrage);
  const pretragaZaIzmjenu = useStore((store) => store.pretragaZaIzmjenu);
  const [podGrupe, setPodGrupe] = useState();
  const [grupePretraga, setGrupePretraga] = useState();
  const [pozicija, setPozicija] = useState();
  const [igg, setIgg] = useState();
  const [ipg, setIpg] = useState();
  const [igu, setIgu] = useState();

  const gg = pretrage.map((u) => {
    return { value: u.pretrage_grupa, label: u.pretrage_grupa };
  });
  const key = "label";
  const glavneGrupe = [
    ...new Map(gg.map((item) => [item[key], item])).values(),
  ];

  let izabranaGG =
    igg === undefined
      ? {
          label: pretragaZaIzmjenu.pretrage_grupa,
          value: pretragaZaIzmjenu.pretrage_grupa,
        }
      : igg;

  let izabranaPG =
    ipg === undefined
      ? {
          label: pretragaZaIzmjenu.pretrage_podgrupa,
          value: pretragaZaIzmjenu.pretrage_podgrupa,
        }
      : ipg;

  let izabranaGrupa =
    igu === undefined
      ? {
          label: pretragaZaIzmjenu.grupa_pretraga,
          value: pretragaZaIzmjenu.grupa_pretraga,
        }
      : igu;

  let postojecaPozicija =
    pozicija === undefined
      ? {
          value: pretragaZaIzmjenu.redni_br,
          label:
            pretragaZaIzmjenu.redni_br + " - " + pretragaZaIzmjenu.pretraga_naz,
        }
      : pozicija;

  useEffect(() => {
    const pgfiltrirane = pretrage.filter((u) => {
      if (igg === undefined) {
        return true;
      }
      if (u.pretrage_grupa === igg.value) {
        return true;
      } else return null;
    });
    const pg = pgfiltrirane.map((u) => {
      return { value: u.pretrage_podgrupa, label: u.pretrage_podgrupa };
    });
    const podGrupe = [...new Map(pg.map((item) => [item[key], item])).values()];
    setPodGrupe(podGrupe);
  }, [pretrage, igg, pretragaZaIzmjenu]);

  useEffect(() => {
    const gufiltrirane = pretrage.filter((u) => {
      if (ipg === undefined) {
        return true;
      }
      if (u.pretrage_podgrupa === ipg.value) {
        return true;
      } else return null;
    });
    const gu = gufiltrirane.map((u) => {
      return { value: u.grupa_pretraga, label: u.grupa_pretraga };
    });
    const grupaPretraga = [
      ...new Map(gu.map((item) => [item[key], item])).values(),
    ];
    setGrupePretraga(grupaPretraga);
  }, [pretrage, ipg, pretragaZaIzmjenu]);

  useEffect(() => {
    const gufiltrirane = pretrage.filter((u) => {
      if (u.grupa_pretraga === izabranaGrupa.value) {
        return true;
      } else return null;
    });
    const grupaPretraga = gufiltrirane.map((u) => {
      return { value: u.redni_br, label: u.redni_br + " " + u.pretraga_naz };
    });
    setPozicija(grupaPretraga);
  }, [pretrage, igu, izabranaGrupa.value]);

  const formik = useFormik({
    initialValues: {
      glavnaGrupa: izabranaGG.value, //igg === undefined ? izabranaGG.value : "",
      podGrupa: "", //ipg === undefined ? izabranaPG.value : "",
      grupa: "", //igu === undefined ? izabranaGrupa.value : "",
      naziv: pretragaZaIzmjenu.pretraga_naz,
      sifra: "",
      pozicija: pretragaZaIzmjenu.redni_br,
      aktivno: pretragaZaIzmjenu.aktivno,
    },
    /*  validate: (values) => {
      let errors = {};
      if (!values.glavnaGrupa) {
        errors.glavnaGrupa = "Obavezan unos !";
      }
      if (!values.podGrupa) {
        errors.podGrupa = "Obavezan unos !";
      }
      if (!values.grupa) {
        errors.grupa = "Obavezan unos !";
      }
      if (!values.naziv) {
        errors.naziv = "Obavezan unos !";
      }
      if (!values.sifra) {
        errors.sifra = "Obavezan unos !";
        //validacija postojanja sifre
      }
      if (!values.pozicija) {
        errors.pozicija = "Obavezan unos !";
      }
      return errors;
    }, */
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const selectStyle = {
    control: (styles, state) => ({
      ...styles,
      borderWidth: "1px",
      "&:hover": {
        borderColor: "#6b7fd7",
      },
      borderColor: state.isFocused ? "#6b7fd7" : "#84dcc6",
      borderRadius: "5px",
      fontSize: "0.9em",
      marginTop: "0.25em",
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "#0e5959",
    }),
    menu: (styles) => ({
      ...styles,
      color: "#104040",
    }),
  };

  //console.log("pretragaZaIzmjenu", pretragaZaIzmjenu);
  //console.log("glavneGrupa", glavneGrupe);
  //console.log("igg", igg);
  //console.log("izabranaGG", izabranaGG);
  //console.log("ipg", ipg);
  //console.log("izabranaPG", izabranaPG);
  //console.log("podGrupe", podGrupe);
  //console.log("igu", igu);
  //console.log("izabranaGrupa", izabranaGrupa);
  //console.log("grupa usluga", grupeUsluga);
  //console.log("OSVJEŽENJE");
  return (
    <form className="izmjena_usluge_forma" onSubmit={formik.handleSubmit}>
      <div className="izmjeni_uslugu">
        <div>
          <label>
            Glavna grupa pretraga
            <Select
              id="glavnaGrupa"
              name="glavnaGrupa"
              placeholder="Izaberi glavnu grupu.."
              defaultValue={izabranaGG}
              options={glavneGrupe}
              color="var(--color-labos-400)"
              onChange={(option) => {
                let event = {
                  target: { name: "glavnaGrupa", value: option.value },
                };
                formik.handleChange(event);
                setIgg(option);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "glavnaGrupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.glavnaGrupa && formik.errors.glavnaGrupa ? (
            <div className="greska">{formik.errors.glavnaGrupa}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label>
            Podgrupa pretraga
            <Select
              id="podGrupa"
              name="podGrupa"
              placeholder="Izaberi podgrupu.."
              defaultValue={izabranaPG}
              options={podGrupe}
              color="var(--color-labos-400)"
              onChange={(option) => {
                let event = {
                  target: { name: "podGrupa", value: option.value },
                };
                formik.handleChange(event);
                setIpg(option);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "podGrupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.podGrupa && formik.errors.podGrupa ? (
            <div className="greska">{formik.errors.podGrupa}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label>
            Grupa pretraga
            <Select
              id="grupa"
              name="grupa"
              placeholder="Izaberi grupu.."
              defaultValue={izabranaGrupa}
              options={grupePretraga}
              color="var(--color-labos-400)"
              onChange={(option) => {
                let event = {
                  target: { name: "grupa", value: option.value },
                };
                formik.handleChange(event);
                setIgu(option);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "grupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.grupa && formik.errors.grupa ? (
            <div className="greska">{formik.errors.grupa}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label htmlFor="naziv">Naziv lab. pretrage</label>
          <input
            id="naziv"
            name="naziv"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.naziv}
            placeholder="Unesite naziv.."
          />
          {formik.touched.naziv && formik.errors.naziv ? (
            <div className="greska">{formik.errors.naziv}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label htmlFor="sifra">Šifra pretrage</label>
          <input
            id="sifra"
            name="sifra"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.sifra}
            placeholder="Unesite šifru.."
          />
          {formik.touched.sifra && formik.errors.sifra ? (
            <div className="greska">{formik.errors.sifra}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label>
            Pozicija unutar grupe pretraga
            <Select
              id="pozicija"
              name="pozicija"
              placeholder="Izaberi poziciju u grupi.."
              defaultValue={postojecaPozicija}
              options={pozicija}
              color="var(--color-labos-400)"
              onChange={(option) => {
                let event = {
                  target: { name: "pozicija", value: option.value },
                };
                formik.handleChange(event);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "pozicija" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.pozicija && formik.errors.pozicija ? (
            <div className="greska">{formik.errors.pozicija}</div>
          ) : (
            <div className="greska_sakrij">Placeholder</div>
          )}
        </div>
        <div>
          <label htmlFor="aktivna" className="aktivna">
            Aktivna:
          </label>
          <input
            type="checkbox"
            id="aktivna"
            name="aktivno"
            onClick={() => {
              //console.log("formik.aktivno", formik.values.aktivno);
              //console.log("valueAktivno", formik.values.aktivno === 1 ? 0 : 1);
              let event = {
                target: {
                  name: "aktivno",
                  value: formik.values.aktivno === 1 ? 0 : 1,
                },
              };
              formik.handleChange(event);
            }}
            checked={formik.values.aktivno === 1 ? true : false}
          />
        </div>
      </div>
      <div className="dugme slanje">
        <button type="submit">IZMJENI !</button>
      </div>
    </form>
  );
};

export default PretragaIzmjenaForm;
