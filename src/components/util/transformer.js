import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

const statusMap = {
  0: "Novi nalaz",
  1: "Poslano u lab.",
  2: "Stornirano",
  3: "Rezultat stigao",
};

const vrstaMap = {
  1: "Ambulantna",
  2: "Bolnička",
  3: "Bolnička",
};

const prioritetMap = {
  3: "Redovno",
  0: "Redovno",
  1: "Hitno",
};

const osiguranjeMap = {
  0: "Neosiguran",
  1: "OB",
  6: "OZ",
};

/* const statusNaplateMap = {
  1: "Komerc. plaća sve",
  2: "Neosig. plaća sve",
  3: "Osig. plaća part.",
  4: "Osig. oslob. part.",
}; */

/* const reversePolMap = {
  0: "M",
  1: "Ž",
}; */

/* const prioritetBolnickeMap = {
  1: "Redovno",
  3: "Hitno",
}; */

export const uputnicaTransformer = (data, setUputnice) => {
  const izmUputnice = [];
  for (const uputnica of data) {
    const uputnicaData = { ...uputnica };
    uputnicaData.naziv_statusa = statusMap[uputnica.status];
    uputnicaData.vrsta_naziv = vrstaMap[uputnica.vrsta];
    uputnicaData.prioritet_naziv = prioritetMap[uputnica.prioritet];
    uputnicaData.vid_osiguranja_naziv = osiguranjeMap[uputnica.vid_osiguranja];
    uputnicaData.datum_rodjenja = dayjs(uputnicaData.datum_rodjenja);
    uputnicaData.datum_uputnice = dayjs(uputnicaData.datum_uputnice);
    uputnicaData.datum_uzorak = dayjs(uputnicaData.datum_uzorak);
    uputnicaData.kreirano_datum = dayjs(uputnicaData.kreirano_datum);
    uputnicaData.rok_osiguranja = dayjs(uputnicaData.rok_osiguranja);
    izmUputnice.push(uputnicaData);
  }

  if (setUputnice) setUputnice(izmUputnice);
  return izmUputnice;
};

export const bolnickaUputnicaTransformer = (uputnice, setBolnickeData) => {
  const izmUputnice = [];

  for (const uputnica of uputnice) {
    const uputnicaData = { ...uputnica };
    uputnicaData.prioritet_naziv = prioritetMap[uputnica.prioritet];
    //uputnicaData.OSIG_POL = polMap[uputnica.OSIG_POL];
    uputnicaData.datum_rodjenja = dayjs(uputnica.datum_rodjenja) /* .format(
      "DD.MM.YYYY"
    ) */;
    uputnicaData.kreirano_datum = dayjs(uputnica.kreirano_datum) /* .format(
      "DD.MM.YYYY HH:mm:ss"
    ) */;
    uputnicaData.datum_uzorak = dayjs(uputnica.datum_uzorak);

    izmUputnice.push(uputnicaData);
  }
  if (setBolnickeData) setBolnickeData(izmUputnice);
  return izmUputnice;
};

export const rezultatiTransformer = (uputnice, setRezultatiData) => {
  const izmUputnice = [];
  for (const uputnica of uputnice) {
    const uputnicaData = { ...uputnica };
    uputnicaData.prioritet = prioritetMap[uputnica.prioritet];
    uputnicaData.vrsta = vrstaMap[uputnica.vrsta];
    uputnicaData.datum_pocetak = dayjs(uputnica.datum_pocetak).format(
      "DD.MM.YYYY HH:mm:ss"
    );
    uputnicaData.datum_kraj = dayjs(uputnica.datum_kraj).format(
      "DD.MM.YYYY HH:mm:ss"
    );

    izmUputnice.push(uputnicaData);
  }
  if (setRezultatiData) setRezultatiData(izmUputnice);
  return izmUputnice;
};

export const mkbTransformer = (mkb, setDijagnozaMKB) => {
  const lista = [];
  for (const dijagnoza of mkb.data) {
    const columnsData = {
      id: dijagnoza[0],
      value: dijagnoza[1],
      label: dijagnoza[2],
      participacija: dijagnoza[3],
    };
    lista.push(columnsData);
  }
  if (setDijagnozaMKB) setDijagnozaMKB(lista);
  return lista;
};

