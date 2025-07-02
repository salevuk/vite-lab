import React, { useImperativeHandle, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
//import TextField from "@mui/material/TextField";
import { DesktopDateTimePicker } from "@mui/x-date-pickers";
import "dayjs/locale/sr";

const DateTimePicker = React.forwardRef(
  (
    {
      name,
      label,
      value,
      views,
      onChange,
      //onKeyPress,
      error,
      readOnly,
      disabled,
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
        <DesktopDateTimePicker
          inputRef={inputRef}
          label={label}
          ampm={false}
          readOnly={readOnly}
          disabled={disabled}
          name={name}
          value={value}
          views={views}
          onChange={(date) => onChange(convertToDefEventPara(name, date))}
          slotProps={{
            textField: {
              error: Boolean(error),
              helperText: error,
              InputProps: {
                style:
                  name === "datum_uzorak"
                    ? { backgroundColor: "antiquewhite" }
                    : undefined, // Promijenite vrijednost prema potrebi
              },
            },
          }}
        />
      </LocalizationProvider>
    );
  }
);

export default DateTimePicker;
