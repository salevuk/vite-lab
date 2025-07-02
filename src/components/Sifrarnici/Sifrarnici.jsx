import {
  Fragment,
  useCallback,
  useEffect,
  useMemo /* useState */,
} from "react";
import { useStore } from "../../store";
import {
  mkb2Transformer,
  uslugeTransformer,
  uslugeUkcTransformer,
  uslugeLabTransformer,
  komercUslugeTransformer,
  doktoriTransformer,
} from "../util/transformer";
import CredentialsModal from "../../components/Modals/Privilegije/CredentialsModal";
import MKB from "./MKB";
import Usluge from "./Usluge";
import UslugeUKC from "./UslugeUKC";
import UslugeLab from "./UslugeLab";
import KomercijalneUsluge from "./KomercijalneUsluge";
import LabPretrage from "./LabPretrage";
import Materijal from "./Materijal";
//import ListaSifrarnika from "./ListaSifrarnika";
import IzborSifrarnika from "./IzborSifrarnika";
import StarosneGrupe from "./StarosneGrupe";
import KategorijeOsiguranja from "./KategorijeOsiguranja";
import OsnoveOslobadjanja from "./OsnoveOslobadjanja";
import StatusPacijenta from "./StatusPacijenta";
import ZdravstvenaUstanova from "./ZdravstvenaUstanova";
import Klinike from "./Klinike";
import Odjeli from "./Odjeli";
import Osoblje from "./Osoblje";
import Ordinacije from "./Ordinacije";
import DoktoriRS from "./DoktoriRS";
import DoktoriUKC from "./DoktoriUKC";

