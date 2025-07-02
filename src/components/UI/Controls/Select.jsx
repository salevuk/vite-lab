import React, { useImperativeHandle, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const Select = React.forwardRef(
  (
    { name, label, value, error = null, onChange, options, disabled, ...other },
    ref
  ) => {
    const inputRef = useRef();
    const focus = () => {
      inputRef.current["focus"]();
    };

    useImperativeHandle(ref, () => {
      return { focus: focus };
    });

    return (
      <FormControl
        variant="outlined"
        disabled={disabled}
        size="small"
        {...other}
        {...(error && { error: true })}
      >
        <InputLabel>{label}</InputLabel>
        <MuiSelect
          inputRef={inputRef}
          autoWidth={false}
          label={label}
          name={name}
          value={value}
          onChange={onChange}
          sx={
            name === "pol"
              ? { background: "#e0f0fe!important" }
              : name === "vid_osiguranja" || name === "tip_usluge"
              ? { background: "#edecff !important" }
              : {}
          }
        >
          {options.map((item) => {
            let naziv = "";
            if (name === "skladiste" || name === "skladiste_grupa")
              naziv = `${item.id} - ${item.naziv}`;
            if (name === "uputio") {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.ime}
                </MenuItem>
              );
            }
            if (name === "osnov_oslobadjanja") {
              return (
                <MenuItem
                  key={item.osnov_id}
                  value={item.osnov_id}
                >{`${item.fond_sifra} - ${item.kategorija}`}</MenuItem>
              );
            }
            if (
              name === "pol" ||
              name === "vid_osiguranja" ||
              name === "fond" ||
              name === "tip_usluge"
            ) {
              return (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              );
            }
            if (name === "kategorija_osiguranja") {
              return (
                <MenuItem
                  key={item.kategorija}
                  value={item.kategorija}
                  naziv={item.naziv_osnove}
                >
                  {`${item.kategorija} - ${item.naziv_osnove}`}
                </MenuItem>
              );
            }
            return (
              <MenuItem key={item.id} value={item.id}>
                {naziv}
              </MenuItem>
            );
          })}
        </MuiSelect>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    );
  }
);

export default Select;
