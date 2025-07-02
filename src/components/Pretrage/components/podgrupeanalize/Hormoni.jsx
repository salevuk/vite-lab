import { useStore } from "../../../../store";
import "./PodgrupeProfiliAutoimune.css";
import CheckBox from "../ui/CheckBox";

const Hormoni = () => {
  const pretrage = useStore((store) => store.pretrage);
  return (
    <div className="ia_hormoni">
      <div className="p_podgrupa imunoloske_pretrage">
        <div className="p_checkbox">
          <p className="r_podnaslov">Hormoni</p>
          <div className="r_podgrupa_checkbox imunoloske_checkbox">
            {pretrage
              .filter((u) => {
                return u.grupa_pretraga === "Hormoni";
              })
              .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
              .map((pretraga) => (
                <CheckBox pretraga={pretraga} />
              ))}
          </div>
        </div>
      </div>
      <div className="p_podgrupa imunoloske_pretrage">
        <div className="p_checkbox">
          <p className="r_podnaslov">Hormoni štitnjače</p>
          <div className="r_podgrupa_checkbox imunoloske_checkbox">
            {pretrage
              .filter((u) => {
                return u.grupa_pretraga === "Hormoni stitnjace";
              })
              .sort((a, b) => (a.redni_br > b.redni_br ? 1 : -1))
              .map((pretraga) => (
                <CheckBox pretraga={pretraga} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hormoni;
