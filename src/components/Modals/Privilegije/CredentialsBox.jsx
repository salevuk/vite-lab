import "./CredentialsBox.css";
//import { useStore } from "../../../store.js";

const CredentialsBox = ({
  privilegija,
  lista,
  odaberiPrivilegiju,
  disabled,
}) => {
  //console.log("privilegija cb", privilegija);

  const handleIzbor = () => {
    odaberiPrivilegiju(privilegija.id);
  };
  return (
    <label key={privilegija.id} className="label_privilegija_container">
      <p className="naziv_privilegije">
        {privilegija.naziv_privilegije} -{" "}
        {privilegija.naziv_privilegije === "Administracija"
          ? "upravljanje privilegijama"
          : privilegija.naziv_privilegije === "Sifrarnici"
          ? "pregled šifrarnika"
          : privilegija.naziv_privilegije === "Personal"
          ? "lista osoblja labaratorije"
          : privilegija.naziv_privilegije === "Izvjestaji"
          ? "pregled izvjestaja"
          : privilegija.naziv_privilegije === "Labaratorija"
          ? "rad sa nalozima (uputnicama)"
          : privilegija.naziv_privilegije === "Rezultati analiza"
          ? "pregled rezultata analiza"
          : privilegija.naziv_privilegije === "Arhiva"
          ? "pregled i štampa arhiviranih rezultata iz Labmedica"
          : ""}
      </p>
      <input
        type="checkbox"
        id={privilegija.id}
        onClick={disabled ? null : handleIzbor}
        checked={lista.includes(privilegija.id) ? true : false}
        disabled={disabled}
      />
      <span className={`checkmark_privilegije`}></span>
    </label>
  );
};

export default CredentialsBox;
