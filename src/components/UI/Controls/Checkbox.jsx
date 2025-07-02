import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox as MuiCheckbox,
} from "@mui/material";

export default function Checkbox(props) {
  const { name, label, value, onChange, disabled } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });

  return (
    <FormControl
      sx={{
        ...(name === "status_osiguranja" && {
          border: "1px solid #067bc2",
          borderRadius: "5px",
        }),
      }}
    >
      <FormControlLabel
        control={
          <MuiCheckbox
            name={name}
            color="primary"
            disabled={disabled}
            checked={value}
            onChange={(e) =>
              onChange(convertToDefEventPara(name, e.target.checked))
            }
            sx={{
              "& .MuiSvgIcon-root": { fontSize: 28 },
              marginLeft: "1em",
            }}
          />
        }
        label={label}
      />
    </FormControl>
  );
}
