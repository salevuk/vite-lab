import { useState, useEffect, useCallback, useRef } from "react";
import { useStore } from "../../store";
import { styled } from "@mui/material/styles";
import { IconButton, Tooltip, tooltipClasses } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Select from "react-select";
import dayjs from "dayjs";
import "dayjs/locale/sr";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import BrowserUpdatedTwoToneIcon from "@mui/icons-material/BrowserUpdatedTwoTone";
import PrintTwoToneIcon from "@mui/icons-material/PrintTwoTone";
import Menu from "../UI/Controls/Menu";

const IzborIzvjestaja = ({
  //title,
  dateRange,
  setDateRange,
  onHandlePrint,
}) => {
  const [opcijeDoktor, setOpcijeDoktor] = useState([]);
  const prikazi = useStore((store) => store.prikazi);
  const odabraniDoktor = useStore((store) => store.odabraniDoktor);

  const povuciDoktore = useCallback(async () => {
    const response = await fetch(`../rpc/laboratorija.cfc?method=doktori`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return await response.json();
  }, []);

  const datumOd = useRef();
  const datumDo = useRef();

  useEffect(() => {
    povuciDoktore().then((data) => {
      let opcije = data.lista.map((d) => {
        return {
          value: Number(d.value),
          label: (d.ime + " " + d.klinika).trim(),
          klinika: d.klinika,
        };
      });
      setOpcijeDoktor(opcije);
    }); // eslint-disable-next-line
  }, []);

  const selectStyle = {
    container: (baseStyles) => ({
      ...baseStyles,
      alignSelf: "center",
      marginTop: "0.25em",
      marginLeft: "0.5em",
      minWidth: "240px",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      /*       height: 32,
      minHeight: 32, */
      borderWidth: "1px",
      "&:hover": {
        borderColor: "#2684ff",
      },
      borderColor: state.isFocused ? "#004777" : "#84dcc6",
      borderRadius: "5px",
      fontSize: "0.95em",
    }),
    input: (styles) => ({ ...styles, padding: "4px 8px" }),
    dropdownIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
    clearIndicator: (styles) => ({
      ...styles,
      paddingTop: 6,
      paddingBottom: 6,
    }),
  };

  const naIzborDateRange = (odDate, doDate, id_doktora) => {
    setDateRange({
      datumOd: odDate,
      datumDo: doDate,
      doktor: id_doktora,
    });
  };

  const handleChange = (odabraniDoctor, { action }) => {
    //console.log("odabrani doctor", odabraniDoctor, odabraniDoctor === null);
    if (action === "select-option") {
      useStore.setState({ odabraniDoktor: odabraniDoctor });
    }
    if (action === "clear") {
      useStore.setState({
        odabraniDoktor: { value: "", label: "", klinika: "" },
      });
    }
  };

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "1em",
    },
  });

  return (
    <div className="izbor_sifrarnika">
      <Menu title={"Izvještaji"} />
      <div
        style={{
          display: "flex",
          gap: "0.25em",
          marginLeft: "0.5em",
          alignItems: "center",
          paddingTop: "0.15em",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="sr">
          <DateTimePicker
            label="Od datuma"
            format="DD.MM.YYYY"
            defaultValue={dayjs(dateRange.datumOd, "DD.MM.YYYY")}
            views={["year", "month", "day"]}
            sx={{ minWidth: "140px" }}
            size="medium"
            inputRef={datumOd}
          />
          <DateTimePicker
            label="Do datuma"
            format="DD.MM.YYYY"
            defaultValue={dayjs(dateRange.datumDo, "DD.MM.YYYY")}
            views={["year", "month", "day"]}
            sx={{ minWidth: "140px" }}
            size="medium"
            inputRef={datumDo}
          />
        </LocalizationProvider>
      </div>
      {prikazi.naziv === "usluge_doktori" && (
        <Select
          placeholder="Izbor doktora"
          options={opcijeDoktor}
          isSearchable
          isClearable
          //color="var(--color-labos-400)"
          onChange={handleChange}
          styles={selectStyle}
          //components={{ Control }}
          //isDisabled={}
        />
      )}
      <CustomTooltip arrow title={"POVUCI UPUTNICE ZA ODABRANI RASPON DATUMA"}>
        <IconButton
          onClick={() =>
            naIzborDateRange(
              datumOd.current.value,
              datumDo.current.value,
              odabraniDoktor.value
            )
          }
          sx={{ "&:hover": { backgroundColor: "#ffffff" } }}
        >
          <BrowserUpdatedTwoToneIcon
            fontSize={"large"}
            sx={{
              color: "#d8315b",
              cursor: "pointer",
              marginLeft: "0.25em",
              "&:hover": {
                color: "#ff5b75",
              },
            }}
          />
        </IconButton>
      </CustomTooltip>
      <CustomTooltip arrow title={"ŠTAMPAJ IZVJEŠTAJ"}>
        <IconButton
          onClick={() => onHandlePrint()}
          sx={{ "&:hover": { backgroundColor: "#ffffff" } }}
        >
          <PrintTwoToneIcon
            fontSize={"large"}
            sx={{
              color: "#004777",
              cursor: "pointer",
              marginLeft: "0.25em",
              "&:hover": {
                color: "#0077b6",
              },
            }}
          />
        </IconButton>
      </CustomTooltip>
    </div>
  );
};

export default IzborIzvjestaja;
