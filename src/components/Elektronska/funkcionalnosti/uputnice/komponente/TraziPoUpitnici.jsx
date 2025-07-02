import classes from "../stilovi/TraziPoUputnici.module.scss";
import AntForm from "../../../komponente/UI/AntForm/AntForm.jsx";
import { pretragaPoUputniciFormPolja } from "../alati/poljaZaFormu.jsx";
import { Form } from "antd";
import AntTable from "../../../komponente/UI/AntTable/AntTable.jsx";
import { rezultatKolone } from "../alati/koloneZaTabelu.jsx";
import {
  EVIDENTIRANE_UPUTNICE,
  useEvidentirajUputnicu,
  useEvidentiraneUputnice,
  useKreirajDokument,
  useUputnica,
  useVratiKisSifre,
} from "../hooks/useUputnica.js";
import { /* useEffect, */ useState } from "react";
import { getCustomButtons } from "../alati/customButtons.jsx";
import AntCard from "../../../komponente/UI/AntCard/AntCard.jsx";
import { uputnicaPoljaLista } from "../alati/poljaZaListu.js";
import { konvertujOdgovorSaServera } from "../alati/konvertujOdgovorSaServera.js";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { queryClient } from "../../../podesavanja/queryClient.js";
import { useAzurirajStatus } from "../hooks/useAzurirajStatus.js";
import { usePosaljiRezultate } from "../hooks/usePosaljiRezultate.js";
//import {posaljiRezultate} from "../../../lib/api.js";

