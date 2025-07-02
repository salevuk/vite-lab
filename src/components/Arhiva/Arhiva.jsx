import Menu from "../UI/Controls/Menu";
import Tabela from "../Sifrarnici/Tabela";
import { useStore } from "../../store";
import { useReactToPrint } from "react-to-print";
import "./Arhiva.css";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { styled } from "@mui/material/styles";
import { IconButton, Button, Tooltip, tooltipClasses } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/sr";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import BrowserUpdatedTwoToneIcon from "@mui/icons-material/BrowserUpdatedTwoTone";
import Controls from "../UI/Controls/Controls";
import ArhivaUputnica from "../Modals/Uputnica/ArhivaUputnica";

const Arhiva = ({ notifikacija }) => {
  const [arhivaRange, setArhivaRange] = useState({
    datumOd: dayjs(new Date()).format("DD.MM.YYYY"),
    datumDo: dayjs(new Date()).format("DD.MM.YYYY"),
    jmbg: "",
  });
  const [errorJmbg, setErrorJmbg] = useState(false);
  const [arhivisaneUputnice, setArhivisaneUputnice] = useState([]);
  const [izLoading, setIzLoading] = useState(false);
  const [disabled, setDisabled] = useState({ value: false, case: 0, text: "" });
  const otvoriArhivaUputnicu = useStore((store) => store.otvoriArhivaUputnicu);
  const options = useMemo(() => ({ dateStyle: "medium" }), []);
  const povuciArhivaPodatke = useCallback(async (jmbg, datumOd, datumDo) => {
    const response = await fetch(
      `../rpc/laboratorija.cfc?method=arhiva_uputnica&datumOd=${datumOd}&datumDo=${datumDo}&jmbg=${jmbg}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return await response.json();
  }, []);
  const componentRef = useRef(null);
  const datumOd = useRef();
  const datumDo = useRef();
  const jmbgR = useRef();

  /* useEffect(() => {
    setIzLoading(true);
    povuciArhivaPodatke(
      arhivaRange.jmbg,
      arhivaRange.datumOd,
      arhivaRange.datumDo
    ).then((r) => {
      setArhivisaneUputnice(r["lista"]);
      setIzLoading(false);
    });
  }, [povuciArhivaPodatke, arhivaRange]); */

  useEffect(() => {
    if (
      dayjs(arhivaRange.datumDo, "DD.MM.YYYY").diff(
        dayjs(arhivaRange.datumOd, "DD.MM.YYYY"),
        "day"
      ) > 3
    ) {
      setDisabled({ value: true, case: 0, text: "Raspon je veći od 3 dana." });
    } else if (
      dayjs(arhivaRange.datumDo, "DD.MM.YYYY").diff(
        dayjs(arhivaRange.datumOd, "DD.MM.YYYY"),
        "day"
      ) < 0
    ) {
      setDisabled({
        value: true,
        case: 1,
        text: "Datum od ne može biti veći od datuma do.",
      });
    } else {
      if (disabled.value === true)
        setDisabled({ value: false, case: 0, text: "" });
    } // eslint-disable-next-line
  }, [arhivaRange]);

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      fontSize: "1em",
    },
  });

  /* const CustomActionBar = (props) => {
    return (
      <div className={`${props.className} calendar_action`}>
        <Button onClick={props.onSetToday}>
          {dayjs(new Date()).format("DD.MM.YYYY")}
        </Button>
        <Button onClick={props.onAccept}>OK.</Button>
      </div>
    );
  }; */

  const columns = useMemo(
    () => [
      {
        accessorKey: "jmbg",
        header: "JMBG",
        size: 70,
      },
      {
        accessorKey: "pacijent",
        header: "PACIJENT",
        size: 100,
      },
      {
        accessorKey: "datum",
        header: "DATUM",
        Cell: ({ cell }) => cell.getValue().toLocaleDateString("sr", options),
        accessorFn: (row) => new Date(row["datum"]),
        size: 60,
      },
      {
        accessorKey: "vrsta_naziv",
        header: "VRSTA",
        size: 60,
      },
      {
        accessorKey: "brojlab",
        header: "LAB broj",
        size: 60,
      },
      /* {
        accessorKey: "protokol",
        header: "Protokol br.",
        size: 70,
      }, */
      {
        accessorKey: "lis_broj",
        header: "LIS br.",
        size: 60,
      },
      /* {
        accessorKey: "kiss_broj_protokola",
        header: "KIS br.",
        size: 60,
      }, */
      {
        accessorKey: "naziv_odjela",
        header: "ODJEL",
        size: 120,
      },
      {
        accessorKey: "naziv_klinike",
        header: "KLINIKA",
        size: 120,
      },
      {
        accessorKey: "napomena",
        header: "NAPOMENA",
        size: 80,
      },
    ],
    [options]
  );

  /*   const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArhivaRange({
      ...arhivaRange,
      [name]: value,
    });
  }; */
  // za verziju react to print >  3.00.0 ide useReactToPrint ovako
  const handlePrint = useReactToPrint({
    contentRef: () => componentRef,
  });

  const isJmbgValid = (value) => {
    let jmbg = value.split("");
    if (jmbg.length === 13) {
      let kon = Number(jmbg[12]);
      let izrKon =
        11 -
        ((7 * (Number(jmbg[0]) + Number(jmbg[6])) +
          6 * (Number(jmbg[1]) + Number(jmbg[7])) +
          5 * (Number(jmbg[2]) + Number(jmbg[8])) +
          4 * (Number(jmbg[3]) + Number(jmbg[9])) +
          3 * (Number(jmbg[4]) + Number(jmbg[10])) +
          2 * (Number(jmbg[5]) + Number(jmbg[11]))) %
          11);
      if (izrKon > 9) {
        izrKon = 0;
      }
      if (izrKon === 0 && kon === 0) {
        if (errorJmbg === true) setErrorJmbg(false);
        return true;
      } else if (izrKon >= 1 && izrKon <= 9 && izrKon === kon) {
        if (errorJmbg === true) setErrorJmbg(false);
        return true;
      } else {
        setErrorJmbg(true);
        return false;
      }
    } else {
      setErrorJmbg(true);
      return false;
    }
  };

  const naIzbor = (odDate, doDate, jmbg) => {
    if (jmbgR.current.value !== "") {
      if (isJmbgValid(jmbg)) {
        setArhivaRange({
          datumOd: odDate,
          datumDo: doDate,
          jmbg: jmbg,
        });
        setIzLoading(true);
        povuciArhivaPodatke(
          arhivaRange.jmbg,
          arhivaRange.datumOd,
          arhivaRange.datumDo
        ).then((r) => {
          setArhivisaneUputnice(r["lista"]);
          setIzLoading(false);
        });
      } else {
        notifikacija(true, "Unesite ispravan JMBG!", "error", 3000);
      }
    } else {
      if (errorJmbg === true) setErrorJmbg(false);
      setArhivaRange({
        datumOd: odDate,
        datumDo: doDate,
        jmbg: jmbg,
      });
      setIzLoading(true);
      povuciArhivaPodatke(
        arhivaRange.jmbg,
        arhivaRange.datumOd,
        arhivaRange.datumDo
      ).then((r) => {
        setArhivisaneUputnice(r["lista"]);
        setIzLoading(false);
      });
    }
  };

  //const maxdodate = dayjs(arhivaRange.datumOd, "DD.MM.YYYY").add(3, "day");
  //const mindodate = dayjs(arhivaRange.datumDo, "DD.MM.YYYY");
  //console.log("arhivisaneUputnice", arhivisaneUputnice);
  //console.log("disabled", disabled);
  //console.log("arhivaRange",arhivaRange);
  return (
    <>
      {otvoriArhivaUputnicu.open && (
        <ArhivaUputnica
          data={otvoriArhivaUputnicu.uputnica}
          onHandlePrint={handlePrint}
          ref={componentRef}
        />
      )}
      <div className="izbor_sifrarnika">
        <Menu title={"Arhiva"} />
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
              label={
                disabled.value && disabled.case === 1
                  ? disabled.text
                  : "Od datuma"
              }
              format="DD.MM.YYYY"
              defaultValue={dayjs(arhivaRange.datumOd, "DD.MM.YYYY")}
              views={["year", "month", "day"]}
              sx={(theme) => ({
                minWidth: "140px",
                "& .MuiInputLabel-root":
                  disabled.value && disabled.case === 1
                    ? { color: theme.palette.error.main }
                    : {},
                "& .MuiOutlinedInput-notchedOutline":
                  disabled.value && disabled.case === 1
                    ? { borderColor: theme.palette.error.main }
                    : {},
              })}
              size="medium"
              inputRef={datumOd}
              //maxDate={maxdodate} koristiti kad bude arhiva
              //minDate={mindodate} koristiti kad bude arhiva
              onChange={(date) =>
                setArhivaRange({
                  ...arhivaRange,
                  datumOd: dayjs(date).format("DD.MM.YYYY"),
                  datumDo: dayjs(date).format("DD.MM.YYYY"),
                })
              }
              /*  slots={{
                actionBar: CustomActionBar,
              }} */
            />
            <DateTimePicker
              label={
                disabled.value && disabled.case === 0
                  ? disabled.text
                  : "Do datuma"
              }
              format="DD.MM.YYYY"
              //defaultValue={dayjs(arhivaRange.datumDo, "DD.MM.YYYY")}
              value={dayjs(arhivaRange.datumDo, "DD.MM.YYYY")}
              views={["year", "month", "day"]}
              sx={(theme) => ({
                minWidth: "140px",
                "& .MuiInputLabel-root":
                  disabled.value && disabled.case === 0
                    ? { color: theme.palette.error.main }
                    : {},
                "& .MuiOutlinedInput-notchedOutline":
                  disabled.value && disabled.case === 0
                    ? { borderColor: theme.palette.error.main }
                    : {},
              })}
              size="medium"
              inputRef={datumDo}
              //maxDate={maxdodate} koristiti kad bude arhiva
              //minDate={mindodate} koristiti kad bude arhiva
              onChange={(date) =>
                setArhivaRange({
                  ...arhivaRange,
                  datumDo: dayjs(date).format("DD.MM.YYYY"),
                })
              }
              /* slots={{
                actionBar: CustomActionBar,
              }} */
            />
          </LocalizationProvider>
        </div>
        <Controls.Input
          name="jmbg"
          //label="Unesi JMBG"
          label={errorJmbg ? "JMBG nije ispravan!" : "Unesi JMBG"}
          //value={arhivaRange.jmbg}
          //onChange={handleInputChange}
          //onFocus={() => validate({ jmbg: values.jmbg })}
          error={errorJmbg}
          size="small"
          sx={{
            width: "20em",
            marginBlock: "auto",
            marginLeft: "0.5em",
          }}
          inputRef={jmbgR}
        />
        <CustomTooltip arrow title={"POVUCI REZULTATE IZ ARHIVE"}>
          <IconButton
            onClick={() =>
              naIzbor(
                datumOd.current.value,
                datumDo.current.value,
                jmbgR.current.value
              )
            }
            sx={{ "&:hover": { backgroundColor: "#ffffff" } }}
            disabled={disabled.value}
          >
            <BrowserUpdatedTwoToneIcon
              fontSize={"large"}
              sx={{
                color: disabled.value ? "#737373" : "#d8315b",
                cursor: disabled.value ? "not-allowed" : "pointer",
                marginLeft: "0.25em",
                "&:hover": {
                  color: disabled.value ? "#737373" : "#ff5b75",
                },
              }}
            />
          </IconButton>
        </CustomTooltip>
      </div>
      <Tabela
        columns={columns}
        data={arhivisaneUputnice}
        loading={izLoading}
        sorting={[{ id: "jmbg", desc: false }]}
        arhiva={true}
      />
    </>
  );
};

export default Arhiva;
