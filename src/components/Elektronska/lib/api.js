import { makeKisRequest /* makeRequest */ } from "../podesavanja/apiClient.js";

export const dohvatiUputnicu = async (id) =>
  makeKisRequest.get(
    `/izis.cfc?method=vrati_uputnicu_po_id&broj_uputnice=${id}`
  );
export const dohvatiUputnicuPoJmbg = async (id) =>
  makeKisRequest.get(`/izis.cfc?method=vrati_uputnicu_po_jmbg&jmbg=${id}`); //makeRequest.get(`/orders?p_patient_id=${id}`);
export const vratiKisSifre = async (data) =>
  makeKisRequest.post(`/lab_izis_kis.cfc?method=vrati_kis_sifru`, data);
export const posaljiPretrage = async (data) =>
  makeKisRequest.post(`/lab_izis_kis.cfc?method=finalni_lab_rezultati`, data);
export const napraviNoviDokument = async (data) =>
  makeKisRequest.post(`/lab_izis_kis.cfc?method=napravi_dokument`, data);
export const dohvatiEvidentiraneUputnice = async (broj_uputnice) =>
  makeKisRequest.get(
    `/lab_izis_kis.cfc?method=vrati_evidentirane_uputnice&broj_uputnice=${broj_uputnice}`
  );
export const evidentirajUputnicu = async (data) =>
  makeKisRequest.post(`/lab_izis_kis.cfc?method=evidentiraj_uputnicu`, data);
export const dohvatiIzisSifarnikLabPretraga = async () =>
  makeKisRequest.get(`/povezivanje_sifarnika.cfc?method=vrati_izis_sifarnik`);
export const dohvatiKisSifarnikLabPretraga = async () =>
  makeKisRequest.get(`/povezivanje_sifarnika.cfc?method=vrati_kis_sifarnik`);
export const poveziSifarnike = async (data) =>
  makeKisRequest.post(
    `/povezivanje_sifarnika.cfc?method=povezi_izis_kis`,
    data
  );
export const dohvatiPovezaneSifre = async () =>
  makeKisRequest.get(
    `/povezivanje_sifarnika.cfc?method=vrati_povezane_sifre_kis_izis`
  );
export const azurirajStatus = async (data) =>
  makeKisRequest.post(`/izis.cfc?method=azuriraj_status`, data);
export const posaljiRezultate = async (data) =>
  makeKisRequest.post(`/test.cfc?method=returnPostBody`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
