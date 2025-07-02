import { useStore } from "../../../store.js";
import "./CredentialsModal.css";
import CredentialsBox from "./CredentialsBox.jsx";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CredentialsModal = ({ savePrivilegije, privilegije, notifikacija }) => {
  const user = useStore((store) => store.otvoriPrivilegije.laborant);
  const zaPromjenu = useStore((store) => store.otvoriPrivilegije.promjena);
  const odaberiPrivilegiju = (id_privilegije) => {
    if (!id_privilegije || !user.privilegije) {
      //console.error("Invalid parameters");
      return;
    }
    //console.log("id_privilegije", id_privilegije);
    useStore.setState((state) => {
      if (!state.otvoriPrivilegije || !state.otvoriPrivilegije.laborant) {
        //console.error("Invalid state");
        return state;
      }
      const laborant = state.otvoriPrivilegije.laborant;
      const promjena = state.otvoriPrivilegije.promjena;
      const privilegije = laborant.privilegije.includes(id_privilegije)
        ? laborant.privilegije.filter((id) => id !== id_privilegije)
        : [...laborant.privilegije, id_privilegije];
      const izmjena = promjena.includes(id_privilegije)
        ? promjena.filter((id) => id !== id_privilegije)
        : [...promjena, id_privilegije];
      return {
        otvoriPrivilegije: {
          ...state.otvoriPrivilegije,
          laborant: {
            ...laborant,
            privilegije,
          },
          promjena: izmjena,
        },
      };
    });
  };

  const handleClose = () => {
    useStore.setState({
      otvoriPrivilegije: { open: false, laborant: {} },
    });
  };

  // console.log("user", user);
  /*  console.log(
    "promjena",
    useStore((store) => store.otvoriPrivilegije.promjena)
  ); */
  return (
    <Dialog maxWidth="md" fullWidth={true} open={true} sx={{ height: "100%" }}>
      <DialogTitle sx={{ fontFamily: "Inter", fontSize: "1.25rem" }}>
        KORISNIK {user.ime} {user.prezime} privilegije:
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.error.main,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ p: 0 }}>
        <div className="privilegije">
          {privilegije.map((privilegija, index) => (
            <CredentialsBox
              key={index}
              privilegija={privilegija}
              lista={user.privilegije}
              odaberiPrivilegiju={(id) => odaberiPrivilegiju(id)}
              disabled={
                (user.id === 2152 && privilegija === "Administracija") ||
                (user.id === 2153 && privilegija === "Administracija")
              }
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="success" variant="contained" onClick={handleClose}>
          Otkaži
        </Button>
        <Button
          color="primary"
          variant="contained"
          disabled={useStore(
            (store) => store.otvoriPrivilegije.promjena.length === 0
          )}
          onClick={() => savePrivilegije(zaPromjenu, user.id)}
        >
          Sačuvaj
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CredentialsModal;
