export function usePretragaUnos() {
  const pretragaUnos = async (
    id_uputnice,
    pretraga,
    usluga_sifra,
    korisnik
  ) => {
    const newData = new URLSearchParams();
    newData.append("id_uputnice", id_uputnice);
    newData.append("pretraga_sifra", pretraga.lab_sifra);
    newData.append("pretraga_code", pretraga.pretraga_code);
    newData.append("usluga_sifra", usluga_sifra);
    newData.append("usluga_kolicina", pretraga.kolicina);
    newData.append("korisnik", korisnik);
    newData.append("status", 1);
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=unos_pretraga_uputnice`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: newData,
      }
    );
    return response;
  };
  return { pretragaUnos };
}
