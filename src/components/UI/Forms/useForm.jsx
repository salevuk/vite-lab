import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import dayjs from "dayjs";

export function useForm(initialFValues, validateOnChange, validate) {
  const [values, setValues] = useState(initialFValues);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    /* setValues({
      ...values,
      [name]: value,
    }); */
    if (
      name === "prezime" ||
      name === "ime" ||
      name === "jmbg" ||
      name === "pol" ||
      name === "datum_rodjenja" ||
      name === "adresa_pacijenta" ||
      name === "telefon" ||
      name === "email" ||
      name === "ime_roditelja" ||
      name === "usluga_naz" ||
      name === "vpc" ||
      name === "mpc" ||
      name === "vpc_mpc" ||
      name === "fond_cijena" ||
      name === "fond_participacija" ||
      name === "fisk_sif"
    ) {
      if (!isDirty) {
        setIsDirty(true);
      }
    }
    const trimNames = [
      //"napomena",
      //"adresa_pacijenta",
      "prezime",
      "ime",
      "ime_roditelja",
      "jmbg",
      "broj",
      "jmbg_majke",
      "broj_epizode",
      "broj_protokola",
      "nosilac_jmbg",
      //"telefon",
      "email",
      "diureza",
      "tezina",
      "visina",
      "pretraga_sif",
      //"pretraga_code",
      //"pretraga_naz",
      //"pretraga_naz_graf",
      "ref",
      "jm",
      "materijal_sif",
      "usluga_sif",
      "komerc_sif",
      "fisk_sif",
      //"usluga_naz"
    ];
    const isTrim = trimNames.includes(name);
    setValues({
      ...values,
      [name]: isTrim ? value.trim() : value,
    });
    if (name === "status_osiguranja") {
      if (value === true || value === "1") {
        setValues({
          ...values,
          [name]: "1",
          /* [name]: value === true ? "1" : "0", */
        });
      }
      if (value === false || value === "0") {
        setValues({
          ...values,
          [name]: "0",
          ["bez_participacije"]: false,
          ["vid_osiguranja"]: 0,
        });
      }
    }
    if (name === "bez_participacije" && value === false) {
      setValues({
        ...values,
        ["osnov_oslobadjanja"]: 0,
        [name]: value,
      });
    } else if (
      name === "bez_participacije" &&
      value === true &&
      (values.vid_osiguranja === 6 ||
        values.vid_osiguranja === 0 ||
        values.vid_osiguranja === "")
    ) {
      setValues({
        ...values,
        ["vid_osiguranja"]: 1,
        [name]: value,
      });
    }
    if (name === "vid_osiguranja") {
      //console.warn("vid_osiguranja", value);
      if (value === 1) {
        if (values.bez_participacije === true) {
          setValues({
            ...values,
            ["status_osiguranja"]: "1",
            [name]: value,
          });
        } else {
          setValues({
            ...values,
            ["bez_participacije"]: true,
            ["status_osiguranja"]: "1",
            [name]: value,
          });
        }
      }
      if (value === 0) {
        setValues({
          ...values,
          ["status_osiguranja"]: "0",
          //["komerc_placanje"]: true,
          [name]: value,
        });
      }
    }
    if (name === "po_ugovoru" || name === "komerc_placanje") {
      setValues({
        ...values,
        [name]: value,
        ["bez_participacije"]: "",
        ["osnov_oslobadjanja"]: "",
      });
    }
    if (
      name === "visina_pacijenta" ||
      name === "tezina_pacijenta" ||
      name === "diureza" ||
      name === "usluga_sif"
    ) {
      setValues({
        ...values,
        [name]: value.replace(/[^0-9.]*/g, ""),
      });
    }
    /* if (name === "vpc" || name === "mpc" || name === "vpc_mpc" || name === "fond_cijena" || name===="fond_participacija") {
     
     
    } */
    if (validateOnChange) validate({ [name]: value });
  };

  const handleOslobadjanjeChange = (e, newValue) => {
    setValues({
      ...values,
      osnov_oslobadjanja: newValue === null ? 0 : newValue.value,
    });
  };

  const handleSGChange = (e, newValue) => {
    setValues({
      ...values,
      skladiste_grupa: newValue === null ? "" : newValue.value,
    });
    if (validateOnChange && newValue !== null)
      validate({ skladiste_grupa: newValue.value });
  };

  const handleSkladisteChange = (e, newValue) => {
    setValues({
      ...values,
      skladiste: newValue === null ? "" : newValue.value,
      naziv_skladista: newValue === null ? "" : newValue.label,
    });
    if (validateOnChange && newValue !== null)
      validate({ skladiste: newValue.value });
  };

  const handleKategorijaChange = (e, newValue) => {
    const obPripadnici = [
      9, 13, 14, 20, 57, 58, 101, 102, 103, 104, 105, 106, 107, 108, 109, 111,
      112, 113,
    ];
    setValues({
      ...values,
      vid_osiguranja: obPripadnici.includes(newValue.value) ? 1 : 6,
      bez_participacije: obPripadnici.includes(newValue.value) ? true : false,
      kategorija_osiguranja: newValue.value === null ? "" : newValue.value,
      naziv_kategorije_osig: newValue.value === null ? "" : newValue.label,
    });
  };

  const handleOpstinaChange = (e, newValue) => {
    if (!isDirty) {
      setIsDirty(true);
    }
    setValues({
      ...values,
      opstina_id: newValue === null ? "" : newValue.value,
      opstina: newValue === null ? "" : newValue.label,
    });
  };

  const handleIdentifikatorChange = (e, newValue) => {
    setValues({
      ...values,
      identifikator: newValue === null ? "" : newValue.value,
    });
  };

  const handleUputioChange = (e, newValue) => {
    let ljekar = "";
    if (newValue !== null) {
      ljekar = newValue.label.split(" ");
    }
    setValues({
      ...values,
      uputio: newValue === null ? "" : newValue.value,
      ime_ljekara: newValue === null ? "" : ljekar[0],
      prezime_ljekara: newValue === null ? "" : ljekar[1],
    });
  };

  const handleDijagnozaChange = (e, newValue) => {
    setValues({
      ...values,
      dijagnoza_id: newValue === null ? "" : newValue.id,
      dijagnoza_sifra: newValue === null ? "" : newValue.value,
      vid_osiguranja: newValue.participacija === 0 ? 1 : values.vid_osiguranja,
      bez_participacije:
        newValue.participacija === 0 ? true : values.bez_participacije,
    });
  };

  function extractDatumRodjenja(jmbg) {
    if (
      typeof jmbg !== "string" ||
      jmbg.length !== 13 ||
      !/^\d{13}$/.test(jmbg)
    ) {
      throw new Error("Neispravan JMBG format");
    }

    let day = jmbg.substring(0, 2);
    let month = jmbg.substring(2, 4);
    let year = jmbg.substring(4, 7);
    // Ako je godina manja od 800, dodajemo 2000, inače 1000 tj. 1900 (jer se koriste 19xx i 20xx godine)
    let fullYear = parseInt(year, 10) < 800 ? `2${year}` : `1${year}`;

    return `${day}.${month}.${fullYear}`;
  }

  const validateOnSubmit = async () => {
    let temp = { ...errors };
    for (let key in values) {
      if (key === "broj" && values.vrsta === 1) {
        temp.broj =
          values[key] === ""
            ? ""
            : values[key].length >= 6
            ? values[key].length < 32
              ? ""
              : "Unesite max 32-cifreni broj"
            : "Broj mora imati min 6 cifara"; //broj protokol redomata
      }
      if (key === "jmbg" && values.identifikator === 1) {
        temp.jmbg =
          values[key] === ""
            ? values.po_ugovoru === "" || values.po_ugovoru === false
              ? "Obavezno polje."
              : values.po_ugovoru !== "" || values.po_ugovoru === true
              ? "Generišite JMBG"
              : ""
            : values[key].length === 13
            ? ""
            : "Unesite 13 cifara JMBG";
      }
      if (key === "jmbg" && values.identifikator !== 1) {
        temp.jmbg =
          values[key] !== ""
            ? values[key].length < 32
              ? ""
              : "Unesite max 32 karaktera"
            : "Obavezno polje.";
      }
      if (key === "prezime") {
        temp.prezime = values[key]
          ? values[key].length >= 3
            ? ""
            : "Minimum 3 slova"
          : "Obavezno polje.";
      }
      if (key === "ime") {
        temp.ime = values[key]
          ? values[key].length >= 2
            ? ""
            : "Minimum 3 slova"
          : "Obavezno polje.";
      }
      if (key === "pol") {
        temp.pol = values[key] !== "" ? "" : "Obavezno polje.";
      }
      if (key === "osnov_oslobadjanja") {
        temp.osnov_oslobadjanja =
          (values[key] === 0 || values[key] === "") &&
          values.bez_participacije === true &&
          values.vrsta === 1 &&
          values.komerc_placanje !== true &&
          values.po_ugovoru !== true
            ? "Obavezno polje. Ukoliko je oslobođen participacije osnov mora biti odabran!"
            : "";
      }
      if (key === "vid_osiguranja") {
        temp.vid_osiguranja =
          values[key] !== ""
            ? values.bez_participacije === true && values.vid_osiguranja === 6
              ? "Za oslobođene participacije promjenite u OB!"
              : values.status_osiguranja === "1" &&
                (values[key] === 0 || values[key] === "")
              ? "Osiguran pac. nemože imati vid osig. neosiguran"
              : ""
            : "Obavezno polje.";
      }
      if (key === "kategorija_osiguranja") {
        temp.kategorija_osiguranja =
          values.komerc_placanje === true ||
          values.po_ugovoru === true ||
          values.vid_osiguranja === 0 ||
          values.status_osiguranja === "0" ||
          values.status_osiguranja === ""
            ? ""
            : values[key] !== ""
            ? ""
            : "Obavezno polje.";
      }
      if (key === "datum_rodjenja") {
        const formattedDate = dayjs(values[key]).format("DD.MM.YYYY");
        temp.datum_rodjenja =
          values.identifikator === 1 &&
          formattedDate !== extractDatumRodjenja(values.jmbg) &&
          values.jmbg.slice(0, 4) !== "8000" &&
          values.jmbg.slice(0, 4) !== "5885"
            ? "Datum rođenja nije usklađen sa JMBG"
            : formattedDate === "Invalid Date" || values[key] === null
            ? "Obavezno polje."
            : "";
      }
      if (key === "broj_epizode") {
        temp.broj_epizode =
          values.vrsta === 1
            ? ""
            : values[key] === ""
            ? "Obavezno polje za bolničku uputnicu"
            : "";
      }
      if (key === "pretraga_sif") {
        temp.pretraga_sif = values[key]
          ? values[key].length < 3
            ? "Šifra mora imati minimum 3 cifre"
            : values[key].length > 8
            ? "Unesite max 8 karaktera"
            : ""
          : "Obavezno polje.";
      }
      if (key === "pretraga_code") {
        temp.pretraga_code = values[key]
          ? values[key].length > 10
            ? "Unesite max 10 karaktera"
            : ""
          : "Obavezno polje.";
      }
      if (key === "pretraga_naz") {
        temp.pretraga_naz = values[key]
          ? values[key].length > 50
            ? "Unesite max 50 karaktera"
            : ""
          : "Obavezno polje.";
      }
      if (key === "pretraga_naz_graf") {
        temp.pretraga_naz_graf = values[key]
          ? values[key].length > 50
            ? "Unesite max 50 karaktera"
            : ""
          : "Obavezno polje.";
      }
      if (key === "ref") {
        temp.ref = values[key].length > 50 ? "Unesite max 50 karaktera" : "";
      }
      if (key === "jm") {
        temp.jm = values[key].length > 12 ? "Unesite max 12 karaktera" : "";
      }
      if (key === "materijal_sif") {
        temp.materijal_sif =
          values[key].length > 3 ? "Unesite max 3 karaktera" : "";
      }
      if (key === "usluga_sif") {
        temp.usluga_sif =
          values[key].length > 8 ? "Unesite max 8 karaktera" : "";
      }
      if (key === "komerc_sif") {
        temp.komerc_sif =
          values[key].length > 8 ? "Unesite max 8 karaktera" : "";
      }
      if (key === "fond") {
        temp.fond = values[key] === "" ? "Obavezno polje." : "";
      }
      if (key === "new_usluga_sif" || key === "usluga_naz") {
        temp[key] =
          values[key] === ""
            ? key === "new_usluga_sif"
              ? "Obavezno polje. Ista kao fondovska ako je nekomercijalna"
              : "Obavezno polje."
            : "";
      }

      if (key === "fisk_sif" && values.tip_usluge === 1) {
        if (values[key] === "") {
          temp.fisk_sif = "Obavezno polje ukoliko je nekomercijalna usluga";
        } else if (!/^\d+$/.test(values[key])) {
          temp.fisk_sif = "Mora biti brojčana šifra.";
        } else {
          temp.fisk_sif = "";
        }
      }
      // Validacija za vpc, mpc, fond_cijena, fond_participacija
      let val = values[key];

      // vpc je obavezan ako je key === "vpc" && values.tip_usluge === 2
      if (key === "vpc" && values.tip_usluge === 2) {
        if (val === "" || val === null || val === undefined) {
          temp[key] = "Obavezno polje. Obično je ista kao MPC.";
        } else if (typeof val === "string" && val.includes(",")) {
          val = val.replace(",", ".");
          values[key] = val;
          if (!/^\d+(.\d{2})?$/.test(val)) {
            temp[key] = "Unesite iznos u formatu 100.00";
          } else {
            temp[key] = "";
          }
        } else if (!/^\d+(.\d{2})?$/.test(val)) {
          temp[key] = "Unesite iznos u formatu 100.00";
        } else {
          temp[key] = "";
        }
      }

      // mpc je obavezan ako je prazan
      if (key === "mpc") {
        if (val === "" || val === null || val === undefined) {
          temp[key] = "Obavezno polje.";
        } else if (typeof val === "string" && val.includes(",")) {
          val = val.replace(",", ".");
          values[key] = val;
          if (!/^\d+(.\d{2})?$/.test(val)) {
            temp[key] = "Unesite iznos u formatu 100.00";
          } else {
            temp[key] = "";
          }
        } else if (!/^\d+(.\d{2})?$/.test(val)) {
          temp[key] = "Unesite iznos u formatu 100,00";
        } else {
          temp[key] = "";
        }
      }

      // fond_cijena i fond_participacija su obavezni ako je tip_usluge === 1
      if (
        (key === "fond_cijena" || key === "fond_participacija") &&
        values.tip_usluge === 1
      ) {
        if (val === "" || val === null || val === undefined) {
          temp[key] =
            "Obavezno polje. Ukoliko ih nema u fond uslugama, postavite na 0.00";
        } else if (typeof val === "string" && val.includes(",")) {
          val = val.replace(",", ".");
          values[key] = val;
          if (!/^\d+(.\d{2})?$/.test(val)) {
            temp[key] = "Unesite iznos u formatu 100.00";
          } else {
            temp[key] = "";
          }
        } else if (!/^\d+(.\d{2})?$/.test(val)) {
          temp[key] = "Unesite iznos u formatu 100.00";
        } else {
          temp[key] = "";
        }
      }
    }

    setErrors({
      ...temp,
    });
    return !Object.values(temp).some((error) => error.length > 0);
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleSGChange,
    handleSkladisteChange,
    handleOslobadjanjeChange,
    handleKategorijaChange,
    handleOpstinaChange,
    handleIdentifikatorChange,
    handleUputioChange,
    handleDijagnozaChange,
    validateOnSubmit,
    isDirty,
  };
}

