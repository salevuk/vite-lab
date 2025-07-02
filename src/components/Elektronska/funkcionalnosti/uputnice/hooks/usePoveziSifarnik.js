import {useMutation, useQuery} from "@tanstack/react-query";
import {konvertujOdgovorSaServera} from "../alati/konvertujOdgovorSaServera.js";
import {
    dohvatiIzisSifarnikLabPretraga,
    dohvatiKisSifarnikLabPretraga,
    dohvatiPovezaneSifre,
    poveziSifarnike
} from "../../../lib/api.js";
import {queryClient} from "../../../podesavanja/queryClient.js";
import {useNotification} from "../../../context/NotificationContext.jsx";

export const IZIS_SIFARNIK = 'izis_sifarnik';
export const KIS_SIFARNIK = 'kis_sifarnik';
export const POVEZANE_SIFRE = 'povezane_sifre';

export const useIzisSifarnik = (opts = {}) => {
    const { data: rawIzisSifarnik, ...rest } = useQuery({
        queryKey: [IZIS_SIFARNIK],
        queryFn: dohvatiIzisSifarnikLabPretraga,
        ...opts
    });

    const izisSifarnik = rawIzisSifarnik?.parsirani_podaci?.items || [];

    return { izisSifarnik, ...rest };
};

export const useKisSifarnik = (opts = {}) => {
    const { data: rawKisSifarnik, ...rest } = useQuery({
        queryKey: [KIS_SIFARNIK],
        queryFn: dohvatiKisSifarnikLabPretraga,
        ...opts
    });

    const kisSifarnik = rawKisSifarnik?.lab_pretrage_kis ? konvertujOdgovorSaServera(rawKisSifarnik?.lab_pretrage_kis) : [];

    return { kisSifarnik, ...rest };
};

export const usePoveziSifarnike = () => {
    const {openNotification} = useNotification();
    const {mutate, ...rest} = useMutation({
        mutationFn: poveziSifarnike,
        onSuccess: async () => {
            await queryClient.invalidateQueries([IZIS_SIFARNIK]);
            await queryClient.invalidateQueries([KIS_SIFARNIK]);
        },
        onError: (error) => {
            openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri povezivanja šifarnika');
        }
    });

    return {poveziSifarnike: mutate, ...rest};
}

export const usePovezaneSifre = (opts = {}) => {
    const { data: rawPovezaniSifarnik, ...rest } = useQuery({
        queryKey: [POVEZANE_SIFRE],
        queryFn: dohvatiPovezaneSifre,
        ...opts
    });

    const povezaneSifre = rawPovezaniSifarnik?.povezane_sifre ? konvertujOdgovorSaServera(rawPovezaniSifarnik?.povezane_sifre) : [];

    return { povezaneSifre, ...rest };
};