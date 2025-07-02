import AntTable from "../../../komponente/UI/AntTable/AntTable.jsx";
import {
  izisSifarnikKolone,
  kisSifarnikKolone,
} from "../alati/koloneZaTabelu.jsx";
import {
  useIzisSifarnik,
  useKisSifarnik,
  usePovezaneSifre,
  usePoveziSifarnike,
} from "../hooks/usePoveziSifarnik.js";
import classes from "../stilovi/PoveziSifarnike.module.scss";
import { Button } from "antd";
import { useState } from "react";
import { convertToFormData } from "../alati/convertToFormData.js";

const PoveziSifarnike = ({ tabKey }) => {
  const { izisSifarnik, isLoading: isLoadingIzisSifarnik } = useIzisSifarnik({
    enabled: tabKey === "3",
  });
  const { kisSifarnik, isLoading: isLoadingKisSifarnik } = useKisSifarnik({
    enabled: tabKey === "3",
  });
  const { poveziSifarnike } = usePoveziSifarnike();
  const { povezaneSifre, isLoading: isLoadingPovezaneSifre } =
    usePovezaneSifre();
  const [selectedIzisId, setSelectedIzisId] = useState([]);
  const [selectedKisId, setSelectedKisId] = useState([]);

  const height = window.innerHeight - 130;

  const createRowHandlers = (
    type,
    rowKey,
    selectedRowKeys,
    setSelectedRowKeys
  ) => {
    const rowSelection = {
      type: type,
      selectedRowKeys: selectedRowKeys,
      columnWidth: type === "radio" ? 30 : 20,
      onChange: (keys) => {
        setSelectedRowKeys(keys);
      },
    };

    const handleRowSelection = (record) => {
      if (type === "radio") {
        setSelectedRowKeys([record[rowKey]]);
      } else {
        const currentSelected = [...selectedRowKeys];
        if (currentSelected.includes(record[rowKey])) {
          setSelectedRowKeys(
            currentSelected.filter((key) => key !== record[rowKey])
          );
        } else {
          setSelectedRowKeys([...currentSelected, record[rowKey]]);
        }
      }
    };

    return { rowSelection, handleRowSelection };
  };

  const izisHandlers = createRowHandlers(
    "select",
    "lab_tests_results_id",
    selectedIzisId,
    setSelectedIzisId
  );
  const kisHandlers = createRowHandlers(
    "radio",
    "pretraga_sif",
    selectedKisId,
    setSelectedKisId
  );

  const poveziSifarnikeHandler = () => {
    selectedIzisId.forEach((izisId) => {
      const formData = convertToFormData({
        izis_id: izisId,
        kis_id: selectedKisId[0],
      });
      poveziSifarnike(formData);
    });
    ponistiSelekcijuHandler();
  };

  const ponistiSelekcijuHandler = () => {
    setSelectedKisId([]);
    setSelectedIzisId([]);
  };

  return (
    <div className={classes.povezivanje_sifarnika}>
      <div className={classes.izis}>
        <div className={classes.izis_sifarnik}>
          <AntTable
            columns={izisSifarnikKolone}
            dataSource={izisSifarnik}
            size={"small"}
            bordered={true}
            loading={isLoadingIzisSifarnik || isLoadingPovezaneSifre}
            virtual={true}
            rowKey={"lab_tests_results_id"}
            scroll={{ y: height }}
            style={{ width: "100%" }}
            rowSelection={izisHandlers.rowSelection}
            onSelect={izisHandlers.handleRowSelection}
            onRow={(record) => ({
              onClick: () => izisHandlers.handleRowSelection(record),
            })}
            rowClassName={(record) => {
              let className = "custom_row";
              const povezano = povezaneSifre?.find(
                (item) => item.izis_id === record.lab_tests_results_id
              );
              if (povezano) {
                return className;
              }
            }}
          />
        </div>
      </div>
      <div className={classes.dugmad}>
        <Button
          type={"primary"}
          onClick={poveziSifarnikeHandler}
          disabled={selectedKisId.length === 0 || selectedIzisId.length === 0}
        >
          Poveži
        </Button>
        <Button
          type={"primary"}
          ghost={true}
          danger={true}
          onClick={ponistiSelekcijuHandler}
          disabled={selectedKisId.length === 0 && selectedIzisId.length === 0}
        >
          Poništi
        </Button>
      </div>
      <div className={classes.kis}>
        <div className={classes.kis_sifarnik}>
          <AntTable
            columns={kisSifarnikKolone}
            dataSource={kisSifarnik}
            size={"small"}
            bordered={true}
            loading={isLoadingKisSifarnik || isLoadingPovezaneSifre}
            rowKey={"pretraga_sif"}
            virtual={true}
            scroll={{ y: height }}
            rowSelection={kisHandlers.rowSelection}
            onSelect={kisHandlers.handleRowSelection}
            onRow={(record) => ({
              onClick: () => {
                kisHandlers.handleRowSelection(record);
                console.log(record);
              },
            })}
            rowClassName={(record) => {
              let className = "custom_row";
              const povezano = povezaneSifre?.find(
                (item) => item.kis_id === parseInt(record.pretraga_sif)
              );
              if (povezano) {
                return className;
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PoveziSifarnike;