const Sifrarnici = ({
  idKorisnika,
  privilegije,
  notifikacija,
  invalidateSesija,
}) => {
  const store = useStore(); //pristup store-u
  const isLoading = useStore((store) => store.isLoading);
  const setIsLoading = useStore((store) => store.setIsLoading);
  const otvoriPrivilegije = useStore((store) => store.otvoriPrivilegije);
  const setIzvjestajData = useStore((store) => store.setIzvjestajData);
  const invalidateSifrarnikPretrage = useStore(
    (store) => store.invalidateSifrarnikPretrage
  );

  const povuciIzbor = useCallback(async (sifrarnik) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=izbor_sifrarnika&sifrarnik=${sifrarnik}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        //signal: signal,
      }
    );
    return await response.json();
  }, []);
  let title = "";
  switch (store.prikazi.naziv) {
    case "mkb":
      title = "MKB";
      break;
    case "usluge":
      title = "Fond usluge";
      break;
    case "uslugeukc":
      title = "Usluge UKC - cjenovnik";
      break;
    case "komercijalne_usluge":
      title =
        "Komercijalne usluge laboratorije po pretragama - komercijalni cjenovnik";
      break;
    case "usluge_lab":
      title = "Usluge laboratorije po pretragama - nekomercijalni cijenovnik";
      break;
    case "lab.pretrage":
      title = "Laboratorijske pretrage";
      break;
    case "materijal":
      title = "Materijal";
      break;
    case "starosne_grupe":
      title = "Starosne grupe";
      break;
    case "kategorije_osiguranja":
      title = "Kategorije osiguranja";
      break;
    case "osnove_oslobadjanja":
      title = "Osnove oslobađanja od participacije";
      break;
    case "status_pacijenta":
      title = "Status pacijenta";
      break;
    case "zdravstvena_ustanova":
      title = "Zdravstvene ustanove";
      break;
    case "klinike":
      title = "Klinike";
      break;
    case "odjeli":
      title = "Odjeli";
      break;
    case "osoblje":
      title = "Personal";
      break;
    case "ordinacije":
      title = "Ordinacije porodične medicine";
      break;
    case "doktorirs":
      title = "Doktori RS";
      break;
    case "doktoriukc":
      title = "Doktori UKC";
      break;
    default:
      title = "Šifrarnici";
  }

  useEffect(() => {
    if (invalidateSifrarnikPretrage) return;
    setIsLoading(true);
    povuciIzbor(store.prikazi.naziv).then((r) => {
      if (store.prikazi.naziv === "mkb") {
        mkb2Transformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "usluge") {
        uslugeTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "uslugeukc") {
        console.error("USLUGEUKC", r);
        uslugeUkcTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "usluge_lab") {
        uslugeLabTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "komercijalne_usluge") {
        komercUslugeTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "doktorirs") {
        doktoriTransformer(r.lista, setIzvjestajData);
      } else {
        useStore.setState({ prikazi: { ...store.prikazi, data: r.lista } });
      }
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, [povuciIzbor, store.prikazi.naziv]);
  console.warn("ŠIFRARNIK PRIKAŽI", store.prikazi);
  useEffect(() => {
    if (!invalidateSifrarnikPretrage) return;
    povuciIzbor(store.prikazi.naziv).then((r) => {
      if (store.prikazi.naziv === "usluge_lab") {
        uslugeLabTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "komercijalne_usluge") {
        komercUslugeTransformer(r.lista, setIzvjestajData);
      } else if (store.prikazi.naziv === "uslugeukc") {
        uslugeUkcTransformer(r.lista, setIzvjestajData);
      } else {
        useStore.setState({ prikazi: { ...store.prikazi, data: r.lista } });
      }
      useStore.setState({ invalidateSifrarnikPretrage: false });
    }); // eslint-disable-next-line
  }, [invalidateSifrarnikPretrage]);

  const savePrivilegije = async (privilegije, id) => {
    //console.log("PRIVILEGIJE ZA ČUVANJE", privilegije);
    const promises = [];
    for (const p of privilegije) {
      const newData = new URLSearchParams();
      newData.append("id_privilegije", p.toString());
      newData.append("laborant", id.toString());
      promises.push(
        fetch(`../rpc/laboratorija.cfc?method=sacuvaj_privilegije`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: newData,
        })
      );
    }
    await Promise.all(promises)
      .then((responses) => {
        const errorResponses = responses.filter((r) => !r.ok);
        if (errorResponses.length > 0) {
          notifikacija(true, "Greška pri spremanju privilegija", "error", 3000);
        }
      })
      .catch((error) => {
        notifikacija(true, error.message, "error", 3000);
      });
    if (idKorisnika === id) {
      invalidateSesija();
      povuciIzbor("osoblje").then((r) => {
        useStore.setState({ prikazi: { ...store.prikazi, data: r.lista } });
      });
    } else {
      povuciIzbor("osoblje").then((r) => {
        useStore.setState({ prikazi: { ...store.prikazi, data: r.lista } });
      });
    }
    notifikacija(true, "Privilegije uspješno spremljene", "success", 3000);
  };

  let data = useMemo(() => store.prikazi.data, [store.prikazi.data]);

  return (
    <Fragment>
      {otvoriPrivilegije.open && (
        <CredentialsModal
          privilegije={privilegije}
          notifikacija={notifikacija}
          savePrivilegije={savePrivilegije}
        />
      )}
      <IzborSifrarnika title={title} />
      {store.prikazi.naziv === "mkb" && <MKB data={data} loading={isLoading} />}
      {store.prikazi.naziv === "usluge" && (
        <Usluge data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "uslugeukc" && (
        <UslugeUKC data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "usluge_lab" && (
        <UslugeLab data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "komercijalne_usluge" && (
        <KomercijalneUsluge data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "lab.pretrage" && (
        <LabPretrage data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "materijal" && (
        <Materijal data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "kategorije_osiguranja" && (
        <KategorijeOsiguranja data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "osnove_oslobadjanja" && (
        <OsnoveOslobadjanja data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "status_pacijenta" && (
        <StatusPacijenta data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "starosne_grupe" && (
        <StarosneGrupe data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "zdravstvena_ustanova" && (
        <ZdravstvenaUstanova data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "klinike" && (
        <Klinike data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "odjeli" && (
        <Odjeli data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "osoblje" && (
        <Osoblje data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "ordinacije" && (
        <Ordinacije data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "doktorirs" && (
        <DoktoriRS data={data} loading={isLoading} />
      )}
      {store.prikazi.naziv === "doktoriukc" && (
        <DoktoriUKC data={data} loading={isLoading} />
      )}
    </Fragment>
  );
};

export default Sifrarnici;