const useStyles = makeStyles((/* theme */) => ({
  root: {
    /* "& .MuiFormControl-root": {
      margin: "1px 3px",
    },
    "& .MuiAutocomplete-root": {
      margin: "1px 3px",
    }, */
    "& .MuiTypography-root": {
      fontFamily: "Inter !important",
    },
    "& .MuiFormLabel-root": {
      fontFamily: "Inter !important",
      fontSize: "0.9vw !important",
    },
    "& .MuiInputBase-root": {
      width: "100%",
      fontFamily: "Inter !important",
      fontSize: "0.9vw !important",
      fontWeight: "600 !important",
    },
    "& .MuiInputBase-input": {
      padding: "0.45vw 0.73vw !important",
    },
    "& .MuiAutocomplete-inputRoot": {
      paddingTop: "0 !important",
      paddingBottom: "0 !important",
      paddingLeft: "0 !important",
    },
    "& .MuiButtonBase-root": {
      fontFamily: "Inter !important",
    },
    "& .css-1hw9j7s, .css-5zrdtn": {
      //fontSize: "15px !important" /* "0.83vw !important", */,
      fontSize: "clamp(0.75rem, calc(1vw - 0.15rem), 0.95rem)",
      //padding: "4px 12px !important" /* "0.3vw 0.7vw !important", */,
      minWidth: "86px !important",
    },
  },
}));

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {children}
    </form>
  );
}
