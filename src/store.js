/* eslint-disable no-unused-vars */
import { create } from "zustand";
import dayjs from "dayjs";

const store = (set) => ({
  sesijaPodaci: {},
  dodajSesiju: (data) => {
    set((store) => ({ sesijaPodaci: data }));
  },
  //korisnik: [],
  pretrage: [],
  unesiPretrage: (data) => {
    set((store) => ({ pretrage: data }));
  },
  /* pretrageSve: [],
  setPretrageSve: (data) => {
    set((store) => ({ pretrage: data }));
  }, */
  prikazi: { meni: "uputnice", naziv: "", data: [] },
  setIzvjestajData: (data) => {
    set((store) => ({
      prikazi: { ...store.prikazi, data: data },
    })); // data:data a ne data:[...data] jer izvjestaj broj pacijenata nije niz nego objekat a nije problem  ostalim izvjestajima
  },
  /*   odDat: dayjs(new Date()).format("DD.MM.YYYY"),
  doDat: dayjs(new Date()).format("DD.MM.YYYY"),
  setOdDat: (data) => {
    set((store) => ({ odDat: data }));
  },
  setDoDat: (data) => {
    set((store) => ({ doDat: data }));
  }, */
  datum: dayjs(new Date()).format("DD.MM.YYYY"),
  setDatum: (data) => {
    set((store) => ({ datum: data }));
  },
  odabranePretrage: [],
  odaberiPretragu: (data) => {
    set((store) => {
      const nalog = store.odabranePretrage.find(
        (nalog) => nalog.id === data.id
      );

      if (!nalog) {
        return {
          odabranePretrage: [
            ...store.odabranePretrage,
            { id: data.id, pretrage: [data.novaPretraga] },
          ],
        };
      }
      return {
        odabranePretrage: store.odabranePretrage.map((nalog) =>
          nalog.id === data.id
            ? {
                ...nalog,
                pretrage: nalog.pretrage.some(
                  (pretraga) => pretraga.id === data.novaPretraga.id
                )
                  ? nalog.pretrage.map((pretraga, index) =>
                      pretraga.id === data.novaPretraga.id
                        ? { ...pretraga, kolicina: pretraga.kolicina + 1 }
                        : pretraga
                    )
                  : [...nalog.pretrage, data.novaPretraga],
              }
            : nalog
        ),
      };
    });
  },
  oduzmiPretragu: (data) => {
    set((store) => {
      const nalog = store.odabranePretrage.find(
        (nalog) => nalog.id === data.id
      );

      if (!nalog) {
        return store; // no matching nalog, do nothing
      }

      const updatedPretrage = nalog.pretrage.map((pretraga) =>
        pretraga.id === data.novaPretraga.id
          ? { ...pretraga, kolicina: pretraga.kolicina - 1 }
          : pretraga
      );

      // ukloni pretraga ako kolicina dosegne 0
      const filteredPretrage = updatedPretrage.filter(
        (pretraga) => pretraga.kolicina > 0
      );

      return {
        odabranePretrage: store.odabranePretrage.map((nalog) =>
          nalog.id === data.id
            ? { ...nalog, pretrage: filteredPretrage }
            : nalog
        ),
      };
    });
  },
  /*   odaberiPretragu: (data) => {
    set((store) => {
      const nalog = store.odabranePretrage.find(
        (nalog) => nalog.id === data.id
      );

      if (!nalog) {
        return {
          odabranePretrage: [
            ...store.odabranePretrage,
            { id: data.id, pretrage: [data.novaPretraga] },
          ],
        };
      }
      return {
        odabranePretrage: store.odabranePretrage.map((nalog) =>
          nalog.id === data.id
            ? { ...nalog, pretrage: [...nalog.pretrage, data.novaPretraga] }
            : nalog
        ),
      };
    });
  }, */
  /*   odaberiPretragu: (pretraga) => {
    set((store) => ({
      odabranePretrage: [...store.odabranePretrage, pretraga],
    }));
  }, */
  openProvjeraCijene: false,
  setOpenProvjeraCijene: (data) => {
    set((store) => ({ openProvjeraCijene: data }));
  },
  odabranePretrageProvjere: [],
  setOdabranePretrageProvjere: (data) => {
    set((store) => ({
      odabranePretrageProvjere: data,
    }));
  },
  statusProvjera: {
    osiguran: true,
    komerc: false,
    neosiguran: false,
  },
  setStatusProvjera: (data) => {
    set((store) => ({
      statusProvjera: data,
    }));
  },
  unesiPretrageUputnice: (data) => {
    set((store) => {
      const nalog = store.odabranePretrage.find(
        (nalog) => nalog.id === data.id
      );
      if (!nalog) {
        return {
          odabranePretrage: [
            ...store.odabranePretrage,
            { id: data.id, pretrage: data.novePretrage },
          ],
        };
      }
      return {
        odabranePretrage: store.odabranePretrage.map((nalog) =>
          nalog.id === data.id
            ? {
                ...nalog,
                pretrage: [
                  ...nalog.pretrage,
                  ...data.novePretrage.filter(
                    (novaPretraga) =>
                      !nalog.pretrage.some((p) => p.id === novaPretraga.id)
                  ),
                ],
              }
            : nalog
        ),
      };
    });
  },
  /*   unesiPretrageUputnice: (data) => {
    set((store) => ({ odabranePretrage: data }));
  }, */
  /*   ponistiPretragu: (pretraga) => {
    set((store) => ({
      odabranePretrage: store.odabranePretrage.filter((p) => p.id !== pretraga),
    }));
  }, */
  ponistiPretragu: (data) => {
    set((store) => ({
      odabranePretrage: store.odabranePretrage.map((nalog) =>
        nalog.id === data.id
          ? {
              ...nalog,
              pretrage: nalog.pretrage.filter(
                (pretraga) => pretraga.id !== data.pretragaId
              ),
            }
          : nalog
      ),
    }));
  },
  /*  ponistiPretragu: (id) => {
    set((store) => ({
      odabranePretrage: store.odabranePretrage.filter((p) => p.id !== id),
    }));
  }, */
  ponistiNalog: (id) => {
    set((store) => ({
      odabranePretrage: store.odabranePretrage.filter(
        (nalog) => nalog.id !== id
      ),
    }));
  },
  pretragaZaIzmjenu: null,
  unesiPretraguZaIzmjenu: (usluga) => {
    set((store) => ({ pretragaZaIzmjenu: usluga }));
  },
  podaciUputnice: {},
  setPodaciUputnice: (data) => {
    set((store) => ({ podaciUputnice: data }));
  },
  otvoriNovaPretraga: { open: false, izmjena: false, data: {} },
  setOtvoriNovaPretraga: (data) => {
    set((store) => ({ otvoriNovaPretraga: data }));
  },
  otvoriNovaUsluga: { open: false, izmjena: false, data: {} },
  setOtvoriNovaUsluga: (data) => {
    set((store) => ({ otvoriNovaUsluga: data }));
  },
  osnoviOslobadjanja: [],
  setOsnoviOslobadjanja: (osnovi) => {
    set((store) => ({ osnoviOslobadjanja: osnovi }));
  },
  osnovOsiguranja: [],
  setOsnovOsiguranja: (lista) => {
    set((store) => ({ osnovOsiguranja: lista }));
  },
  columnVisibility: {
    kreirano_korisnik: false,
  },
  columnVisibilityPretraga: {
    kreirano_korisnik: false,
  },
  globalFilter: "",
  globalFilterPretraga: "",
  isLoading: false,
  setIsLoading: (data) => {
    set((store) => ({ isLoading: data }));
  },
  odabraniDoktor: {
    value: "",
    label: "",
  },
  otvoriPrivilegije: { open: false, laborant: {}, promjena: [] },
  otvoriArhivaUputnicu: { open: false, uputnica: {} },
  otvoriPrintOvjere: false,
  setOtvoriPrintOvjere: (data) => {
    set((store) => ({ otvoriPrintOvjere: data }));
  },
  otvoriPrintUplatnice: false,
  setOtvoriPrintUplatnice: (data) => {
    set((store) => ({ otvoriPrintUplatnice: data }));
  },
  openLoader: true,
  setOpenLoader: (data) => {
    set((store) => ({ openLoader: data }));
  },
  invalidateSifrarnikPretrage: false,
});

export const useStore = create(store);