const TraziPoUpitnici = () => {
  const [id, setId] = useState(null);
  const [selektovanaUputnicaId, setSelektovanaUputnicaId] = useState(null);
  const { vratiKisSifre } = useVratiKisSifre();
  const { napraviNoviDokument } = useKreirajDokument(); //eslint-disable-next-line
  const [loadingPreuzmiKisSifre, setLoadingPreuzmiKisSifre] = useState(null); // Track loading for "Preuzmi KIS šifre"
  //eslint-disable-next-line
  const [kisModuli, setKisModuli] = useState([]);
  const { uputnica, isLoading } = useUputnica(id, { enabled: !!id });
  const { evidentirane_uputnice } = useEvidentiraneUputnice(id, {
    enabled: !!id,
  });
  const { evidentirajUputnicu } = useEvidentirajUputnicu();
  const [form] = Form.useForm();
  const { openNotification } = useNotification();
  const [loadingButtons, setLoadingButtons] = useState({});
  const { azurirajStatus } = useAzurirajStatus();
  const { posaljiRezultate, isPending: isPendingSlanjeRezultata } =
    usePosaljiRezultate();

  const handleFormSubmit = (values) => {
    const { p_order_id } = values;
    setSelektovanaUputnicaId(p_order_id);
    setId(p_order_id);
    const orderId = p_order_id; // This might need to be adjusted based on your logic
    const selectedOrder = uputnica?.orders?.find(
      (order) => order.order_id === orderId
    );

    if (selectedOrder) {
      vratiKisSifreHandler(selectedOrder.analysis, orderId);
    }
  };

  const customButtons = getCustomButtons({
    selektovanaUputnicaId,
    isLoading,
    form,
    handleFormSubmit,
    setSelektovanaUputnicaId,
    id,
    setId,
    setKisModuli,
  });

  // Flatten the analysis data from all orders
  // const analysisData = uputnica?.orders?.flatMap(order =>
  //     order?.analysis?.map(analysisItem => ({
  //         ...analysisItem,
  //         order_id: order.order_id,
  //         patient_id: order.patient_id
  //     }))
  // ) || [];
  const analysisData =
    (uputnica?.parsirani_podaci?.orders || []).flatMap((order) =>
      (order?.analysis || []).map((analysisItem) => ({
        ...analysisItem,
        order_id: order.order_id,
        patient_id: order.patient_id,
      }))
    ) || [];

  const vratiKisSifreHandler = (values, orderId) => {
    setLoadingPreuzmiKisSifre(orderId);
    const izis_ids = values.map((item) => item.lab_tests_results_id).join(",");
    vratiKisSifre(
      { izis_ids },
      {
        onSuccess: (data) => {
          const formattedData = data?.kis_details.map((kis_detail) =>
            konvertujOdgovorSaServera(kis_detail)
          );
          setKisModuli(formattedData);
          setLoadingPreuzmiKisSifre(null);
        },
        onError: () => {
          setLoadingPreuzmiKisSifre(null);
        },
      }
    );
  };

  // const kreirajNoviDokumentHandler = async (orderId) => {
  //     setLoadingPosaljiRezultate(orderId);
  //     const formattedModuli = kisModuli.map(item => {
  //         const module = item[0];
  //         return {
  //             id: module.id_modula,
  //             vrijednost: 1
  //         };
  //     });
  //
  //     const ljekarModule = {
  //         id: 6707,
  //         vrijednost: 1
  //     };
  //
  //     const prioritetModule = {
  //         id: 2904,
  //         vrijednost: 3
  //     };
  //
  //     const vrstaPacijentaModule = {
  //         id: 2905,
  //         vrijednost: 'O'
  //     };
  //
  //     // Merge all modules
  //     const allModuli = [
  //         ...formattedModuli,
  //         ljekarModule,
  //         prioritetModule,
  //         vrstaPacijentaModule
  //     ];
  //
  //     // Prepare moduli in JSON format
  //     const moduliJson = JSON.stringify({
  //         modul: allModuli
  //     });
  //
  //     // Prepare the request data for creating the new document
  //     const requestData = {
  //         id_dokumenta: 'NEW',
  //         id_forme: 197,
  //         id_pacijenta: 465820,
  //         id_epizode: '',
  //         broj_protokola: 123123,
  //         moduli: moduliJson
  //     };
  //
  //     const newData = new URLSearchParams();
  //
  //     newData.append("id_dokumenta", requestData.id_dokumenta);
  //     newData.append("id_forme", requestData.id_forme);
  //     newData.append("id_pacijenta", requestData.id_pacijenta);
  //     newData.append("id_epizode", requestData.id_epizode);
  //     newData.append("broj_protokola", requestData.broj_protokola);
  //     newData.append("moduli", requestData.moduli);
  //
  //     napraviNoviDokument(newData, {
  //         onSuccess: ()=>{
  //             setLoadingPosaljiRezultate(null);
  //             evidentirajUputnicu({
  //                 broj_uputnice: orderId,
  //                 korisnik_id: 4855
  //             });
  //         },
  //         onError: () => {
  //             setLoadingPosaljiRezultate(null);
  //         }
  //     },{
  //         onSuccess: () => {
  //             openNotification('success', 'Obavještenje', 'KIS dokument kreiran');
  //         }
  //     });
  // };

  const setLoadingButton = (orderId, isLoading) => {
    setLoadingButtons((prevState) => ({ ...prevState, [orderId]: isLoading }));
  };

  // promjeni status uputnice
  const promjeniStatusUputniceHandler = async (orderId) => {
    const data = {
      orderId: orderId,
      status: "M",
      userId: 612,
      remark: "",
    };
    azurirajStatus(new URLSearchParams(data));
  };

  // posalji rezultate uputnice
  const posaljiRezultateUputniceHandler = async (orderId) => {
    const requestBody = {
      remark: "",
      finish: "Y",
      validatedBy: "mr Biohemije",
      orderId: orderId, // Using the passed orderId
      userId: 612,
      results: [
        {
          lab_tests_results_id: "649",
          laboratory_tests_code: "FER",
          laboratory_tests_name: "Feritin",
          value: "3",
          format: "%.1F",
          unit_of_measurement: "ng/mL",
          critical_value: "N",
          time_completed: "19.02.2025 13:06:44",
          reference: "4",
        },
      ],
    };
    posaljiRezultate(requestBody);
  };

  const kreirajNoviDokumentHandler = async (values, orderId) => {
    // setLoadingPosaljiRezultate(orderId);
    setLoadingButton(orderId, true);
    const izis_ids = values.map((item) => item.lab_tests_results_id).join(",");
    console.log("values, orderId", values, orderId, "izis_ids", izis_ids);
    /* vratiKisSifre(
      { izis_ids },
      {
        onSuccess: (data) => {
          const formattedData = data?.kis_details.map((kis_detail) =>
            konvertujOdgovorSaServera(kis_detail)
          );
          setKisModuli(formattedData);
          // setLoadingPreuzmiKisSifre(null);
          const formattedModuli = formattedData.map((item) => {
            const module = item[0];
            return {
              id: module.id_modula,
              vrijednost: 1,
            };
          });

          const ljekarModule = { id: 6707, vrijednost: 1 };

          const prioritetModule = { id: 2904, vrijednost: 3 };

          const vrstaPacijentaModule = { id: 2905, vrijednost: "O" };

          // Merge all modules
          const allModuli = [
            ...formattedModuli,
            ljekarModule,
            prioritetModule,
            vrstaPacijentaModule,
          ];

          // Prepare moduli in JSON format
          const moduliJson = JSON.stringify({
            modul: allModuli,
          });

          // Prepare the request data for creating the new document
          const requestData = {
            id_dokumenta: "NEW",
            id_forme: 197,
            id_pacijenta: 465820, // TODO: Zamjeniti sa id_pacijenta iz sesije
            id_epizode: "",
            broj_protokola: 123123,
            moduli: moduliJson,
          };

          const newData = new URLSearchParams();

          newData.append("id_dokumenta", requestData.id_dokumenta);
          newData.append("id_forme", requestData.id_forme);
          newData.append("id_pacijenta", requestData.id_pacijenta);
          newData.append("id_epizode", requestData.id_epizode);
          newData.append("broj_protokola", requestData.broj_protokola);
          newData.append("moduli", requestData.moduli);

          evidentirajUputnicu(
            {
              broj_uputnice: orderId,
              korisnik_id: 4855, // TODO: Zamjeniti sa korisnik_id iz sesije
            },
            {
              onSuccess: () => {
                napraviNoviDokument(newData, {
                  onSuccess: async () => {
                    // setLoadingPosaljiRezultate(null);
                    // setLoadingPreuzmiKisSifre(null);
                    setLoadingButton(orderId, false);
                    openNotification(
                      "success",
                      "Obavještenje",
                      "KIS dokument kreiran"
                    );
                    await queryClient.invalidateQueries([
                      EVIDENTIRANE_UPUTNICE,
                    ]);
                  },
                  onError: (error) => {
                    // setLoadingPosaljiRezultate(null);
                    setLoadingButton(orderId, false);
                    openNotification(
                      "error",
                      `Obavještenje`,
                      error.response.data.poruka ||
                        "Greška pri kreiranju KIS dokumenta"
                    );
                  },
                });
              },
              onError: (error) => {
                // setLoadingPosaljiRezultate(null);
                setLoadingButton(orderId, false);
                openNotification(
                  "error",
                  `Obavještenje`,
                  error.response.data.poruka ||
                    "Greška pri evidentiranju uputnice"
                );
              },
            }
          );
          // setDisabledPosalji(prevState => ({ ...prevState, [orderId]: false }));
        },
        onError: (error) => {
          // setLoadingPreuzmiKisSifre(null);
          setLoadingButton(orderId, false);
          openNotification(
            "error",
            `Obavještenje`,
            error.response.data.poruka || "Greška pri preuzimanju KIS šifara"
          );
        },
      }
    ); */
  };

  return (
    <div className={classes.container}>
      <div className={classes.pretraga}>
        <AntForm
          form={form}
          fields={pretragaPoUputniciFormPolja}
          buttonHandler={handleFormSubmit}
          customButtons={customButtons}
          pozicijaDugmeta={"centar"}
        />
      </div>
      {id && !isLoading ? (
        <div className={classes.rezultat}>
          {uputnica?.parsirani_podaci?.orders?.map((item) => {
            const showIcon = evidentirane_uputnice?.some(
              (uputnica) => uputnica.broj_uputnice === item.order_id
            );
            return (
              <AntCard
                key={item.order_id}
                data={[item]}
                fields={uputnicaPoljaLista}
                titlePrefix="Broj uputnice:"
                titleField="order_id"
                //onDetaljiClick={() => onDetaljiClick(item)}
                loadingSlanje={isPendingSlanjeRezultata}
                onPreuzmiClick={() =>
                  promjeniStatusUputniceHandler(item.order_id)
                }
                onPosaljiRezultatClick={() =>
                  posaljiRezultateUputniceHandler(item.order_id)
                }
                onPosaljiClick={() =>
                  kreirajNoviDokumentHandler(item.analysis, item.order_id)
                }
                isPendingPosaljiRezultate={loadingButtons[item.order_id]}
                disabledPosalji={showIcon || analysisData.length === 0}
                prikaziDugmeDetalji={false}
                titleIcon={showIcon ? CheckCircleTwoTone : null}
              />
            );
          })}
          <div className={classes.tabela}>
            <AntTable
              columns={rezultatKolone}
              dataSource={analysisData}
              scroll={{ y: "calc(100dvh - 450px)" }}
              rowKey={"result_uid"}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TraziPoUpitnici;
