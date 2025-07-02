import { useStore } from "../../../store";
import { Button } from "@mui/material";
import "./Menu.css";

const Menu = ({ title }) => {
  //const store = useStore();
  const prikazi = useStore((store) => store.prikazi);
  const sesijaPodaci = useStore((store) => store.sesijaPodaci);
  const setOtvoriNovaPretraga = useStore(
    (store) => store.setOtvoriNovaPretraga
  );
  const setOtvoriNovaUsluga = useStore((store) => store.setOtvoriNovaUsluga);
  //const setIsLoading = useStore((store) => store.setIsLoading);

  const prikaziMeni = (meni, naziv) => {
    if (prikazi.meni !== meni) {
      if (naziv !== "") {
        useStore.setState({
          prikazi: { meni: meni, naziv: naziv, data: [] },
        });
      } else {
        useStore.setState({
          prikazi: { meni: meni, naziv: "", data: [] },
        });
      }
    } else if (prikazi.meni === meni && prikazi.naziv !== naziv) {
      useStore.setState({
        prikazi: { meni: meni, naziv: naziv, data: [] },
      });
    } else if (prikazi.meni === meni && prikazi.naziv === naziv) {
      return;
    }
  };

  const { id_korisnika, grupa_korisnika } = sesijaPodaci;
  const licenceToView =
    id_korisnika === 2152 ||
    id_korisnika === 1983 ||
    grupa_korisnika.includes("1");

  return (
    <div className="dropdown_lu">
      <Button
        sx={{
          fontSize:
            "clamp(1rem, -0.4539rem + 1.3158vw, 1.125rem)" /* "0.94vw" */ /*"18px"*/,
          fontFamily: "Inter",
          margin: "0",
          height: "-webkit-fill-available",
          borderRadius: "5px 0 0 0",
          padding: "0.71vw 1.25vw" /* "11px 24px" */,
          cursor: "pointer",
          backgroundColor: "#004777",
          color: "var(--color-primary-150)",
          "&:hover": {
            backgroundColor: "#005994",
          },
        }}
      >
        {title}
      </Button>
      <div className="dropdown_content_lu">
        {prikazi !== "arhiva" && (
          <div
            className={`izbor_lu ${
              prikazi.meni === "arhiva" ? "active" : null
            }`}
          >
            <div onClick={() => prikaziMeni("arhiva", "", [])}>
              Arhiva Labmedic
            </div>
          </div>
        )}
        {prikazi !== "uputnice" && (
          <div
            className={`izbor_lu ${
              prikazi.meni === "uputnice" ? "active" : null
            }`}
          >
            <div onClick={() => prikaziMeni("uputnice", "", [])}>Uputnice</div>
          </div>
        )}
        <div
          className={`izbor_lu ${
            prikazi.meni === "izvjestaji" ? "active2" : null
          }`}
        >
          <div onClick={() => prikaziMeni("izvjestaji", "naplaceno", [])}>
            Izvještaji
          </div>
          <div className="dropdown_submenu1">
            <div
              className={`izbor_iz ${
                prikazi.naziv === "naplaceno" ||
                prikazi.naziv === "naplaceno_po_pacijentu" ||
                prikazi.naziv === "naplaceno_komercijalno"
                  ? "active2"
                  : null
              }`}
            >
              <div onClick={() => prikaziMeni("izvjestaji", "naplaceno", [])}>
                Naplaćene usluge
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "naplaceno" ? "active" : null
                  }`}
                  onClick={() => prikaziMeni("izvjestaji", "naplaceno", [])}
                >
                  Naplaćeno
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "naplaceno_po_pacijentu" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "naplaceno_po_pacijentu", [])
                  }
                >
                  Naplaćeno po pacijentima
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "naplaceno_komercijalno" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "naplaceno_komercijalno", [])
                  }
                >
                  Naplaćeno komercijalno
                </div>
              </div>
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "realizacija" ? "active" : null
              }`}
              onClick={() => prikaziMeni("izvjestaji", "realizacija", [])}
            >
              Realizacija službe
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "usluge_pokio_zbirno" ||
                prikazi.naziv === "usluge_po_kio" ||
                prikazi.naziv === "usluge_zb_grupe" ||
                prikazi.naziv === "usluge_starosne_grupe" ||
                prikazi.naziv === "usluge_zbirno_ukupno"
                  ? "active2"
                  : null
              }`}
            >
              <div
                onClick={() =>
                  prikaziMeni("izvjestaji", "usluge_pokio_zbirno", [])
                }
              >
                Usluge - periodično
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "usluge_pokio_zbirno" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "usluge_pokio_zbirno", [])
                  }
                >
                  Usluge po klinikama i odjelima zbirno
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "usluge_po_kio" ? "active" : null
                  }`}
                  onClick={() => prikaziMeni("izvjestaji", "usluge_po_kio", [])}
                >
                  Usluge po klinikama i odjelima
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "usluge_zb_grupe" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "usluge_zb_grupe", [])
                  }
                >
                  Usluge zbirno grupe
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "usluge_starosne_grupe" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "usluge_starosne_grupe", [])
                  }
                >
                  Usluge po starosnim grupama
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "usluge_zbirno_ukupno" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "usluge_zbirno_ukupno", [])
                  }
                >
                  Usluge zbirno ukupno
                </div>
              </div>
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "usluge_doktori" ? "active" : null
              }`}
              onClick={() => prikaziMeni("izvjestaji", "usluge_doktori", [])}
            >
              Tražene usluge po doktorima
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "usluge_pacijenti" ? "active" : "unknown"
              }`}
              //onClick={() => prikaziMeni("izvjestaji", "usluge_pacijenti", [])}
            >
              Dijagnostičke usluge grupisane po pacijentima
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "br_pacijenata" ||
                prikazi.naziv === "br_pacijenata_korisnik"
                  ? "active2"
                  : null
              }`}
            >
              <div
                onClick={() => prikaziMeni("izvjestaji", "br_pacijenata", [])}
              >
                Broj pacijenata
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "br_pacijenata" ? "active" : null
                  }`}
                  onClick={() => prikaziMeni("izvjestaji", "br_pacijenata", [])}
                >
                  Broj pacijenata
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "br_pacijenata_korisnik" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "br_pacijenata_korisnik", [])
                  }
                >
                  Broj pacijenata po personalu (korisniku)
                </div>
              </div>
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "br_pac_starosne_grupe" ? "active" : "unknown"
              }`}
              /* onClick={() =>
                prikaziMeni("izvjestaji", "br_pac_starosne_grupe", [])
              } */
            >
              Broj pacijenata po starosnim grupama
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "protokol_ambulantni" ||
                prikazi.naziv === "protokol_bolnicki"
                  ? "active2"
                  : null
              }`}
            >
              <div
                onClick={() =>
                  prikaziMeni("izvjestaji", "protokol_ambulantni", [])
                }
              >
                Protokol
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "protokol_ambulantni" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "protokol_ambulantni", [])
                  }
                >
                  Ambulantni
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "protokol_bolnicki" ? "active" : null
                  }`}
                  onClick={() =>
                    prikaziMeni("izvjestaji", "protokol_bolnicki", [])
                  }
                >
                  Bolnički
                </div>
              </div>
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "stornirano" ? "active" : null
              }`}
              onClick={() => prikaziMeni("izvjestaji", "stornirano", [])}
            >
              Stornirano
            </div>
          </div>
        </div>
        <div
          className={`izbor_lu ${
            prikazi.meni === "sifrarnici" ? "active2" : null
          }`}
        >
          <div onClick={() => prikaziMeni("sifrarnici", "mkb", [])}>
            Šifrarnici
          </div>
          <div className="dropdown_submenu1">
            <div
              className={`izbor_iz ${
                prikazi.naziv === "mkb" ? "active" : null
              }`}
              onClick={() => {
                prikaziMeni("sifrarnici", "mkb", []);
              }}
            >
              MKB
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "usluge" ? "active" : null
              }`}
              onClick={() => {
                prikaziMeni("sifrarnici", "usluge", []);
              }}
            >
              Fond usluge
            </div>
            {licenceToView && (
              <div
                className={`izbor_iz ${
                  prikazi.naziv === "uslugeukc" ? "active" : null
                }`}
                onClick={() => {
                  prikaziMeni("sifrarnici", "uslugeukc", []);
                }}
              >
                Usluge UKC
              </div>
            )}
            {licenceToView && (
              <div
                className={`izbor_iz ${
                  prikazi.naziv === "usluge_lab" ? "active" : null
                }`}
                onClick={() => {
                  prikaziMeni("sifrarnici", "usluge_lab", []);
                }}
              >
                Usluge lab.
              </div>
            )}
            {licenceToView && (
              <div
                className={`izbor_iz ${
                  prikazi.naziv === "komercijalne_usluge" ? "active" : null
                }`}
                onClick={() => {
                  prikaziMeni("sifrarnici", "komercijalne_usluge", []);
                }}
              >
                Komercijalne usluge lab.
              </div>
            )}
            <div
              className={`izbor_iz ${
                prikazi.naziv === "lab.pretrage" ? "active" : null
              }`}
              onClick={() => {
                prikaziMeni("sifrarnici", "lab.pretrage", []);
              }}
            >
              Lab. pretrage
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "materijal" ? "active" : null
              }`}
              onClick={() => {
                prikaziMeni("sifrarnici", "materijal", []);
              }}
            >
              Materijal
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "kategorije_osiguranja" ||
                prikazi.naziv === "osnove_oslobadjanja" ||
                prikazi.naziv === "status_pacijenta" ||
                prikazi.naziv === "starosne_grupe"
                  ? "active2"
                  : null
              }`}
            >
              <div
                onClick={() => {
                  prikaziMeni("sifrarnici", "kategorije_osiguranja", []);
                }}
              >
                Ostali šifrarnici
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "kategorije_osiguranja" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "kategorije_osiguranja", []);
                  }}
                >
                  Kategorije osiguranja
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "osnove_oslobadjanja" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "osnove_oslobadjanja", []);
                  }}
                >
                  Osnove osl. od participacije
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "status_pacijenta" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "status_pacijenta", []);
                  }}
                >
                  Status pacijenta
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "starosne_grupe" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "starosne_grupe", []);
                  }}
                >
                  Starosne grupe
                </div>
              </div>
            </div>
            <div
              className={`izbor_iz ${
                prikazi.naziv === "zdravstvena_ustanova" ||
                prikazi.naziv === "klinike" ||
                prikazi.naziv === "odjeli" ||
                prikazi.naziv === "osoblje" ||
                prikazi.naziv === "ordinacije" ||
                prikazi.naziv === "doktorirs" ||
                prikazi.naziv === "doktoriukc"
                  ? "active2"
                  : null
              }`}
            >
              <div
                onClick={() => {
                  prikaziMeni("sifrarnici", "zdravstvena_ustanova", []);
                }}
              >
                Administracija
              </div>
              <div className="dropdown_submenu2">
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "zdravstvena_ustanova" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "zdravstvena_ustanova", []);
                  }}
                >
                  Zdravstvena ustanova
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "klinike" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "klinike", []);
                  }}
                >
                  Klinike
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "odjeli" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "odjeli", []);
                  }}
                >
                  Odjeli
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "osoblje" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "osoblje", []);
                  }}
                >
                  Osoblje
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "ordinacije" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "ordinacije", []);
                  }}
                >
                  Ordinacije porodične med.
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "doktorirs" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "doktorirs", []);
                  }}
                >
                  Doktori RS
                </div>
                <div
                  className={`izbor_iz ${
                    prikazi.naziv === "doktoriukc" ? "active" : null
                  }`}
                  onClick={() => {
                    prikaziMeni("sifrarnici", "doktoriukc", []);
                  }}
                >
                  Doktori UKC
                </div>
              </div>
            </div>
          </div>
        </div>
        {prikazi !== "novapretraga" && licenceToView && (
          <div
            className={`izbor_lu ${
              prikazi.meni === "novapretraga" ? "active" : null
            }`}
          >
            <div
              onClick={() =>
                setOtvoriNovaPretraga({
                  open: true,
                  izmjena: false,
                  data: {},
                })
              }
            >
              Nova pretraga
            </div>
          </div>
        )}
        {prikazi !== "novausluga" && licenceToView && (
          <div
            className={`izbor_lu ${
              prikazi.meni === "novausluga" ? "active" : null
            }`}
          >
            <div
              onClick={() =>
                setOtvoriNovaUsluga({
                  open: true,
                  izmjena: false,
                  data: {},
                })
              }
            >
              Nova usluga
            </div>
          </div>
        )}
        {/*prikazi !== "obracun" && (
          <div
            className={`izbor_lu ${
              prikazi.meni === "obracun" ? "active" : null
            }`}
          >
            <div onClick={() => prikaziMeni("obracun", "popravak", [])}>
              POPRAVAK
            </div>
          </div>
        )*/}
      </div>
    </div>
  );
};

export default Menu;
