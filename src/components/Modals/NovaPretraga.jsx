import { useEffect /*  useState  */ } from "react";
import { useStore } from "../../store";
import { Form, useForm } from "../UI/Forms/useForm";
import Controls from "../UI/Controls/Controls";
import Popup from "../UI/Forms/Popup";
import { useQueryClient } from "@tanstack/react-query";
//import TextField from "@mui/material/TextField";

const NovaPretraga = ({
  closeModal,
  pretragaForEdit, //podaci pretrage
  notifikacija,
  izmjena,
}) => {
  const queryClient = useQueryClient();

  const fondOptions = [
    { value: 0, label: "Ne" },
    { value: 1, label: "Da" },
  ];

  const initialFValues = {
    pretraga_sif: "",
    pretraga_code: "",
    pretraga_naz: "",
    pretraga_naz_graf: "",
    ref: "",
    jm: "",
    materijal_sif: "",
    usluga_sif: "",
    komerc_sif: "",
    fond: "",
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    //console.log("fieldvalues nova pretraga", fieldValues);
    if ("pretraga_sif" in fieldValues) {
      temp.pretraga_sif =
        fieldValues.pretraga_sif.length >= 3
          ? fieldValues.pretraga_sif.length > 8
            ? "Unesite max 8 karaktera"
            : ""
          : "Šifra mora imati min 3 cifre";
    }
    if ("pretraga_code" in fieldValues) {
      temp.pretraga_code =
        fieldValues.pretraga_code.length > 10 ? "Unesite max 10 karaktera" : "";
    }
    if ("pretraga_naz" in fieldValues) {
      temp.pretraga_naz =
        fieldValues.pretraga_naz.length > 50 ? "Unesite max 50 karaktera" : "";
    }
    if ("pretraga_naz_graf" in fieldValues) {
      temp.pretraga_naz_graf =
        fieldValues.pretraga_naz_graf.length > 50
          ? "Unesite max 50 karaktera"
          : "";
    }
    if ("ref" in fieldValues) {
      temp.ref = fieldValues.ref.length > 50 ? "Unesite max 50 karaktera" : "";
    }
    if ("jm" in fieldValues) {
      temp.jm = fieldValues.jm.length > 12 ? "Unesite max 12 karaktera" : "";
    }
    if ("materijal_sif" in fieldValues) {
      temp.materijal_sif =
        fieldValues.materijal_sif.length > 3 ? "Unesite max 3 karaktera" : "";
    }
    if ("usluga_sif" in fieldValues) {
      temp.usluga_sif =
        fieldValues.usluga_sif.length > 8 ? "Unesite max 8 cifara" : "";
    }
    if ("komerc_sif" in fieldValues) {
      temp.komerc_sif =
        fieldValues.komerc_sif.length > 8 ? "Unesite max 8 karaktera" : "";
    }
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

  const provjeraPretrage = async () => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=provjera_pretrage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          sifra: values.pretraga_sif,
        }),
      }
    );
    const data = await response.json();
    return data;
  };

  const postPretragaData = async () => {
    const newData = new URLSearchParams();
    newData.append("tip", izmjena ? "izmjena" : "unos");
    newData.append("id_pretrage", izmjena ? pretragaForEdit.id : "");
    newData.append("old_sif", izmjena ? pretragaForEdit.pretraga_sif : "");
    newData.append("pretraga_sif", values.pretraga_sif);
    newData.append("pretraga_code", values.pretraga_code);
    newData.append("pretraga_naz", values.pretraga_naz);
    newData.append("pretraga_naz_graf", values.pretraga_naz_graf);
    newData.append("ref", values.ref);
    newData.append("jm", values.jm);
    newData.append("materijal_sif", values.materijal_sif);
    newData.append("usluga_sif", values.usluga_sif);
    newData.append("komerc_sif", values.komerc_sif);
    newData.append("fond", values.fond);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=unos_nove_pretrage`,
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
          "Nova pretraga je uspješno sačuvana !",
          "success",
          3000
        );
      }
      queryClient.invalidateQueries({ queryKey: ["pretrageSve"] });
      if (izmjena || useStore.getState().prikazi.naziv === "lab.pretrage") {
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
          "Nova pretraga nije sačuvana, došlo je do greške!",
          "error",
          3000
        );
      }
    }
    //return response.json();
  };

  const handlePretragaSubmit = async () => {
    await validateOnSubmit().then((isValidated) => {
      if (isValidated) {
        if (!izmjena) {
          provjeraPretrage().then((res) => {
            if (res.poruka === 0) {
              postPretragaData();
            } else {
              notifikacija(true, "Pretraga već postoji u bazi!", "error", 3000);
            }
          });
        } else {
          postPretragaData();
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

    if (Object.keys(pretragaForEdit).length > 0) {
      setValues({
        ...pretragaForEdit,
      });
    } // eslint-disable-next-line
  }, [pretragaForEdit, setValues]);
  //console.log("NovaPretraga izmjena", pretragaForEdit, izmjena);
  //console.log("NovaPretraga", values);
  const pretragaPolja = (
    <Form onSubmit={preventDefaultHandler}>
      <div className="pozadina_polja maticni_podaci uputnica">
        <div>
          <Controls.Input
            name="pretraga_sif"
            label="Šifra pretrage:"
            //disabled={izmjena}
            value={values.pretraga_sif}
            onChange={handleInputChange}
            onFocus={() => validate({ pretraga_sif: values.pretraga_sif })}
            error={errors.pretraga_sif}
            size="small"
          />
          <Controls.Input
            name="pretraga_code"
            label="Kod pretrage:"
            value={values.pretraga_code}
            onChange={handleInputChange}
            onFocus={() => validate({ pretraga_code: values.pretraga_code })}
            error={errors.pretraga_code}
            size="small"
          />
        </div>
        <div>
          <Controls.Input
            name="pretraga_naz"
            label="Naziv pretrage:"
            value={values.pretraga_naz}
            onChange={handleInputChange}
            onFocus={() => validate({ pretraga_naz: values.pretraga_naz })}
            error={errors.pretraga_naz}
            size="small"
          />
          <Controls.Input
            name="pretraga_naz_graf"
            label="Naziv za grafički prikaz izbora pretrage:"
            value={values.pretraga_naz_graf}
            onChange={handleInputChange}
            onFocus={() =>
              validate({ pretraga_naz_graf: values.pretraga_naz_graf })
            }
            error={errors.pretraga_naz_graf}
            size="small"
          />
        </div>
        <div>
          <Controls.Input
            name="ref"
            label="Ref. vrijednost:"
            value={values.ref}
            onChange={handleInputChange}
            onFocus={() => validate({ ref: values.ref })}
            error={errors.ref}
            size="small"
          />
          <Controls.Input
            name="jm"
            label="Jedinica mjere:"
            value={values.jm}
            onChange={handleInputChange}
            onFocus={() => validate({ jm: values.jm })}
            error={errors.jm}
            size="small"
          />
          <Controls.Input
            name="materijal_sif"
            label="Materijal:"
            value={values.materijal_sif}
            onChange={handleInputChange}
            error={errors.materijal_sif}
            size="small"
          />
        </div>

        <div>
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
        </div>

        <div className="button_container">
          <Controls.MyButton onClick={closeModal} text="Otkaži" />
          <Controls.MyButton
            onClick={handlePretragaSubmit}
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
      title={`Unos nove pretrage u bazu podataka`}
      openPopup={true}
      setOpenPopup={closeModal}
      fullWidth={true}
      maxWidth={"md"}
    >
      {pretragaPolja}
    </Popup>
  );
};

export default NovaPretraga;
