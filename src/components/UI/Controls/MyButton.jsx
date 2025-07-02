import React, { useRef, useImperativeHandle } from "react";
import { CircularProgress, Button as MuiButton } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((/* theme */) => ({
  root: {
    margin: 4,
    fontFamily: "Inter",
  },
  label: {
    textTransform: "none",
  },
}));

const MyButton = React.forwardRef(
  (
    {
      text,
      size,
      sacuvaj,
      sx,
      color,
      disabled,
      variant,
      onClick,
      loaderColor,
      loading,
      startIcon,
    },
    ref
  ) => {
    const inputRef = useRef();

    const focus = () => {
      inputRef.current["focus"]();
    };

    useImperativeHandle(ref, () => {
      return { focus: focus };
    });
    const classes = useStyles();

    return (
      <MuiButton
        ref={inputRef}
        disabled={disabled}
        variant={variant || "contained"}
        size={size || "medium"}
        color={color || "primary"}
        onClick={onClick}
        classes={{ root: classes.root, label: classes.label }}
        startIcon={startIcon}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: sacuvaj ? "75px" : "",
          }}
        >
          {!loading && text}
          {loading ? (
            <CircularProgress
              size="22px"
              color={loaderColor}
              sx={sx}
              thickness={4}
            />
          ) : null}
        </div>
      </MuiButton>
    );
  }
);

export default MyButton;
