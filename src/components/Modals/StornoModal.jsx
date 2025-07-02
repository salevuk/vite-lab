import { useState, useRef } from "react";
import "./StornoModal.css";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const StornoModal = ({
  onConfirm,
  handleCloseConfirmModal,
  text,
  title,
  yesBtn,
  noBtn,
}) => {
  const [error, setError] = useState({ value: false, text: "" });
  const razlogRef = useRef();
  const confirmSolution = () => {
    //console.log("razlog", razlogRef.current.value, razlogRef);
    if (razlogRef.current.value === "") {
      setError({ value: true, text: "Razlog storniranja je obavezan!" });
      return;
    } else if (razlogRef.current.value.length < 5) {
      setError({
        value: true,
        text: "Razlog storniranja mora imati najmanje 5 znakova",
      });
      return;
    } else {
      onConfirm(razlogRef.current.value);
      handleCloseConfirmModal();
    }
  };
  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }}
        open={true}
        //onClick={handleCloseConfirmModal}
      >
        <Dialog sx={{ minWidth: 643 }} maxWidth="md" open={true}>
          <DialogTitle sx={{ fontFamily: "Inter" }}>{title}</DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <h2>{text}</h2>
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { ml: 3, mb: 2, width: "35ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                inputRef={razlogRef}
                type="text"
                id="razlog"
                name="razlog"
                label="Unesi razlog storniranja"
                size="small"
                error={error.value}
                helperText={error.text}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ fontFamily: "Inter" }}>
            <Button onClick={handleCloseConfirmModal} variant="contained">
              {noBtn}
            </Button>
            <Button onClick={confirmSolution} variant="contained" color="error">
              {yesBtn}
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </div>
  );
};

export default StornoModal;
