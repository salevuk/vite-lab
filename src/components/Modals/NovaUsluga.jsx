import { useEffect /*  useState  */ } from "react";
import { useStore } from "../../store";
import { Form, useForm } from "../UI/Forms/useForm";
import { TextField } from "@mui/material";
import Controls from "../UI/Controls/Controls";
import Popup from "../UI/Forms/Popup";
//import { useQueryClient } from "@tanstack/react-query";

const NovaUsluga = ({
  closeModal,
  uslugaForEdit, //podaci pretrage
  notifikacija,
  izmjena,
}) => {
  //const queryClient = useQueryClient();

  const tipoviUsluga = [
    { value: 1, label: "Nekomercijalna" },
    { value: 2, label: "Komercijalna" },
  ];

  const initialFValues = {
    id: "",
    new_usluga_sif: "",
    usluga_naz: "",
    tip_usluge: 1,
    vpc: "",
    mpc: "",
    fond_cijena: "",
    fond_participacija: "",
    fisk_sif: "",
    pdv: "",
  };
  //console.warn("USLUGA FOR EDIT", uslugaForEdit);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    //console.log("fieldvalues nova pretraga", fieldValues);
    if ("new_usluga_sif" in fieldValues) {
      temp.new_usluga_sif =
        fieldValues.new_usluga_sif.length >= 4
          ? fieldValues.new_usluga_sif.length > 14
            ? "Unesite max 14 karaktera"
            : ""
          : "Šifra mora imati min 4 cifre";
    }
    if ("usluga_naz" in fieldValues) {
      temp.usluga_naz =
        fieldValues.usluga_naz.length > 80 ? "Unesite max 80 karaktera" : "";
    }
    /* if ("vpc" in fieldValues) {
      ovdje mi treba kontrola da li je upisan novčani iznos u obliku 100,00 ako je umjesto zareza stavljena tačka pretvoriti je u zarez 
    }
    if ("mpc" in fieldValues) {
      temp.mpc = fieldValues.mpc.length > 50 ? "Unesite max 50 karaktera" : "";
    }
    if ("fond_cijena" in fieldValues) {
      temp.fond_cijena =
        fieldValues.fond_cijena.length > 50 ? "Unesite max 50 karaktera" : "";
    }
    if ("fond_participacija" in fieldValues) {
      temp.fond_participacija =
        fieldValues.fond_participacija.length > 12
          ? "Unesite max 12 karaktera"
          : "";
    } */
    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    validateOnSubmit,
  } = useForm(initialFValues, true, validate);

  const provjeraUsluge = async () => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=provjera_usluge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          sifra: values.new_usluga_sif,
        }),
      }
    );
    const data = await response.json();
    return data;
  };

  const postUslugaData = async () => {
    const newData = new URLSearchParams();
    newData.append("tip", izmjena ? "izmjena" : "unos");
    newData.append("id", izmjena ? uslugaForEdit.id : "");
    newData.append("komerc", values.tip_usluge);
    newData.append("usluga_sif", values.new_usluga_sif);
    newData.append("usluga_naz", values.usluga_naz);
    newData.append("vpc", values.vpc);
    newData.append("mpc", values.mpc);
    newData.append("fond_cijena", values.fond_cijena);
    newData.append("fond_participacija", values.fond_participacija);
    newData.append("fisk_sif", values.fisk_sif);

    const response = await fetch(
      `../rpc/laboratorija.cfc?method=unos_nove_usluge`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    if (response.ok) {
      closeModal();
      if (izmjena) {
        notifikacija(
          true,
          "Izmjene podataka je uspješno sačuvana !",
          "success",
          3000
        );
      } else {
        notifikacija(
          true,
          "Nova usluga je uspješno sačuvana !",
          "success",
          3000
        );
      }
      if (
        useStore.getState().prikazi.naziv === "komercijalne_usluge" ||
        useStore.getState().prikazi.naziv === "usluge_lab" ||
        useStore.getState().prikazi.naziv === "uslugeukc"
      ) {
        useStore.setState({ invalidateSifrarnikPretrage: true });
      }
    } else {
      if (izmjena) {
        notifikacija(
          true,
          "Izmjena podataka nije sačuvana, došlo je do greške!",
          "error",
          3000
        );
      } else {
        notifikacija(
          true,
          "Nova usluga nije sačuvana, došlo je do greške!",
          "error",
          3000
        );
      }
    }
    //return response.json();
  };

  const handleUslugaSubmit = async () => {
    await validateOnSubmit().then((isValidated) => {
      if (isValidated) {
        if (!izmjena) {
          provjeraUsluge().then((res) => {
            if (res.poruka === 0) {
              postUslugaData();
            } else {
              notifikacija(true, "Usluga već postoji u bazi!", "error", 3000);
            }
          });
        } else {
          postUslugaData();
        }
      } else {
        notifikacija(
          true,
          "Molimo ispravno popunite tražene podatke!",
          "error",
          3000
        );
      }
    });
  };
  const preventDefaultHandler = (ev) => {
    ev.preventDefault();
  };

  useEffect(() => {
    if (!izmjena) return;

    if (Object.keys(uslugaForEdit).length > 0) {
      setValues({
        ...uslugaForEdit,
      });
    } // eslint-disable-next-line
  }, [uslugaForEdit, setValues]);
  console.warn("NOVA USLUGA values", values);
  const pretragaPolja = (
    <Form onSubmit={preventDefaultHandler}>
      <div className="pozadina_polja maticni_podaci uputnica usluga">
        <div>
          <Controls.Input
            name="new_usluga_sif"
            label="Šifra usluge:"
            //disabled={izmjena}
            value={izmjena ? uslugaForEdit.usluga_sif : values.new_usluga_sif}
            onChange={handleInputChange}
            onFocus={() => validate({ new_usluga_sif: values.new_usluga_sif })}
            error={errors.new_usluga_sif}
            size="small"
          />
          <Controls.Input
            name="usluga_naz"
            label="Naziv usluge:"
            value={values.usluga_naz}
            onChange={handleInputChange}
            onFocus={() => validate({ usluga_naz: values.usluga_naz })}
            error={errors.usluga_naz}
            size="small"
          />
        </div>
        <div>
          <Controls.Select
            //disablePortal
            size="small"
            blurOnSelect
            id="tip_usluge"
            name="tip_usluge"
            label="Tip usluge"
            disabled={izmjena}
            value={values.tip_usluge}
            sx={{ display: "flex", maxWidth: "220px" }}
            onChange={(e) => handleInputChange(e)}
            options={tipoviUsluga}
            error={errors.tip_usluge}
          />
          <Controls.Input
            name="vpc"
            disabled={values.tip_usluge === 1}
            label="VPC:"
            value={values.vpc}
            onChange={handleInputChange}
            onFocus={() => validate({ vpc: values.vpc })}
            error={errors.vpc}
            size="small"
          />
          <Controls.Input
            name="mpc"
            label={"Komercijalna cijena (MPC):"}
            value={values.mpc}
            onChange={handleInputChange}
            onFocus={() => validate({ mpc: values.mpc })}
            error={errors.mpc}
            size="small"
          />
        </div>
        <div>
          <Controls.Input
            name="fond_cijena"
            label="Fond cijena:"
            disabled={values.tip_usluge === 2}
            value={values.fond_cijena}
            onChange={handleInputChange}
            onFocus={() => validate({ fond_cijena: values.fond_cijena })}
            error={errors.fond_cijena}
            size="small"
          />
          <Controls.Input
            name="fond_participacija"
            label="Participacija:"
            disabled={values.tip_usluge === 2}
            value={values.fond_participacija}
            onChange={handleInputChange}
            error={errors.fond_participacija}
            size="small"
          />
          <Controls.Input
            name="fisk_sif"
            label="Fisk. šifra (za nekomercijalne):"
            disabled={values.tip_usluge === 2}
            value={values.fisk_sif}
            onChange={handleInputChange}
            error={errors.fisk_sif}
            size="small"
          />
        </div>

        {/* <div>
          <Controls.Input
            name="usluga_sif"
            //InputLabelProps={{ shrink: Boolean(values.telefon) }}
            label="Šifra usluge:"
            value={values.usluga_sif}
            onChange={handleInputChange}
            error={errors.usluga_sif}
            size="small"
          />
          <Controls.Input
            name="komerc_sif"
            //InputLabelProps={{ shrink: Boolean(values.email) }}
            label="Komercijalna šifra usluge:"
            value={values.komerc_sif}
            onChange={handleInputChange}
            error={errors.komerc_sif}
            size="small"
          />
          <Controls.Select
            name="fond"
            label="Fond:"
            sx={{ maxWidth: "15% !important" }}
            value={values.fond}
            onChange={(ev) => handleInputChange(ev)}
            options={fondOptions}
            error={errors.fond}
          ></Controls.Select>
        </div> */}

        <div className="button_container">
          <Controls.MyButton onClick={closeModal} text="Otkaži" />
          <Controls.MyButton
            onClick={handleUslugaSubmit}
            type="submit"
            text="Sačuvaj"
            color="success"
          />
        </div>
      </div>
    </Form>
  );

  return (
    <Popup
      title={
        izmjena ? `Izmjena podataka usluge` : `Unos nove usluge u bazu podataka`
      }
      openPopup={true}
      setOpenPopup={closeModal}
      fullWidth={true}
      maxWidth={"md"}
    >
      {pretragaPolja}
    </Popup>
  );
};

export default NovaUsluga;
