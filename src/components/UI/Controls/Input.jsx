import React, { useImperativeHandle, useRef } from "react";
import { TextField } from "@mui/material";

const Input = React.forwardRef((props, ref) => {
  const inputRef = useRef();

  const focus = () => {
    inputRef.current["focus"]();
  };

  useImperativeHandle(ref, () => {
    return { focus: focus };
  });

  const {
    name,
    label,
    value,
    error = null,
    onChange,
    onKeyPress,
    size,
    ...other
  } = props;

  return (
    <TextField
      inputProps={{ onKeyUp: onKeyPress }}
      inputRef={inputRef}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      size={size}
      InputProps={
        name === "broj"
          ? {
              sx: {
                background: "#d2f5ea !important",
              },
            }
          : name === "osiguranje_status"
          ? {
              sx: {
                "& .Mui-disabled": {
                  WebkitTextFillColor: "#011532 !important",
                },
              },
            }
          : name === "prezime" ||
            name === "ime" ||
            name === "ime_roditelja" ||
            name === "jmbg"
          ? {
              sx: {
                background: "#e0f0fe !important",
              },
            }
          : name === "napomena"
          ? { sx: { background: "#E8DDB5 !important" } }
          : name === "diureza" ||
            name === "tezina_pacijenta" ||
            name === "visina_pacijenta"
          ? { sx: { background: "#FFFAE3 !important" } }
          : name === "adresa_pacijenta" ||
            name === "telefon" ||
            name === "email"
          ? { sx: { background: "#ecead5 !important" } }
          : {}
      }
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  );
});

export default Input;
