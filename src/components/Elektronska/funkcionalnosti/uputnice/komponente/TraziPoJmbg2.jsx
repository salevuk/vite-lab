import classes from "../stilovi/TraziPoUputnici.module.scss";
import AntForm from "../../../komponente/UI/AntForm/AntForm.jsx";
import {pretragaPoJmbgFormPolja} from "../alati/poljaZaFormu.jsx";
import {Form} from "antd";
import {getCustomButtons} from "../alati/customButtons.jsx";
import {useState} from "react";
import {
    EVIDENTIRANE_UPUTNICE,
    useEvidentirajUputnicu, useEvidentiraneUputnice,
    useKreirajDokument,
    useUputnicaPoJmbg,
    useVratiKisSifre
} from "../hooks/useUputnica.js";
import {uputnicaPoljaLista} from "../alati/poljaZaListu.js";
import AntCard from "../../../komponente/UI/AntCard/AntCard.jsx";
import PregledajUputnicuModal from "./PregledajUputnicuModal.jsx";
import {konvertujOdgovorSaServera} from "../alati/konvertujOdgovorSaServera.js";
import {CheckCircleTwoTone} from "@ant-design/icons";
import {useNotification} from "../../../context/NotificationContext.jsx";
import {queryClient} from "../../../podesavanja/queryClient.js";

