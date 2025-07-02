import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Slide from "@mui/material/Slide";

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

const Toast = ({ severity, message, duration, open, setOpen }) => {
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen();
  };
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%", fontSize: "1.25em" }}
        >
          <AlertTitle>
            {severity === "success"
              ? "Uspješno"
              : severity === "info"
              ? "Info"
              : severity === "warning"
              ? "Upozorenje"
              : "Greška"}
          </AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Toast;
