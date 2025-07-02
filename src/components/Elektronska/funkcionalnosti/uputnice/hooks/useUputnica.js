import { useMutation, useQuery } from "@tanstack/react-query";
import {
  dohvatiEvidentiraneUputnice,
  dohvatiUputnicu,
  dohvatiUputnicuPoJmbg,
  evidentirajUputnicu,
  napraviNoviDokument,
  posaljiPretrage,
  vratiKisSifre,
} from "../../../lib/api.js";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { konvertujOdgovorSaServera } from "../alati/konvertujOdgovorSaServera.js";
//import {queryClient} from "../../../podesavanja/queryClient.js";

export const UPUTNICA = "pacijent_uputnica";
export const UPUTNICA_JMBG = "pacijent_uputnica_jmbg";
export const EVIDENTIRANE_UPUTNICE = "evidentirane_uputnice";

export const useUputnica = (id, opts = {}) => {
  const { data: uputnica, ...rest } = useQuery({
    queryKey: [UPUTNICA, id],
    queryFn: () => dohvatiUputnicu(id),
    ...opts,
  });

  return { uputnica, ...rest };
};

export const useUputnicaPoJmbg = (jmbg, opts = {}) => {
  const { data: uputnica, ...rest } = useQuery({
    queryKey: [UPUTNICA_JMBG, jmbg],
    queryFn: () => dohvatiUputnicuPoJmbg(jmbg),
    ...opts,
  });

  return { uputnica: uputnica?.parsirani_podaci, ...rest };
};

export const useVratiKisSifre = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: vratiKisSifre,
    // onSuccess: () => {
    //     openNotification('success', 'Obavještenje', 'Uspješno ste preuzeli KIS šifre');
    // },
    // onError: (error) => {
    //     openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri preuzimanju kis šifara');
    // }
  });

  return { vratiKisSifre: mutate, ...rest, data: rest.data?.data };
};

export const usePosaljiPretrage = () => {
  const { openNotification } = useNotification();

  const { mutate, ...rest } = useMutation({
    mutationFn: posaljiPretrage,
    onSuccess: () => {
      openNotification(
        "success",
        "Obavještenje",
        "Uspješno ste poslali pretragu"
      );
    },
    onError: (error) => {
      openNotification(
        "error",
        `Obavještenje`,
        error.response.data.poruka || "Greška pri preuzimanju kis šifara"
      );
    },
  });

  return { posaljiPretrage: mutate, ...rest };
};

export const useKreirajDokument = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: napraviNoviDokument,
    // onSuccess: () => {
    //     openNotification('success', 'Obavještenje', 'Uspješno ste kreirali dokument');
    // },
    // onError: (error) => {
    //     openNotification('error', `Obavještenje`, error.response.data.poruka || 'Greška pri preuzimanju kis šifara');
    // }
  });

  return { napraviNoviDokument: mutate, ...rest };
};

// export const useEvidentiraneUputnice = (broj_uputnice, opts = {}) => {
//     const { data, ...rest } = useQuery({
//         queryKey: [EVIDENTIRANE_UPUTNICE, broj_uputnice],
//         queryFn: () => dohvatiEvidentiraneUputnice(broj_uputnice),
//         ...opts
//     });
//
//     // Ensure data and evidentirane_uputnice exist before using konvertujOdgovorSaServera
//     const evidentirane_uputnice = data?.evidentirane_uputnice ? konvertujOdgovorSaServera(data.evidentirane_uputnice) : [];
//
//     return { evidentirane_uputnice, ...rest };
// }

export const useEvidentiraneUputnice = (brojUputnice, opts = {}) => {
  // Define the query key and function based on whether it's a single or multiple order IDs
  const queryKey = Array.isArray(brojUputnice)
    ? brojUputnice.map((id) => [EVIDENTIRANE_UPUTNICE, id])
    : [EVIDENTIRANE_UPUTNICE, brojUputnice];

  const queryFn = Array.isArray(brojUputnice)
    ? () =>
        Promise.all(brojUputnice.map((id) => dohvatiEvidentiraneUputnice(id)))
    : () => dohvatiEvidentiraneUputnice(brojUputnice);

  const queryConfig = {
    queryKey,
    queryFn,
    ...opts,
  };

  // Use React Query with the object form
  const { data, isLoading, isError, ...rest } = useQuery(queryConfig);

  // Transform and aggregate the data if it's an array of responses
  const evidentirane_uputnice = data
    ? Array.isArray(data)
      ? data
          .map((response) =>
            response?.evidentirane_uputnice
              ? konvertujOdgovorSaServera(response.evidentirane_uputnice)
              : []
          )
          .flat()
      : konvertujOdgovorSaServera(data.evidentirane_uputnice)
    : [];

  return { evidentirane_uputnice, isLoading, isError, ...rest };
};

export const useEvidentirajUputnicu = () => {
  const { mutate, ...rest } = useMutation({
    mutationFn: evidentirajUputnicu,
  });

  return { evidentirajUputnicu: mutate, ...rest };
};