const TraziPoJmbg2 = () => {
    const [jmbg, setJmbg] = useState(null);
    const [pregledUputnicaModal, setPregledUputnicaModal] = useState(false);
    const [selektovanaUputnica, setSelektovanaUputnica] = useState([]);
    const [selektovanaUputnicaId, setSelektovanaUputnicaId] = useState(null);
    const [kisModuli, setKisModuli] = useState([]);
    const { uputnica, isLoading } = useUputnicaPoJmbg(jmbg, { enabled: !!jmbg });
    const {openNotification} = useNotification();
    const {vratiKisSifre} = useVratiKisSifre();
    const {napraviNoviDokument} = useKreirajDokument();
    const [form] = Form.useForm();
    const [loadingPreuzmiKisSifre, setLoadingPreuzmiKisSifre] = useState(null); // Track loading for "Preuzmi KIS šifre"
    const [loadingButtons, setLoadingButtons] = useState({});
    const {evidentirajUputnicu} = useEvidentirajUputnicu();
    // Extract order IDs (broj_uputnice) from the uputnica.orders array
    const orderIds = uputnica?.orders ? uputnica.orders.map(order => order.order_id) : [];

    // Fetch data for multiple uputnice using the orderIds
    const { evidentirane_uputnice } = useEvidentiraneUputnice(orderIds, { enabled: orderIds.length > 0 });

    // useEffect(() => {
    //     if (uputnica?.orders) {
    //         const initialDisabledState = uputnica.orders.reduce((acc, item) => {
    //             acc[item.order_id] = true;
    //             return acc;
    //         }, {});
    //     }
    // }, [uputnica]);

    const customButtons = getCustomButtons({
        selektovanaUputnicaId, isLoading, jmbg, form,
        handleFormSubmit: (values) => {
            const { p_patient_id } = values;
            setJmbg(p_patient_id);
        },
        setSelektovanaUputnica, setSelektovanaUputnicaId, setJmbg, setPregledUputnicaModal, setKisModuli
    });

    const prikaziDetaljeUputniceHandler = (uputnica) => {
        setSelektovanaUputnica(uputnica);
        setPregledUputnicaModal(true);
    }

    const vratiKisSifreHandler = (values, orderId) => {
        setLoadingPreuzmiKisSifre(orderId);
        const izis_ids = values.map(item => item.lab_tests_results_id).join(',');
        vratiKisSifre({ izis_ids }, {
            onSuccess: (data) => {
                const formattedData = data?.kis_details.map(kis_detail => konvertujOdgovorSaServera(kis_detail));
                setKisModuli(formattedData);
                setLoadingPreuzmiKisSifre(null);
            },
            onError: ()=>{
                setLoadingPreuzmiKisSifre(null);
            }
        });
    }

    const setLoadingButton = (orderId, isLoading) => {
        setLoadingButtons(prevState => ({ ...prevState, [orderId]: isLoading }));
    };

    const kreirajNoviDokumentHandler = async (values, orderId) => {
        // setLoadingPosaljiRezultate(orderId);
        setLoadingButton(orderId, true);
        const izis_ids = values.map(item => item.lab_tests_results_id).join(',');
        vratiKisSifre({ izis_ids }, {
            onSuccess: (data) => {
                const formattedData = data?.kis_details.map(kis_detail => konvertujOdgovorSaServera(kis_detail));
                setKisModuli(formattedData);
                // setLoadingPreuzmiKisSifre(null);
                const formattedModuli = formattedData.map(item => {
                    const module = item[0];
                    return {
                        id: module.id_modula,
                        vrijednost: 1
                    };
                });

                const ljekarModule = { id: 6707, vrijednost: 1 };

                const prioritetModule = { id: 2904, vrijednost: 3 };

                const vrstaPacijentaModule = { id: 2905, vrijednost: 'O' };

                // Merge all modules
                const allModuli = [
                    ...formattedModuli,
                    ljekarModule,
                    prioritetModule,
                    vrstaPacijentaModule
                ];

                // Prepare moduli in JSON format
                const moduliJson = JSON.stringify({
                    modul: allModuli
                });

                // Prepare the request data for creating the new document
                const requestData = {
                    id_dokumenta: 'NEW',
                    id_forme: 197,
                    id_pacijenta: 465820,
                    id_epizode: '',
                    broj_protokola: 123123,
                    moduli: moduliJson
                };

                const newData = new URLSearchParams();

                newData.append("id_dokumenta", requestData.id_dokumenta);
                newData.append("id_forme", requestData.id_forme);
                newData.append("id_pacijenta", requestData.id_pacijenta);
                newData.append("id_epizode", requestData.id_epizode);
                newData.append("broj_protokola", requestData.broj_protokola);
                newData.append("moduli", requestData.moduli);

                evidentirajUputnicu({
                    broj_uputnice: orderId,
                    korisnik_id: 4855
                }, {
                    onSuccess: ()=>{
                        napraviNoviDokument(newData, {
                            onSuccess: async ()=>{
                                // setLoadingPosaljiRezultate(null);
                                // setLoadingPreuzmiKisSifre(null);
                                setLoadingButton(orderId, false);
                                openNotification('success', 'Obavještenje', 'KIS dokument kreiran');
                                await queryClient.invalidateQueries([EVIDENTIRANE_UPUTNICE]);
                            },
                            onError: (error) => {
                                // setLoadingPosaljiRezultate(null);
                                setLoadingButton(orderId, false);
                                openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri kreiranju KIS dokumenta');
                            }
                        });
                    },
                    onError: (error)=> {
                        // setLoadingPosaljiRezultate(null);
                        setLoadingButton(orderId, false);
                        openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri evidentiranju uputnice');
                    }
                });
                // setDisabledPosalji(prevState => ({ ...prevState, [orderId]: false }));
            },
            onError: (error)=>{
                // setLoadingPreuzmiKisSifre(null);
                setLoadingButton(orderId, false);
                openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri preuzimanju KIS šifara');
            }
        });
    };

    return (
        <div className={classes.container}>
            {pregledUputnicaModal ? <PregledajUputnicuModal openModal={pregledUputnicaModal}
                                                            pacijent={uputnica?.orders[0]?.patient_name}
                                                            detaljiUputnice={selektovanaUputnica?.analysis}
                                                            selektovanaUputnicaId={selektovanaUputnicaId}
                                                            closeModal={()=> setPregledUputnicaModal(false)}/> : null}
            <div className={classes.pretraga}>
                <AntForm form={form} fields={pretragaPoJmbgFormPolja}
                         customButtons={customButtons} pozicijaDugmeta={'centar'}
                />
            </div>
            <div className={classes.rezultat}>
                {uputnica?.orders?.map((item) => {
                    if (item.analysis) {
                        const showIcon = evidentirane_uputnice?.some(uputnica => uputnica.broj_uputnice === item.order_id);
                        // const isDisabled = evidentirane_uputnice?.some(uputnica => uputnica.broj_uputnice === item.order_id);
                        return (
                            <AntCard
                                fields={uputnicaPoljaLista}
                                isPendingPosaljiRezultate={loadingButtons[item.order_id]}
                                // isPendingPreuzmiKisSifre={loadingPreuzmiKisSifre === item.order_id}
                                onPreuzmiKisSifre={()=>vratiKisSifreHandler(item.analysis, item.order_id)}
                                onPosaljiClick={()=>kreirajNoviDokumentHandler(item.analysis, item.order_id)}
                                onDetaljiClick={()=>prikaziDetaljeUputniceHandler(item)}
                                disabledPosalji={showIcon}
                                data={[item]}
                                titlePrefix="Broj uputnice:"
                                titleField="order_id"
                                key={item.order_id}
                                titleIcon={showIcon ? CheckCircleTwoTone : null}
                            />
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    );
};

export default TraziPoJmbg2;