import "./CheckBox.css";
import { useStore } from "../../../../store";

const CheckBox = ({ pretraga, tpr }) => {
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  //const korisnik = useStore((store) => store.korisnik);
  const korisnik = sesijaPodaci.id_korisnika;
  const odaberiPretragu = useStore((store) => store.odaberiPretragu);
  const odabranePretrage = useStore((store) => store.odabranePretrage);
  const ponistiPretragu = useStore((store) => store.ponistiPretragu);
  const podaciUputnice = useStore((store) => store.podaciUputnice);
  const openProvjeraCijene = useStore((store) => store.openProvjeraCijene);
  const odabranePretrageProvjere = useStore(
    (store) => store.odabranePretrageProvjere
  );
  const setOdabranePretrageProvjere = useStore(
    (store) => store.setOdabranePretrageProvjere
  );

  const idInput =
    pretraga.labmedic_sifra + "_" + pretraga.id + pretraga.redni_br;

  const isChecked = (id, pretragaId) => {
    const nalog = odabranePretrage.find((nalog) => nalog.id === id);
    if (nalog) {
      return nalog.pretrage.some(
        (pretraga) => pretraga.lab_sifra === pretragaId
      );
    }
    return false;
  };

  const isCheckedProvjera = (pretragaId) => {
    return odabranePretrageProvjere.some(
      (pretraga) => pretraga.lab_sifra === pretragaId
    );
  };

  // po ugovoru komerc šifre
  /* let sifra_proizvoda =
    podaciUputnice.komerc_placanje === 1 || podaciUputnice.po_ugovoru === 1
      ? pretraga.komerc_sif
      : podaciUputnice.status_osiguranja === 1
      ? pretraga.usluga_sif
      : pretraga.komerc_sif; */
  /* let cijena =
    podaciUputnice.vrsta === 1
      ? podaciUputnice.komerc_placanje === 1 ||
        podaciUputnice.status_osiguranja === 0
        ? pretraga.mpc_cijena
        : podaciUputnice.po_ugovoru === 1 ||
          podaciUputnice.bez_participacije === 1
        ? 0
        : podaciUputnice.status_osiguranja === 1
        ? pretraga.fond_participacija
        : pretraga.fond_cijena
      : pretraga.fond_cijena - pretraga.fond_participacija; */ // UKOLIKO JE BOLNIČKA UZIMAMO OVO JER 99,9% slučajeva SE REOSIGURAJU

  /* const unesiLabPretragu = (
    id,
    sifra,
    //sifra_proizvoda,
    pretraga_code,
    naziv_pretrage
    //cijena
  ) => {
    let checkBox = document.getElementById(id);
    if (checkBox.checked === true) {
      // biranje u isto vrijeme elektroforeze i tpr-a
      if (sifra === "430050") {
        console.warn("Šifra elfor, sifra, tpr", sifra, tpr);
        let tprprovjera = undefined;
        if (odabranePretrage.length > 0) {
          tprprovjera = odabranePretrage.find(
            (nalog) => nalog.id === podaciUputnice.id
          );
          if (tprprovjera && tprprovjera.length > 0) {
            tprprovjera = tprprovjera[0].pretrage.find(
              (p) => p.lab_sifra === "15140"
            );
          }
        }
        if (tprprovjera === undefined && tpr?.length > 0) {
          odaberiPretragu({
            id: podaciUputnice.id,
            novaPretraga: {
              id: Number(tpr[0].pretraga_id),
              lab_sifra: tpr[0].labmedic_sifra,
              sifra_usluge: tpr[0].usluga_sif,
              komerc_sif: tpr[0].komerc_sif,
              pretraga_code: tpr[0].pretraga_code,
              naziv: tpr[0].pretraga_naz,
              //cijena: cijena_usluge,
              fond_participacija: tpr[0].fond_participacija,
              mpc_cijena: tpr[0].mpc_cijena,
              fond_cijena: tpr[0].fond_cijena,
              kolicina: 1,
            },
          });
        }
      }
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: Number(sifra), //ovdje ga pretvara u broj
          lab_sifra: sifra,
          sifra_usluge: pretraga.usluga_sif,
          komerc_sif: pretraga.komerc_sif,
          pretraga_code: pretraga_code,
          naziv: naziv_pretrage,
          //cijena: cijena,
          fond_participacija: pretraga.fond_participacija,
          mpc_cijena: pretraga.mpc_cijena,
          fond_cijena: pretraga.fond_cijena,
          kolicina: 1,
        },
      });
    } else {
      ponistiPretragu({ id: podaciUputnice.id, pretragaId: Number(sifra) });
    }
  }; */

  const unesiLabPretragu = (e) => {
    //console.error("checked", pretraga.id, e);
    const checked = e.target.checked;
    const sifra = pretraga.labmedic_sifra;
    const pretraga_code = pretraga.pretraga_code;
    const naziv_pretrage = pretraga.naziv_pretrage;

    // Dodavanje pretrage
    if (checked) {
      // Ako je elektroforeza, automatski dodaj i TPR ako nije već dodat
      if (sifra === "430050" && tpr?.length > 0) {
        const nalog = odabranePretrage.find((n) => n.id === podaciUputnice.id);
        const tprVecDodat =
          nalog?.pretrage?.some((p) => p.lab_sifra === "15140") ?? false;
        if (!tprVecDodat) {
          odaberiPretragu({
            id: podaciUputnice.id,
            novaPretraga: {
              id: Number(tpr[0].pretraga_id),
              lab_sifra: tpr[0].labmedic_sifra,
              sifra_usluge: tpr[0].usluga_sif,
              komerc_sif: tpr[0].komerc_sif,
              pretraga_code: tpr[0].pretraga_code,
              naziv: tpr[0].pretraga_naz,
              fond_participacija: tpr[0].fond_participacija,
              mpc_cijena: tpr[0].mpc_cijena,
              fond_cijena: tpr[0].fond_cijena,
              kolicina: 1,
            },
          });
        }
      }
      // Dodaj izabranu pretragu
      odaberiPretragu({
        id: podaciUputnice.id,
        novaPretraga: {
          id: Number(sifra),
          lab_sifra: sifra,
          sifra_usluge: pretraga.usluga_sif,
          komerc_sif: pretraga.komerc_sif,
          pretraga_code,
          naziv: naziv_pretrage,
          fond_participacija: pretraga.fond_participacija,
          mpc_cijena: pretraga.mpc_cijena,
          fond_cijena: pretraga.fond_cijena,
          kolicina: 1,
        },
      });
    } else {
      // Uklanjanje pretrage
      ponistiPretragu({ id: podaciUputnice.id, pretragaId: Number(sifra) });
    }
  };

  const unesiPretraguZaProvjeru = (e) => {
    if (!pretraga) return; // Obezbjeđuje da pretraga is not null or undefined
    //const checkBox = document.getElementById(pretraga.id);
    const checkBox = e.target.checked;
    const index = odabranePretrageProvjere.findIndex(
      (p) => p.id === Number(pretraga.labmedic_sifra)
    );
    if (checkBox) {
      if (index === -1) {
        const newPretraga = {
          id: Number(pretraga.labmedic_sifra),
          lab_sifra: pretraga.labmedic_sifra,
          sifra_usluge: pretraga.usluga_sif,
          komerc_sif: pretraga.komerc_sif,
          pretraga_code: pretraga.pretraga_code,
          naziv: pretraga.naziv_pretrage,
          fond_participacija: pretraga.fond_participacija,
          fond_cijena: pretraga.fond_cijena,
          mpc_cijena: pretraga.mpc_cijena,
          kolicina: 1,
        };
        const updatedPretrage = [...odabranePretrageProvjere, newPretraga];
        if (pretraga.labmedic_sifra === "430050" && tpr?.length > 0) {
          const tprIndex = odabranePretrageProvjere.findIndex(
            (p) => p.id === Number(tpr[0].pretraga_id)
          );
          if (tprIndex === -1) {
            updatedPretrage.push(tpr[0]);
          }
        }
        //console.warn("updatedPretrage", updatedPretrage);
        setOdabranePretrageProvjere(updatedPretrage);
      }
    } else if (index !== -1) {
      const filteredPretrage = odabranePretrageProvjere.filter(
        (p) => p.id !== Number(pretraga.labmedic_sifra)
      );
      setOdabranePretrageProvjere(filteredPretrage);
    }
  };

  return (
    <label
      key={idInput}
      className={`label_container ${
        !openProvjeraCijene
          ? podaciUputnice.status === 1 ||
            podaciUputnice.status === 2 ||
            podaciUputnice.status === 3 ||
            korisnik !== podaciUputnice.kreirano_korisnik
            ? "label_container_disabled"
            : ""
          : ""
      }`}
    >
      <p className="naziv_usluge">{pretraga.pretraga_naz}</p>
      <input
        type="checkbox"
        id={pretraga.id}
        onChange={
          openProvjeraCijene
            ? (event) => unesiPretraguZaProvjeru(event)
            : (event) => unesiLabPretragu(event)
          /*
          onClick={
            openProvjeraCijene
              ? () => unesiPretraguZaProvjeru(pretraga)
              : () => unesiLabPretragu(
                  pretraga.id,
                  pretraga.labmedic_sifra,
                  //sifra_proizvoda,
                  pretraga.pretraga_code,
                  pretraga.naziv_pretrage
                  //cijena
                )
          }
           */
        }
        checked={
          openProvjeraCijene
            ? isCheckedProvjera(pretraga.labmedic_sifra)
            : isChecked(podaciUputnice.id, pretraga.labmedic_sifra)
        }
        disabled={
          !openProvjeraCijene
            ? podaciUputnice.status === 1 ||
              podaciUputnice.status === 2 ||
              podaciUputnice.status === 3 ||
              korisnik !== podaciUputnice.kreirano_korisnik
              ? true
              : false
            : false
        }
      />
      {/* <span
        className={`checkmark ${
          podaciUputnice.status === 1 ||
          podaciUputnice.status === 2 ||
          korisnik !== podaciUputnice.kreirano_korisnik ||
          podaciUputnice.vrsta === 2
            ? "checkmark_disabled"
            : ""
        }`}
      ></span> */}
    </label>
  );
};

export default CheckBox;
