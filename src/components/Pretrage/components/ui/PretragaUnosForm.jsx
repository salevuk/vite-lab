import "./DizajnFormi.css";
import { useFormik } from "formik";
import { useStore } from "../../store";
import { useState, useEffect } from "react";
import Select from "react-select";

const PretragaUnosForm = () => {
  const pretrage = useStore((store) => store.pretrage);
  const [izabranaGgrupa, setIzabranaGgrupa] = useState();
  const [izabranaPodGrupa, setIzabranaPodGrupa] = useState();
  const [izabranaGrupaUsluga, setIzabranaGrupaUsluga] = useState();
  const [podGrupaNiz, setPodGrupaNiz] = useState();
  const [grupaUslugaNiz, setGrupaUslugaNiz] = useState();
  const [grupaUslugaPozicija, setGrupaUslugaPozicija] = useState();

  const gg = pretrage.map((u) => {
    return { value: u.usluga_grupa, label: u.usluga_grupa };
  });
  const key = "label";
  const glavneGrupe = [
    ...new Map(gg.map((item) => [item[key], item])).values(),
  ];

  useEffect(() => {
    const pgfiltrirane = pretrage.filter((u) => {
      if (izabranaGgrupa === undefined) {
        return true;
      }
      if (u.usluga_grupa === izabranaGgrupa) {
        return true;
      } else return null;
    });
    const pg = pgfiltrirane.map((u) => {
      return { value: u.usluga_podgrupa, label: u.usluga_podgrupa };
    });
    const key = "label";
    const podGrupe = [...new Map(pg.map((item) => [item[key], item])).values()];
    setPodGrupaNiz(podGrupe);
  }, [pretrage, izabranaGgrupa]);

  useEffect(() => {
    const gufiltrirane = pretrage.filter((u) => {
      if (izabranaPodGrupa === undefined) {
        return true;
      }
      if (u.usluga_podgrupa === izabranaPodGrupa) {
        return true;
      } else return null;
    });
    const gu = gufiltrirane.map((u) => {
      return { value: u.grupa_usluga, label: u.grupa_usluga };
    });
    const key = "label";
    const grupaUsluga = [
      ...new Map(gu.map((item) => [item[key], item])).values(),
    ];
    setGrupaUslugaNiz(grupaUsluga);
  }, [pretrage, izabranaPodGrupa]);

  useEffect(() => {
    const gufiltrirane = pretrage.filter((u) => {
      if (izabranaGrupaUsluga === undefined) {
        return true;
      }
      if (u.grupa_usluga === izabranaGrupaUsluga) {
        return true;
      } else return null;
    });
    const grupaUsluga = gufiltrirane.map((u) => {
      return { value: u.redni_br, label: u.redni_br + " " + u.usluga_naz };
    });
    setGrupaUslugaPozicija(grupaUsluga);
  }, [pretrage, izabranaGrupaUsluga]);

  //const glavneGrupe = [...new Set(gg)];

  const formik = useFormik({
    initialValues: {
      glavnaGrupa: "",
      podGrupa: "",
      grupa: "",
      naziv: "",
      sifra: "",
      pozicija: "",
    },
    validate: (values) => {
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
    },
    //validateOnChange: false,
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
  //console.log("pretrage", pretrage);
  //console.log("izabranaGrupa", izabranaGgrupa);
  //console.log("errors", formik.errors);
  //console.log("visited", formik.touched);
  //console.log("izabranaPodGrupa", izabranaPodGrupa);
  //console.log("podGrupaNiz", podGrupaNiz);
  //console.log("grupaUslugaNiz", grupaUslugaNiz);
  return (
    <form className="usluga_forma" onSubmit={formik.handleSubmit}>
      <div className="dodaj_uslugu">
        <div>
          <label>
            Glavna grupa pretraga
            <Select
              id="glavnaGrupa"
              name="glavnaGrupa"
              placeholder="Izaberi glavnu grupu.."
              options={glavneGrupe}
              color="var(--color-labos-400)"
              onChange={(option) => {
                let event = {
                  target: { name: "glavnaGrupa", value: option.value },
                };
                formik.handleChange(event);
                setIzabranaGgrupa(option.value);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "glavnaGrupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.glavnaGrupa && formik.errors.glavnaGrupa ? (
            <div className="greska">{formik.errors.glavnaGrupa}</div>
          ) : null}
        </div>
        <div>
          <label>
            Podgrupa pretraga
            <Select
              id="podGrupa"
              name="podGrupa"
              placeholder="Izaberi podgrupu.."
              options={podGrupaNiz}
              color="var(--color-labos-400)"
              isDisabled={izabranaGgrupa === undefined ? true : false}
              onChange={(option) => {
                let event = {
                  target: { name: "podGrupa", value: option.value },
                };
                formik.handleChange(event);
                setIzabranaPodGrupa(option.value);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "podGrupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.podGrupa && formik.errors.podGrupa ? (
            <div className="greska">{formik.errors.podGrupa}</div>
          ) : null}
        </div>
        <div>
          <label>
            Grupa pretraga
            <Select
              id="grupa"
              name="grupa"
              placeholder="Izaberi grupu.."
              options={grupaUslugaNiz}
              color="var(--color-labos-400)"
              isDisabled={izabranaPodGrupa === undefined ? true : false}
              onChange={(option) => {
                let event = {
                  target: { name: "grupa", value: option.value },
                };
                formik.handleChange(event);
                setIzabranaGrupaUsluga(option.value);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "grupa" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.grupa && formik.errors.grupa ? (
            <div className="greska">{formik.errors.grupa}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="naziv">Naziv pretrage</label>
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
          ) : null}
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
          ) : null}
        </div>
        <div>
          <label>
            Pozicija unutar grupe pretraga
            <Select
              id="pozicija"
              name="pozicija"
              placeholder="Izaberi poziciju u grupi.."
              options={grupaUslugaPozicija}
              color="var(--color-labos-400)"
              isDisabled={izabranaGrupaUsluga === undefined ? true : false}
              onChange={(option) => {
                let event = {
                  target: { name: "pozicija", value: option.value },
                };
                formik.handleChange(event);
                //setIzabranaPodGrupa(option.value);
              }}
              onBlur={() => {
                formik.handleBlur({ target: { name: "pozicija" } });
              }}
              styles={selectStyle}
            />
          </label>
          {formik.touched.pozicija && formik.errors.pozicija ? (
            <div className="greska">{formik.errors.pozicija}</div>
          ) : null}
        </div>
      </div>
      <div className="dugme unos">
        <button type="submit">UNESI NOVU PRETRAGU</button>
      </div>
    </form>
  );
};

export default PretragaUnosForm;
