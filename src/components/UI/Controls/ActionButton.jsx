import { Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

export default function ActionButton(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 0,
      margin: props.provjera ? 0 : 4,
    },
  });
  const { color, children, onClick } = props;
  const classes = useStyles();

  return (
    <Button
      className={`${classes.root} ${classes[color]}`}
      color="error"
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
//.contrastText
//
