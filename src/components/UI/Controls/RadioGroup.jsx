import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

export default function RadioGroup(props) {
  const { name, label, value, onChange, items, disabled } = props;
  //console.log(("items", items, "disabled", disabled));
  return (
    <FormControl>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <FormLabel>{label}</FormLabel>
        <MuiRadioGroup row name={name} value={value} onChange={onChange}>
          {items.map((item) => (
            <FormControlLabel
              key={item.id}
              value={item.id}
              disabled={disabled || item.disabled}
              sx={{
                marginRight: "0.5rem",
                color:
                  name === "prioritet"
                    ? "var(--color-primary-920)"
                    : name === "vrsta"
                    ? "var(--color-primary-600)"
                    : "inherit",
              }}
              control={
                <Radio
                  color={items.indexOf(item) === 0 ? "primary" : "secondary"}
                />
              }
              label={item.title}
            />
          ))}
        </MuiRadioGroup>
      </div>
    </FormControl>
  );
}
