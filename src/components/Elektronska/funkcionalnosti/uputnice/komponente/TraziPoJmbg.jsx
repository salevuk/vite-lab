import {useEffect, useState} from "react";
import {useUputnicaPoJmbg, useVratiKisSifre} from "../hooks/useUputnica.js";
import {Form} from "antd";
import classes from "../stilovi/TraziPoUputnici.module.scss";
import AntForm from "../../../komponente/UI/AntForm/AntForm.jsx";
import {pretragaPoJmbgFormPolja} from "../alati/poljaZaFormu.jsx";
import AntResult from "../../../komponente/UI/AntResult/AntResult.jsx";
import PregledajUputniceModal from "./PregledajUputniceModal.jsx";
import {rezultatKolone} from "../alati/koloneZaTabelu.jsx";
import AntTable from "../../../komponente/UI/AntTable/AntTable.jsx";
import AntList from "../../../komponente/UI/AntList/AntList.jsx";
import {uputnicaPoljaLista} from "../alati/poljaZaListu.js";
import {konvertujOdgovorSaServera} from "../alati/konvertujOdgovorSaServera.js";
import {getCustomButtons} from "../alati/customButtons.jsx";

const TraziPoJmbg = () => {
    const [jmbg, setJmbg] = useState(null);
    const [pregledUputnicaModal, setPregledUputnicaModal] = useState(false);
    const [selektovanaUputnica, setSelektovanaUputnica] = useState([]);
    const [detaljiUputnice, setDetaljiUputnice] = useState([]);
    const [selektovanaUputnicaId, setSelektovanaUputnicaId] = useState(null);
    const { uputnica, isLoading } = useUputnicaPoJmbg(jmbg, { enabled: !!jmbg });
    const [triggerFetch, setTriggerFetch] = useState(false);
    const izis_ids = selektovanaUputnica?.map(item => item.lab_tests_results_id);
    const { kisSifre, isLoading: kisSifreLoading } = useVratiKisSifre(izis_ids, { enabled: triggerFetch && izis_ids.length > 0 });


    const [form] = Form.useForm();

    const customButtons = getCustomButtons({
        selektovanaUputnicaId,
        isLoading,
        jmbg,
        form,
        setTriggerFetch,
        handleFormSubmit: (values) => {
            const { p_patient_id } = values;
            setJmbg(p_patient_id);
        },
        setSelektovanaUputnica,
        setSelektovanaUputnicaId,
        setJmbg,
        setPregledUputnicaModal
    });

    // const handleFormSubmit = (values) => {
    //     const { p_patient_id } = values; // Assuming form field name is p_order_id
    //     setJmbg(p_patient_id);
    // };

    const submitHandler = (brojUputnice, uputnica, detalji) => {
        setSelektovanaUputnica(uputnica);
        setSelektovanaUputnicaId(brojUputnice);
        setDetaljiUputnice(detalji);
        setPregledUputnicaModal(false);
    }

    useEffect(()=>{
        if (uputnica?.orders){
            const order = uputnica.orders.find(order => order.order_id === selektovanaUputnicaId);
            setDetaljiUputnice(order);
        }
    },[detaljiUputnice, selektovanaUputnicaId]);

    useEffect(()=>{
        if (kisSifre?.lab_kis_sifre)
            console.log(konvertujOdgovorSaServera(kisSifre.lab_kis_sifre));
    },[kisSifre])

    return (
        <div className={classes.container}>
            {pregledUputnicaModal ? <PregledajUputniceModal openModal={pregledUputnicaModal}
                                                            pacijent={uputnica?.orders[0]?.patient_name}
                                                            listaUputnica={uputnica?.orders}
                                                            selektovanaUputnicaId={selektovanaUputnicaId}
                                                            onSubmit={submitHandler}
                                                            closeModal={()=> setPregledUputnicaModal(false)}/> : null}
            <div className={classes.pretraga}>
                <AntForm form={form} fields={pretragaPoJmbgFormPolja}
                         customButtons={customButtons} pozicijaDugmeta={'centar'}
                />
            </div>
            {jmbg && !isLoading ? (
                <div className={classes.rezultat}>
                    {selektovanaUputnica.length === 0 && uputnica?.orders?.length !== 1 ? (
                        <AntResult
                            title={'Pronađeno je više uputnica za ovaj JMBG'}
                            btnTitle={'Pregledaj sve uputnice'}
                            btnLoading={isLoading}
                            onClick={() => setPregledUputnicaModal(true)}
                        />
                    ) : <AntList fields={uputnicaPoljaLista} data={[detaljiUputnice]} titleField={`Broj uputnice`} keyField={'order_id'}/>}

                    <div className={classes.tabela}>
                        {selektovanaUputnica.length > 0 ?<AntTable
                            columns={rezultatKolone}
                            dataSource={selektovanaUputnica}
                            scroll={{y: 'calc(100dvh - 450px)'}}
                            rowKey={'result_uid'}
                        /> : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default TraziPoJmbg;