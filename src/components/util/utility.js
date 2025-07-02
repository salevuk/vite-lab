import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
// tip 1 - pojedinačno slanje iz IzborAnaliza
// tip 2 - direktno slanje iz ListaBolnickih
// tip 3 - grupno slanje iz ListaUputnica

export const pripremaPodaci = (
  pretrage,
  podaciUputnice,
  id_naloga,
  laborant,
  id_korisnika
) => {
  const pretrageToSkip = new Set(["0022", "0020"]); //ne šaljem ove pretrage
  const korisnik = laborant !== undefined ? laborant.split(" ") : "";
  const narudzba = pretrage
    .filter(({ lab_sifra }) => !pretrageToSkip.has(lab_sifra))
    .map((p) => {
      return {
        aktivnost: "+",
        //HIS_id_narudzbe: podaciUputnice.broj, automatski mirth stavi lis_broj
        id_pretrage: p.lab_sifra,
        oznaka_prioriteta: podaciUputnice.prioritet === 1 ? 1 : 0,
        vrijeme_narudzbe: dayjs(new Date()).format("YYYYMMDDHHmmss"),
        kolicina: 1, //nemora se količina slati
      };
    });
  return {
    posiljalac: "NewLisApp",
    vrsta_poruke1: "OML",
    vrsta_poruke2: "O21",
    klinika: podaciUputnice.skladiste_grupa,
    odjel: podaciUputnice.skladiste,
    napomena:
      podaciUputnice.vrsta === 1
        ? (podaciUputnice.broj + " " + podaciUputnice.napomena).trim()
        : (podaciUputnice.id_epizode + " " + podaciUputnice.napomena).trim(),
    kucna_posjeta: "",
    vrijeme_kreiranja:
      dayjs(podaciUputnice.kreirano_datum).format("YYYYMMDDHHmmss") ===
      "Invalid Date"
        ? ""
        : dayjs(podaciUputnice.kreirano_datum).format("YYYYMMDDHHmmss"),
    HIS_sifra_pacijenta: podaciUputnice.id_pacijenta,
    jmbg: podaciUputnice.jmbg,
    hzzo_broj: podaciUputnice.rbo_broj,
    prezime_pacijenta: podaciUputnice.prezime.trim().toUpperCase(),
    ime_pacijenta: podaciUputnice.ime.trim().toUpperCase(),
    datum_rodjenja_pacijenta:
      dayjs(podaciUputnice.datum_rodjenja).format("YYYYMMDDHHmmss") ===
      "Invalid Date"
        ? ""
        : dayjs(podaciUputnice.datum_rodjenja).format("YYYYMMDDHHmmss"),
    pol_pacijenta:
      Number(podaciUputnice.pol) === 1 || podaciUputnice.pol === "1"
        ? "M"
        : "Ž",
    adresa_ulica: "", //podaciUputnice.adresa_pacijenta, //podaciUputnice.adresa_ulica,
    adresa_mjesto: "", //podaciUputnice.opstina_naziv, //podaciUputnice.adresa_mjesto,
    adresa_drzava: "",
    visina_pacijenta: podaciUputnice.visina_pacijenta,
    tezina_pacijenta: podaciUputnice.tezina_pacijenta,
    dnevna_kolicina_urina: podaciUputnice.diureza,
    HIS_bolnicki_broj: id_naloga !== undefined ? id_naloga : podaciUputnice.id,
    MKB_dijagnoza: podaciUputnice.dijagnoza_sifra,
    HIS_sifra_ljekara: podaciUputnice.vrsta === 1 ? 0 : podaciUputnice.uputio,
    prezime_ljekara:
      podaciUputnice.vrsta === 1 ? "" : podaciUputnice.prezime_ljekara,
    ime_ljekara: podaciUputnice.vrsta === 1 ? "" : podaciUputnice.ime_ljekara,
    titula_ljekara: "Dr.",
    sifra_lab: "1204",
    naziv_lab: "Zavod za kliničku laboratorijsku dijagnostiku",
    nacin_placanja_sifra: "",
    nacin_placanja_naziv: "",
    sifra_personala:
      id_korisnika !== undefined
        ? id_korisnika
        : podaciUputnice.kreirano_korisnik,
    prezime_personala:
      laborant !== undefined ? korisnik[0] : podaciUputnice.prezime_personala,
    ime_personala:
      laborant !== undefined ? korisnik[1] : podaciUputnice.ime_personala,
    narudzba: narudzba,
  };
};

export function podaciPacijenta(values, overrides = {}) {
  return {
    pacijent_uid: overrides.pacijent_uid || values.id_pacijenta,
    pacijent_identifikator: overrides.pacijent_identifikator || values.jmbg,
    prezime: overrides.prezime || values.prezime,
    ime: overrides.ime || values.ime,
    pol: overrides.pol || values.pol,
    opstina: overrides.opstina || values.opstina,
    opstina_id: overrides.opstina_id || values.opstina_id,
    ime_roditelja: overrides.ime_roditelja || values.ime_roditelja,
    datum_rodjenja: overrides.datum_rodjenja || values.datum_rodjenja,
    adresa_pacijenta: overrides.adresa_pacijenta || values.adresa_pacijenta,
    identifikator: overrides.identifikator || values.identifikator,
    telefon: overrides.telefon || values.telefon,
    email: overrides.email || values.email,
  };
}

export function podaciUputnice(values, overrides = {}) {
  return {
    id: overrides.id || values.broj_epizode,
    prioritet: overrides.prioritet || values.prioritet,
    protokol: overrides.protokol || values.broj,
    vrsta: overrides.vrsta || values.vrsta,
    dijagnoza_id: overrides.dijagnoza_id || values.dijagnoza_id,
    dijagnoza_sifra: overrides.dijagnoza_sifra || values.dijagnoza_sifra,
    jmbg_majka: overrides.jmbg_majka || values.jmbg_majka,
    napomena: overrides.napomena || values.napomena,
    uputio: overrides.uputio || values.uputio,
    datum_rodjenja: overrides.datum_rodjenja || values.datum_rodjenja,
    status_osiguranja: overrides.status_osiguranja || values.status_osiguranja,
    osnov_oslobadjanja:
      overrides.osnov_oslobadjanja || values.osnov_oslobadjanja,
    po_ugovoru: overrides.po_ugovoru || values.po_ugovoru,
    komerc_placanje: overrides.komerc_placanje || values.komerc_placanje,
    bez_participacije: overrides.bez_participacije || values.bez_participacije,
    visina: overrides.visina || values.visina_pacijenta,
    tezina: overrides.tezina || values.tezina_pacijenta,
    diureza: overrides.diureza || values.diureza,
    klijent_token: overrides.klijent_token || values.klijent_token,
  };
}
