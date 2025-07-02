import { useEffect } from "react";
import "./ConfirmModal.css";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";

const ConfirmModal = ({
  onConfirm,
  handleCloseConfirmModal,
  text,
  title,
  yesBtn,
  noBtn,
}) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const confirmSolution = () => {
    onConfirm();
    handleCloseConfirmModal();
  };

  const handleKeyPress = (event) => {
    //console.log("Key pressed key", event.key);
    if (event.key === "Enter") {
      confirmSolution();
    }
    if (event.key === "Backspace") {
      handleCloseConfirmModal();
    }
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        onClick={handleCloseConfirmModal}
      >
        <Dialog sx={{ minWidth: 643 }} maxWidth="md" open={true}>
          <DialogTitle sx={{ fontFamily: "Inter" }}>{title}</DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <h2>{text}</h2>
          </DialogContent>
          <DialogActions sx={{ fontFamily: "Inter" }}>
            <Button onClick={handleCloseConfirmModal} variant="contained">
              {noBtn}
            </Button>
            <Button
              onClick={confirmSolution}
              variant="contained"
              color="success"
            >
              {yesBtn}
            </Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </div>
  );
};

export default ConfirmModal;
