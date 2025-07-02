import Menu from "../UI/Controls/Menu";

const IzborSifrarnika = ({ title }) => {
  return (
    <div className="izbor_sifrarnika">
      <Menu title={"Šifrarnici"} />
      <div className="title">
        <p>{title}</p>
      </div>
    </div>
  );
};

export default IzborSifrarnika;