export const mkb2Transformer = (mkb, setIzvjestajData) => {
  const lista = [];
  for (const dijagnoza of mkb.data) {
    const columnsData = {
      id: dijagnoza[0],
      fond_sifra: dijagnoza[1],
      oznaka: dijagnoza[2],
      latinski_naziv: dijagnoza[3],
      naziv: dijagnoza[4],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const uslugeTransformer = (usluge, setIzvjestajData) => {
  const lista = [];
  for (const usluga of usluge.data) {
    const columnsData = {
      id: usluga[0],
      sifra: usluga[1],
      naziv: usluga[2],
      fond_cijena: usluga[3],
      fond_participacija: usluga[4],
      fond_procenat_participacije: usluga[5],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const komercUslugeTransformer = (usluge, setIzvjestajData) => {
  const lista = [];
  for (const usluga of usluge.data) {
    const columnsData = {
      id: usluga[0],
      pretraga_sif: usluga[1],
      pretraga_naz: usluga[2],
      nonkomerc_sif: usluga[3],
      usluga_sif: usluga[4],
      usluga_naz: usluga[5],
      fond_cijena: usluga[6],
      vpc: usluga[7],
      mpc: usluga[8],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const uslugeLabTransformer = (usluge, setIzvjestajData) => {
  const lista = [];
  for (const usluga of usluge.data) {
    const columnsData = {
      id: usluga[0],
      pretraga_sif: usluga[1],
      pretraga_naz: usluga[2],
      usluga_sif: usluga[3],
      usluga_naz: usluga[4],
      fond_cijena: usluga[5],
      fond_participacija: usluga[6],
      fond_procenat_participacije: usluga[7],
      vpc: usluga[8],
      mpc: usluga[9],
      pdv: usluga[10],
      fisk_sif: usluga[11],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const uslugeUkcTransformer = (usluge, setIzvjestajData) => {
  const lista = [];
  for (const usluga of usluge.data) {
    const columnsData = {
      id: usluga[0],
      usluga_sif: usluga[1],
      usluga_naz: usluga[2],
      tip: usluga[3],
      vpc: usluga[4],
      mpc: usluga[5],
      pdv: usluga[6],
      fond_cijena: usluga[7],
      fond_participacija: usluga[8],
      fond_procenat_participacije: usluga[9],
      fisk_sif: usluga[10],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const doktoriTransformer = (doktori, setIzvjestajData) => {
  const lista = [];
  for (const doktor of doktori.data) {
    const columnsData = {
      fond_sifra_ljekara: doktor[0],
      fond_sifra_ustanove: doktor[1],
      ime: doktor[2],
      prezime: doktor[3],
      org_jed: doktor[4],
      zdr_ustanova: doktor[5],
    };
    lista.push(columnsData);
  }
  if (setIzvjestajData) setIzvjestajData(lista);
  return lista;
};

export const uputioTransformer = (uputio, setUputio) => {
  const uputioTransformed = uputio.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.value === item.value)
  );
  if (setUputio) setUputio(uputioTransformed);
  return uputioTransformed;
};

export const obradaTransformer = (podaci, setObradjeniPodaci) => {
  let grupisanoPoPretrazi = [];
  if (podaci.length > 0) {
    for (const podaciElement of podaci) {
      const grupisanoByPretraga = Object.groupBy(
        podaciElement.pretrage,
        ({ sifra_usluge }) => sifra_usluge // sifra proizvoda
      );
      let korisnikPodaci = {
        kreirano_korisnik: podaciElement.kreirano_korisnik,
        ime: podaciElement.ime,
        prezime: podaciElement.prezime,
        ukupno_br_usluga: 0,
        ukupno_pacijent_placa: 0,
        ukupno_fond_placa: 0,
        ukupno_ukupno: 0,
        pretrage: [],
      };
      for (const key in grupisanoByPretraga) {
        const pretragaGroupPoStatusu = Object.groupBy(
          grupisanoByPretraga[key],
          ({ status }) => status
        );
        let statusPretrage = [];
        for (const status in pretragaGroupPoStatusu) {
          let pacijent_placa =
            Number(status) === 1 || Number(status) === 2
              ? pretragaGroupPoStatusu[status][0].mpc_cijena
              : Number(status) === 4
              ? 0
              : pretragaGroupPoStatusu[status][0].fond_participacija;
          let fond_placa =
            Number(status) === 3
              ? pretragaGroupPoStatusu[status][0].fond_cijena -
                pretragaGroupPoStatusu[status][0].fond_participacija
              : Number(status) === 1 || Number(status) === 2
              ? 0
              : pretragaGroupPoStatusu[status][0].fond_cijena;
          let ukupno =
            Number(status) === 4
              ? pretragaGroupPoStatusu[status].length * pacijent_placa
              : Number(status) === 3
              ? pretragaGroupPoStatusu[status].length * pacijent_placa +
                pretragaGroupPoStatusu[status].length * fond_placa
              : pretragaGroupPoStatusu[status].length * pacijent_placa;
          let fond_ukupno = fond_placa * pretragaGroupPoStatusu[status].length;
          let pacijent_ukupno =
            pacijent_placa * pretragaGroupPoStatusu[status].length;
          let tempFinalpretraga = {
            id: pretragaGroupPoStatusu[status][0].id,
            naziv: pretragaGroupPoStatusu[status][0].naziv,
            status: status,
            status_opis: pretragaGroupPoStatusu[status][0].status_opis,
            lab_sifra: pretragaGroupPoStatusu[status][0].lab_sifra,
            sifra_usluge: pretragaGroupPoStatusu[status][0].sifra_usluge,
            mpc_cijena: pretragaGroupPoStatusu[status][0].mpc_cijena,
            fond_cijena: pretragaGroupPoStatusu[status][0].fond_cijena,
            fond_participacija:
              pretragaGroupPoStatusu[status][0].fond_participacija,
            broj_usluga: pretragaGroupPoStatusu[status].length,
            fond: fond_placa.toFixed(2),
            fond_ukupno: fond_ukupno.toFixed(2),
            pacijent: pacijent_placa.toFixed(2),
            pacijent_ukupno: pacijent_ukupno.toFixed(2),
            ukupno: ukupno.toFixed(2),
          };
          statusPretrage.push(tempFinalpretraga);
        }
        korisnikPodaci.pretrage.push(statusPretrage);
      }
      grupisanoPoPretrazi.push(korisnikPodaci);
    }
    grupisanoPoPretrazi.map((k) => {
      let ukupno_br_usluga = 0;
      let ukupno_pacijent_placa = 0;
      let ukupno_fond_placa = 0;
      let ukupno_ukupno = 0;
      k.pretrage.map((p) => {
        ukupno_br_usluga = ukupno_br_usluga + Number(p[0].broj_usluga);
        ukupno_pacijent_placa =
          ukupno_pacijent_placa + Number(p[0].pacijent_ukupno);
        ukupno_fond_placa = ukupno_fond_placa + Number(p[0].fond_ukupno);
        ukupno_ukupno = ukupno_ukupno + Number(p[0].ukupno);
      });
      k.ukupno_br_usluga = ukupno_br_usluga;
      k.ukupno_pacijent_placa = ukupno_pacijent_placa.toFixed(2);
      k.ukupno_fond_placa = ukupno_fond_placa.toFixed(2);
      k.ukupno_ukupno = ukupno_ukupno.toFixed(2);
    });
    //setObradjeniPodaci(grupisanoPoPretrazi);
  }
  if (setObradjeniPodaci) setObradjeniPodaci(grupisanoPoPretrazi);
  return grupisanoPoPretrazi;
};

export const naplacenoTransformer = (uputnice, setIzvjestajData) => {
  let grupisanoPoKorisniku = [];
  if (uputnice.length > 0) {
    const grupisanoByKorisnik = Object.groupBy(
      uputnice,
      ({ kreirano_korisnik }) => kreirano_korisnik
    );
    for (const podaciElement of Object.entries(grupisanoByKorisnik)) {
      let korisnikPodaci = {
        kreirano_korisnik: Number(podaciElement[0]),
        ime: podaciElement[1][0].ime,
        prezime: podaciElement[1][0].prezime,
        pretrage: [],
      };
      korisnikPodaci.pretrage.push(
        ...podaciElement[1].flatMap((uputnica) => uputnica.pretrage)
      );
      grupisanoPoKorisniku.push(korisnikPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoPoKorisniku);
  return grupisanoPoKorisniku;
};

export const naplacenoPoPacijentuTransformer = (uputnice, setIzvjestajData) => {
  let grupisanoPoKorisniku = [];
  if (uputnice.length > 0) {
    const grupisanoByKorisnik = Object.groupBy(
      uputnice,
      ({ kreirano_korisnik }) => kreirano_korisnik
    );
    for (const podaciElement of Object.entries(grupisanoByKorisnik)) {
      let ukupno_ukupno = podaciElement[1].reduce(
        (a, b) => a + Number(b.ukupna_participacija),
        0
      );
      let korisnikPodaci = {
        kreirano_korisnik: Number(podaciElement[0]),
        ime: podaciElement[1][0].ime,
        prezime: podaciElement[1][0].prezime,
        ukupno: ukupno_ukupno.toFixed(2),
        pacijenti: [],
      };
      korisnikPodaci.pacijenti.push(
        ...podaciElement[1].flatMap((uputnica) => uputnica)
      );
      for (let i = 0; i < korisnikPodaci.pacijenti.length; i++) {
        let r_br = i + 1;
        korisnikPodaci.pacijenti[i].r_broj = r_br;
      }
      grupisanoPoKorisniku.push(korisnikPodaci);
    }
    if (setIzvjestajData) setIzvjestajData(grupisanoPoKorisniku);
    return grupisanoPoKorisniku;
  }
};

export const naplacenoKomercijalnoTransformer = (podaci, setIzvjestajData) => {
  let grupisanoPoPretrazi = [];
  if (podaci.length > 0) {
    const grupisanoByPretraga = Object.groupBy(
      podaci,
      ({ sifra_usluge }) => sifra_usluge // sifra proizvoda
    );
    for (const usluga in grupisanoByPretraga) {
      let status = grupisanoByPretraga[usluga][0].status;
      let pacijent_placa =
        Number(status) === 1
          ? grupisanoByPretraga[usluga][0].mpc_cijena *
            grupisanoByPretraga[usluga][0].kolicina
          : Number(status) === 2
          ? grupisanoByPretraga[usluga][0].fond_cijena
          : Number(status) === 4
          ? 0
          : grupisanoByPretraga[usluga][0].fond_participacija *
            grupisanoByPretraga[usluga][0].kolicina;
      let fond_placa =
        Number(status) === 3
          ? (grupisanoByPretraga[usluga][0].fond_cijena -
              grupisanoByPretraga[usluga][0].fond_participacija) *
            grupisanoByPretraga[usluga][0].kolicina
          : Number(status) === 1 || Number(status) === 2
          ? 0
          : grupisanoByPretraga[usluga][0].fond_cijena *
            grupisanoByPretraga[usluga][0].kolicina;
      let ukupno =
        Number(status) === 4
          ? grupisanoByPretraga[usluga].length * pacijent_placa
          : Number(status) === 3
          ? grupisanoByPretraga[usluga].length * pacijent_placa +
            grupisanoByPretraga[usluga].length * fond_placa
          : grupisanoByPretraga[usluga].length * pacijent_placa;
      let br_usluga = 0;
      grupisanoByPretraga[usluga].forEach((usluga) => {
        br_usluga += Number(usluga.kolicina);
      });
      let fond_ukupno = fond_placa * br_usluga;
      let pacijent_ukupno = pacijent_placa * br_usluga;
      let tempFinalpretraga = {
        id: grupisanoByPretraga[usluga][0].id,
        naziv: grupisanoByPretraga[usluga][0].naziv,
        status: status,
        lab_sifra: grupisanoByPretraga[usluga][0].lab_sifra,
        sifra_usluge: grupisanoByPretraga[usluga][0].sifra_usluge,
        mpc_cijena: grupisanoByPretraga[usluga][0].mpc_cijena,
        fond_participacija: grupisanoByPretraga[usluga][0].fond_participacija,
        fond_cijena: grupisanoByPretraga[usluga][0].fond_cijena,
        broj_usluga: br_usluga,
        fond: fond_placa.toFixed(2),
        fond_ukupno: fond_ukupno.toFixed(2),
        pacijent: pacijent_placa.toFixed(2),
        pacijent_ukupno: pacijent_ukupno.toFixed(2),
        ukupno: ukupno.toFixed(2),
      };
      grupisanoPoPretrazi.push(tempFinalpretraga);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoPoPretrazi);
  return grupisanoPoPretrazi;
};

export const realizacijaKomercijalnihTransformer = (
  podaci,
  setRealizacijaKomercijalnih
) => {
  let grupisanoPoUsluzi = [];
  if (podaci.length > 0) {
    const grupisanoByUsluga = Object.groupBy(
      podaci,
      ({ sifra_usluge }) => sifra_usluge
    );
    for (const usluga of Object.entries(grupisanoByUsluga)) {
      const grupisanoByVidOsiguranja = Object.groupBy(
        usluga[1],
        ({ vid_osiguranja }) => vid_osiguranja
      );
      for (const vid_osig of Object.entries(grupisanoByVidOsiguranja)) {
        let br_usluga = 0;
        vid_osig[1].forEach((usluga) => {
          br_usluga += Number(usluga.kolicina);
        });
        let usluga = {
          sifra_usluge: vid_osig[1][0].sifra_usluge,
          naziv: vid_osig[1][0].naziv,
          vid_osiguranja: vid_osig[0],
          br_usluga: br_usluga /*vid_osig[1].length*/,
          iznos: /* vid_osig[1].length*/ (
            br_usluga * vid_osig[1][0].mpc_cijena
          ).toFixed(2),
        };
        grupisanoPoUsluzi.push(usluga);
      }
    }
  }
  if (setRealizacijaKomercijalnih)
    setRealizacijaKomercijalnih(grupisanoPoUsluzi);
  return grupisanoPoUsluzi;
};

export const realizacijaOsiguranihTransformer = (podaci, setIzvjestajData) => {
  let grupisanoPoUsluzi = [];
  if (podaci.length > 0) {
    const grupisanoByUsluga = Object.groupBy(
      podaci,
      ({ sifra_usluge }) => sifra_usluge
    );
    for (const usluga of Object.entries(grupisanoByUsluga)) {
      const grupisanoByVidOsiguranja = Object.groupBy(
        usluga[1],
        ({ vid_osiguranja }) => vid_osiguranja
      );
      for (const vid_osig of Object.entries(grupisanoByVidOsiguranja)) {
        let br_usluga = 0;
        vid_osig[1].forEach((usluga) => {
          br_usluga += Number(usluga.kolicina);
        });
        let usluga = {
          sifra_usluge: vid_osig[1][0].sifra_usluge,
          naziv: vid_osig[1][0].naziv,
          vid_osiguranja: vid_osig[0],
          br_usluga: br_usluga /* vid_osig[1].length */,
          iznos:
            vid_osig[0] === 1
              ? /* vid_osig[1].length */ (
                  br_usluga * vid_osig[1][0].fond_cijena
                ).toFixed(2)
              : /* vid_osig[1].length */ (
                  br_usluga *
                  (vid_osig[1][0].fond_cijena -
                    vid_osig[1][0].fond_participacija)
                ).toFixed(2),
        };
        grupisanoPoUsluzi.push(usluga);
      }
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoPoUsluzi);
  return grupisanoPoUsluzi;
};

export const uslugePokioZbirnoTransformer = (uputnice, setIzvjestajData) => {
  //console.log("UPUTNICE ULAZNE uslugePokioZbirnoTransformer", uputnice);
  let grupisanoFinalno = [];
  if (uputnice.length > 0) {
    let grupisanoPoVrsti = [];
    const grupisanoByVrsta = Object.groupBy(uputnice, ({ vrsta }) => vrsta);
    for (const podaciElement of Object.entries(grupisanoByVrsta)) {
      let vrstaPodaci = {
        vrsta:
          Number(podaciElement[0]) === 1
            ? "AMBULANTNE UPUTNICE"
            : "BOLNIČKE UPUTNICE",
        uputnice: [],
      };
      vrstaPodaci.uputnice.push(
        ...podaciElement[1].flatMap((uputnica) => uputnica)
      );
      grupisanoPoVrsti.push(vrstaPodaci);
    }
    //console.log("grupisanoPoVrsti", grupisanoPoVrsti);
    for (const vrsta of grupisanoPoVrsti) {
      let vrstaPodaci = {
        vrsta: vrsta.vrsta,
        broj_usluga: Number(0),
        ukupno_iznos: Number(0),
        klinike: [],
      };
      const grupisanoByKlinika = Object.groupBy(
        vrsta.uputnice,
        ({ klinika }) => klinika
      );
      //console.log("grupisanoByKlinika", vrsta.vrsta, grupisanoByKlinika);
      for (const podaciElement of Object.entries(grupisanoByKlinika)) {
        //console.log("podaciElement KLINIKA", podaciElement);
        const grupisanoByOdjel = Object.groupBy(
          podaciElement[1],
          ({ odjel }) => odjel
        );
        let klinikaPodaci = {
          klinika: podaciElement[0],
          klinika_naziv: podaciElement[1][0].klinika_naziv,
          //uputnice: [],
          broj_usluga: Number(0),
          ukupno_iznos: Number(0),
          odjeli: [],
        };
        //console.log("grupisanoByOdjel", podaciElement[0], grupisanoByOdjel);
        for (const podaciElement of Object.entries(grupisanoByOdjel)) {
          let br_usluga = podaciElement[1]
            .map((uputnica) => {
              return uputnica.pretrage.length;
            })
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
          /* let uk_part = podaciElement[1]
            .map((uputnica) => Number(uputnica.ukupna_participacija))
            .reduce(
              (accumulator, currentValue) => accumulator + Number(currentValue),
              0
            )
            .valueOf(); */ // or: +uk_part
          let uk_part = 0;
          podaciElement[1].forEach((uputnica) => {
            uk_part += Number(uputnica.ukupna_participacija);
          });
          /* let uk_fond = podaciElement[1]
            .map((uputnica) => Number(uputnica.ukupno_fond))
            .reduce(
              (accumulator, currentValue) => accumulator + Number(currentValue),
              0
            )
            .valueOf(); */
          let uk_fond = 0;
          podaciElement[1].forEach((uputnica) => {
            uk_fond += Number(uputnica.ukupno_fond);
          });
          let odjelPodaci = {
            odjel: podaciElement[0],
            odjel_naziv: podaciElement[1][0].odjel_naziv,
            //uputnice: podaciElement[1],
            broj_usluga: br_usluga,
            ukupno_iznos: Number(uk_part + uk_fond),
          };
          //console.log("odjelPodaci", odjelPodaci);
          klinikaPodaci.odjeli.push(odjelPodaci);
        }
        let brk_usluga = klinikaPodaci.odjeli
          .map((odjel) => odjel.broj_usluga)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        /* let uk_iznos = klinikaPodaci.odjeli
          .map((odjel) => Number(odjel.ukupno_iznos))
          .reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue),
            0
          )
          .valueOf(); */
        let ukk_iznos = 0;
        klinikaPodaci.odjeli.forEach((odjel) => {
          ukk_iznos += Number(odjel.ukupno_iznos);
        });
        klinikaPodaci.broj_usluga = brk_usluga;
        klinikaPodaci.ukupno_iznos = ukk_iznos;
        vrstaPodaci.klinike.push(klinikaPodaci);
      }
      let br_usluga = vrstaPodaci.klinike
        .map((klinika) => {
          return klinika.broj_usluga;
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      /* let uk_iznos = vrstaPodaci.klinike
        .map((klinika) => {
          return Number(klinika.ukupno_iznos);
        })
        .reduce(
          (accumulator, currentValue) => accumulator + Number(currentValue),
          0
        )
        .valueOf(); */
      let uk_iznos = 0;
      vrstaPodaci.klinike.forEach((klinika) => {
        uk_iznos += Number(klinika.ukupno_iznos);
      });
      vrstaPodaci.broj_usluga = br_usluga;
      vrstaPodaci.ukupno_iznos = uk_iznos;
      grupisanoFinalno.push(vrstaPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

export const uslugeKioTransformer = (data, setIzvjestajData) => {
  let usluge = [];
  data.map((uputnica) => {
    uputnica.map((usluga) => {
      usluge.push(usluga);
    });
  });
  let grupisanoFinalno = [];
  if (usluge.length > 0) {
    let grupisanoPoVrsti = [];
    const grupisanoByVrsta = Object.groupBy(usluge, ({ vrsta }) => vrsta);
    for (const podaciElement of Object.entries(grupisanoByVrsta)) {
      let vrstaPodaci = {
        vrsta:
          Number(podaciElement[0]) === 1
            ? "AMBULANTNE UPUTNICE"
            : "BOLNIČKE UPUTNICE",
        usluge: [],
      };
      vrstaPodaci.usluge.push(...podaciElement[1].flatMap((usluga) => usluga));
      grupisanoPoVrsti.push(vrstaPodaci);
    }
    for (const vrsta of grupisanoPoVrsti) {
      let vrstaPodaci = {
        vrsta: vrsta.vrsta,
        //broj_usluga: 0,
        //ukupno_iznos: 0,
        klinike: [],
      };
      const grupisanoByKlinika = Object.groupBy(
        vrsta.usluge,
        ({ klinika }) => klinika
      );
      for (const podaciElement of Object.entries(grupisanoByKlinika)) {
        let klinikaPodaci = {
          klinika: podaciElement[0],
          klinika_naziv: podaciElement[1][0].klinika_naziv,
          //uputnice: [],
          broj_usluga: Number(0),
          ukupno_iznos: Number(0),
          odjeli: [],
        };
        const grupisanoByOdjel = Object.groupBy(
          podaciElement[1],
          ({ odjel }) => odjel
        );
        for (const podaciElement of Object.entries(grupisanoByOdjel)) {
          let br_usluga = podaciElement[1].length;
          let odjelPodaci = {
            odjel: podaciElement[0],
            odjel_naziv: podaciElement[1][0].odjel_naziv,
            usluge: [],
            broj_usluga: br_usluga,
            ukupno_iznos: Number(0),
          };
          let bez = podaciElement[1].filter(
            (usluga) =>
              usluga.komerc_placanje === 1 || usluga.status_osiguranja === 0
          );
          const grupisanoBezBySifra = Object.groupBy(
            bez,
            ({ sifra_usluge }) => sifra_usluge
          );
          for (const podaciElement of Object.entries(grupisanoBezBySifra)) {
            let br_usl = 0;
            podaciElement[1].forEach((usluga) => {
              br_usl += Number(usluga.kolicina);
            });
            odjelPodaci.usluge.push({
              sifra_usluge: podaciElement[0],
              broj_usluga: br_usl,
              naziv: podaciElement[1][0].naziv,
              ukupan_iznos: podaciElement[1]
                .map(
                  (usluga) =>
                    Number(usluga.mpc_cijena) * Number(usluga.kolicina)
                )
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + Number(currentValue),
                  0
                )
                .valueOf(),
            });
          }
          let sa = podaciElement[1].filter(
            (usluga) =>
              usluga.komerc_placanje === 0 && usluga.status_osiguranja === 1
          );
          const grupisanoSaBySifra = Object.groupBy(
            sa,
            ({ sifra_usluge }) => sifra_usluge
          );
          for (const podaciElement of Object.entries(grupisanoSaBySifra)) {
            let br_usl = 0;
            podaciElement[1].forEach((usluga) => {
              br_usl += Number(usluga.kolicina);
            });
            odjelPodaci.usluge.push({
              sifra_usluge: podaciElement[0],
              broj_usluga: br_usl,
              naziv: podaciElement[1][0].naziv,
              ukupan_iznos: podaciElement[1]
                .map(
                  (usluga) =>
                    Number(usluga.fond_cijena) * Number(usluga.kolicina)
                )
                .reduce(
                  (accumulator, currentValue) =>
                    accumulator + Number(currentValue),
                  0
                )
                .valueOf(),
            });
          }
          let uk_iznos = odjelPodaci.usluge.map((usluga) =>
            Number(usluga.ukupan_iznos)
          );
          odjelPodaci.ukupno_iznos = Number(
            uk_iznos.reduce(
              (accumulator, currentValue) => accumulator + Number(currentValue),
              0
            )
          ).valueOf();
          klinikaPodaci.odjeli.push(odjelPodaci);
        }
        let br_usluga = klinikaPodaci.odjeli.map((odjel) => {
          return odjel.broj_usluga;
        });
        let uk_iznos = klinikaPodaci.odjeli.map((odjel) =>
          Number(odjel.ukupno_iznos)
        );
        klinikaPodaci.broj_usluga = br_usluga.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        );
        klinikaPodaci.ukupno_iznos = Number(
          uk_iznos.reduce(
            (accumulator, currentValue) => accumulator + Number(currentValue),
            0
          )
        ).valueOf();
        vrstaPodaci.klinike.push(klinikaPodaci);
      }
      grupisanoFinalno.push(vrstaPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

export const uslugeZBgrupeTransformer = (usluge, setIzvjestajData) => {
  let grupisanoFinalno = [];
  if (usluge.length > 0) {
    const grupisanoByUsluga = Object.groupBy(
      usluge,
      ({ sifra_usluge }) => sifra_usluge
    );
    const brojUsluga = (filtrirano) => {
      let br_usl = 0;
      filtrirano.forEach((usluga) => {
        br_usl += Number(usluga.kolicina);
      });
      return br_usl;
    };
    for (const podaciUsluge of Object.entries(grupisanoByUsluga)) {
      let uslugaPodaci = {
        sifra_usluge: podaciUsluge[0],
        naziv: podaciUsluge[1][0].naziv,
        ukupno_pretraga: brojUsluga(podaciUsluge[1]),
        br_bolnickih: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.vrsta === 2)
        ),
        br_ambulantnih: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.vrsta === 1)
        ),
        naplacena_participacija: brojUsluga(
          podaciUsluge[1].filter(
            (usluga) => usluga.vrsta === 1 && usluga.vid_osiguranja === 6
          )
        ),
        obavezni_vid: brojUsluga(
          podaciUsluge[1].filter(
            (usluga) => usluga.vrsta === 1 && usluga.vid_osiguranja === 1
          )
        ),
        neosigurani: brojUsluga(
          podaciUsluge[1].filter(
            (usluga) =>
              usluga.vrsta === 1 &&
              usluga.status_osiguranja === 0 &&
              usluga.vid_osiguranja === 0
          )
        ),
        hitne: brojUsluga(
          podaciUsluge[1].filter(
            (usluga) => usluga.vrsta === 1 && usluga.prioritet === 1
          )
        ),
      };
      grupisanoFinalno.push(uslugaPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

export const uslugeStarosneGrupeTransformer = (data, setIzvjestajData) => {
  let usluge = [];
  data.map((uputnica) => {
    uputnica.map((usluga) => {
      usluge.push(usluga);
    });
  });
  let grupisanoFinalno = [];
  if (usluge.length > 0) {
    const grupisanoByUsluga = Object.groupBy(
      usluge,
      ({ sifra_usluge }) => sifra_usluge
    );
    const brojUsluga = (filtrirano) => {
      let br_usl = 0;
      filtrirano.forEach((usluga) => {
        br_usl += Number(usluga.kolicina);
      });
      return br_usl;
    };
    for (const podaciUsluge of Object.entries(grupisanoByUsluga)) {
      let uslugaPodaci = {
        sifra_usluge: podaciUsluge[0],
        naziv: podaciUsluge[1][0].naziv,
        ukupno_pretraga: brojUsluga(podaciUsluge[1]),
        prva_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 1)
        ),
        druga_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 2)
        ),
        treca_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 3)
        ),
        cetvrta_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 4)
        ),
        peta_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 5)
        ),
        sesta_grupa: brojUsluga(
          podaciUsluge[1].filter((usluga) => usluga.starosna_grupa === 6)
        ),
      };
      grupisanoFinalno.push(uslugaPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

export const uslugeZbirnoTransformer = (usluge, setIzvjestajData) => {
  let grupisanoFinalno = [];
  if (usluge.length > 0) {
    const grupisanoByUsluga = Object.groupBy(
      usluge,
      ({ sifra_usluge }) => sifra_usluge
    );
    const brojUsluga = (filtrirano) => {
      let br_usl = 0;
      filtrirano.forEach((usluga) => {
        br_usl += Number(usluga.kolicina);
      });
      return br_usl;
    };
    for (const podaciUsluge of Object.entries(grupisanoByUsluga)) {
      let uslugaPodaci = {
        sifra_usluge: podaciUsluge[0],
        naziv: podaciUsluge[1][0].naziv,
        ukupno_pretraga: brojUsluga(podaciUsluge[1]),
      };
      grupisanoFinalno.push(uslugaPodaci);
    }
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

export const uslugeDoktoriTransformer = (data, setIzvjestajData) => {
  let grupisanoFinalno = [];
  const grupisanoByKlinika = Object.groupBy(data, ({ klinika }) => klinika);
  for (const podaciElement of Object.entries(grupisanoByKlinika)) {
    let klinikaPodaci = {
      klinika: podaciElement[0],
      klinika_naziv: podaciElement[1][0].klinika_naziv,
      ukupno_iznos: 0,
      doktori: [],
    };
    const grupisanoByDoktor = Object.groupBy(
      podaciElement[1],
      ({ uputio }) => uputio
    );
    for (const podaciElement of Object.entries(grupisanoByDoktor)) {
      let doktorPodaci = {
        doktor: podaciElement[0],
        prezime: podaciElement[1][0].prezime_doktora,
        ime: podaciElement[1][0].ime_doktora,
        ukupno_iznos: 0,
        usluge: [],
      };
      const grupisanoByUsluga = Object.groupBy(
        podaciElement[1],
        ({ sifra_usluge }) => sifra_usluge
      );
      const brojUsluga = (filtrirano) => {
        let br_usl = 0;
        filtrirano.forEach((usluga) => {
          br_usl += Number(usluga.kolicina);
        });
        return br_usl;
      };
      for (const podaciUsluge of Object.entries(grupisanoByUsluga)) {
        let kolicina = brojUsluga(podaciUsluge[1]);
        let uslugaPodaci = {
          sifra_usluge: podaciUsluge[0],
          naziv: podaciUsluge[1][0].naziv_usluge,
          kolicina: kolicina,
          ukupno_iznos: (kolicina * podaciUsluge[1][0].fond_cijena).toFixed(1),
        };
        doktorPodaci.usluge.push(uslugaPodaci);
      }
      let ukupno = doktorPodaci.usluge
        .map((usluga) => {
          return Number(usluga.ukupno_iznos);
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      doktorPodaci.ukupno_iznos = Number(ukupno).toFixed(1);
      klinikaPodaci.doktori.push(doktorPodaci);
    }
    let ukupno = klinikaPodaci.doktori
      .map((doktor) => {
        return Number(doktor.ukupno_iznos);
      })
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    klinikaPodaci.ukupno_iznos = Number(ukupno).toFixed(1);
    grupisanoFinalno.push(klinikaPodaci);
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};

/* export const brPacijenataTransformer = (data, setIzvjestajData) => {
  let grupisanoFinalno = [];
  const grupisanoByVrsta = Object.groupBy(data, ({ vrsta }) => vrsta);
  for (const podaciElement of Object.entries(grupisanoByVrsta)) {
    let vrstaPodaci = {
      vrsta: podaciElement[0] === "1" ? "AMBULANTNI" : "BOLNIČKI",
      vrsta_br_pacijenata: podaciElement[1].length,
      prioritet: [],
    };
    const grupisanoByPrioritet = Object.groupBy(
      podaciElement[1],
      ({ prioritet }) => prioritet
    );
    for (const podaciElement of Object.entries(grupisanoByPrioritet)) {
      let prioritetPodaci = {
        prioritet:
          podaciElement[0] === "1" || podaciElement[0] === "3"
            ? "REDOVNO"
            : "HITNO",
        prioritet_br_pacijenata: podaciElement[1].length,
      };
      vrstaPodaci.prioritet.push(prioritetPodaci);
    }
    grupisanoFinalno.push(vrstaPodaci);
  }
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
}; */

export const brPacijenataTransformer = (data, setIzvjestajData) => {
  let grupisanoFinalno = {
    br_amb_pac: 0,
    br_hit_amb_pac: 0,
    br_red_amb_pac: 0,
    br_bol_pac: 0,
    br_hit_bol_pac: 0,
    br_red_bol_pac: 0,
    br_pacijenata: data.length > 0 ? data.length : 0,
  };
  const grupisanoByVrsta = Object.groupBy(data, ({ vrsta }) => vrsta);
  if (Object.keys(grupisanoByVrsta).length > 0) {
    for (const vrstaElement of Object.entries(grupisanoByVrsta)) {
      vrstaElement[0] === "1"
        ? (grupisanoFinalno.br_amb_pac = vrstaElement[1].length)
        : (grupisanoFinalno.br_bol_pac = vrstaElement[1].length);
      const grupisanoByPrioritet = Object.groupBy(
        vrstaElement[1],
        ({ prioritet }) => prioritet
      );
      for (const prioritetElement of Object.entries(grupisanoByPrioritet)) {
        if (vrstaElement[0] === "1") {
          prioritetElement[0] === "1" /* || prioritetElement[0] === "3" */
            ? (grupisanoFinalno.br_hit_amb_pac = prioritetElement[1].length)
            : (grupisanoFinalno.br_red_amb_pac = prioritetElement[1].length);
        } else {
          prioritetElement[0] === "1" /* || prioritetElement[0] === "3" */
            ? (grupisanoFinalno.br_hit_bol_pac = prioritetElement[1].length)
            : (grupisanoFinalno.br_red_bol_pac = prioritetElement[1].length);
        }
      }
    }
  }
  console.warn("grupisanoFinalno", grupisanoFinalno);
  if (setIzvjestajData) setIzvjestajData(grupisanoFinalno);
  return grupisanoFinalno;
};
