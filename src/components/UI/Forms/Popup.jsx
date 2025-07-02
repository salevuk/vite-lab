import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Controls from "../Controls/Controls";
//import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
//import Slide from "@mui/material/Slide";
import Grow from "@mui/material/Grow";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow /* direction="up" */ ref={ref} {...props} />;
});

export default function Popup(props) {
  const {
    title,
    children,
    openPopup,
    setOpenPopup,
    maxWidth,
    izborDatuma,
    fullScreen,
    fullWidth,
    backdropNonClose,
    pretraga,
  } = props;

  const useStyles = makeStyles({
    dialogWrapper: {
      //padding: "0 0 16",
      position: "absolute",
      margin: "8px",
      width: "calc(100% - 16px)",
      maxHeight: "calc(100% - 16px)",
      minHeight:
        title === "PROVJERA CIJENE PRETRAGA - U UPUTNICI" ? "" : "fit-content",
      //top: 8, ovde se određuje height (min i max) modala
    },
    dialogTitle: {
      padding:
        title === "PROVJERA CIJENE PRETRAGA - U UPUTNICI"
          ? "0 1.26vw"
          : "0.2vw 1.26vw",
      backgroundColor: "#d9d9d9",
      borderRadius: "5px 5px 0 0",
    },
    typography: {
      fontFamily: "Inter",
      fontSize:
        title === "PROVJERA CIJENE PRETRAGA - U UPUTNICI" ? "1vw" : "1.2vw",
    },
    "& .MuiDialogContent-root": {
      padding: "16px 24px 12px 24px",
    },
  });

  const classes = useStyles();

  const onBackDropClickHandler = () => {
    setOpenPopup();
  };

  return (
    <Dialog
      open={openPopup}
      fullScreen={fullScreen}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      //classes={{ paper: classes.dialogWrapper }}
      /* sx={{
        "& .MuiDialog-paper": {
          minHeight:
            title === "PROVJERA CIJENE PRETRAGA - U UPUTNICI"
              ? "90%"
              : "fit-content",
        },
      }} */
      onClose={backdropNonClose ? () => {} : onBackDropClickHandler}
      TransitionComponent={Transition}
    >
      <DialogTitle className={classes.dialogTitle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            component="div"
            style={{
              flexGrow: 1,
              color: "#067bc2",
              textAlign: pretraga ? "left" : "center",
              fontWeight: "500",
            }}
            className={classes.typography}
          >
            {title}
          </Typography>
          {izborDatuma}
          <Controls.ActionButton onClick={setOpenPopup} provjera={true}>
            <CloseRoundedIcon />
          </Controls.ActionButton>
        </div>
      </DialogTitle>
      <DialogContent
        dividers
        sx={
          title === "LISTA BOLNIČKIH UPUTNICA" ||
          title === "LISTA REZULTATA LABARTORIJSKIH ANALIZA"
            ? {
                overflowY: "hidden !important",
                padding: "2px !important",
                /* "& .MuiPaper-root": {
                  height: "55% !important",
                }, */
              }
            : title === "PROVJERA CIJENE PRETRAGA - U UPUTNICI"
            ? {
                display: "contents",
                overflowY: "auto !important",
                padding: "2px !important",
                /* "& .MuiPaper-root": {
                  height: "55% !important",
                }, */
              }
            : {
                overflowY: "auto !important",
                padding: "2px !important",
                /* "& .MuiPaper-root": {
                  height: "55% !important",
                }, */
              }
        }
      >
        {children}
      </DialogContent>
    </Dialog>
  );
}
