import * as React from "react";
//import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { useImperativeHandle, useRef } from "react";
import "dayjs/locale/sr";

const DatePicker = React.forwardRef(
  (
    {
      name,
      label,
      value,
      views,
      error,
      onChange,
      //onKeyPress,
      disabled,
      readOnly,
    },
    ref
  ) => {
    const inputRef = useRef();

    const focus = () => {
      inputRef.current["focus"]();
      inputRef.current["select"]();
    };

    useImperativeHandle(ref, () => {
      return { focus: focus };
    });

    const convertToDefEventPara = (name, value) => ({
      target: {
        name,
        value,
      },
    });

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
        <DesktopDatePicker
          inputRef={inputRef}
          inputFormat="DD.MM.YYYY"
          label={label}
          name={name}
          readOnly={readOnly}
          disabled={disabled}
          value={value}
          views={views}
          onChange={(date) => onChange(convertToDefEventPara(name, date))}
          slotProps={{
            textField: {
              error: Boolean(error),
              helperText: error,
              size: "small",
              InputLabelProps: {
                style: { top: "0" },
              },
              sx:
                name === "rok_osiguranja"
                  ? {
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#067bc2 !important",
                        },
                        "&:hover fieldset": {
                          borderColor: "#067bc2 !important",
                        },
                        "&.Mui-focused": {
                          borderColor: "#067bc2 !important",
                        },
                      },
                    }
                  : undefined,
              InputProps: {
                sx: {
                  backgroundColor:
                    name === "datum_uputnice"
                      ? "antiquewhite !important"
                      : name === "datum_rodjenja"
                      ? "#e0f0fe !important"
                      : name === "rok_osiguranja"
                      ? "#edecff !important"
                      : undefined,
                  "&.Mui-disabled": {
                    backgroundColor:
                      name === "datum_uputnice"
                        ? "antiquewhite !important"
                        : name === "datum_rodjenja"
                        ? "#e0f0fe !important"
                        : name === "rok_osiguranja"
                        ? "#edecff !important"
                        : "rgba(0, 0, 0, 0.12) !important", // Default disabled color
                  },
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    );
  }
);

export default DatePicker;
