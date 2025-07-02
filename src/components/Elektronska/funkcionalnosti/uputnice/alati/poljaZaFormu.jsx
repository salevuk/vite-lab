export const pretragaPoUputniciFormPolja = [
  {
    name: "p_order_id",
    label: "Broj uputnice",
    rules: [{ required: true, message: "Obavezno polje" }],
    placeholder: "Unesite broj IZIS uputnice",
    type: "text",
    autoFocus: true,
  },
];

export const pretragaPoJmbgFormPolja = [
  {
    name: "p_patient_id",
    label: "JMBG",
    rules: [
      { required: true, message: "Obavezno polje" },
      { min: 13, max: 13, message: "JMBG mora imati 13 cifara" },
    ],
    placeholder: "Unesite JMBG",
    type: "text",
    autoFocus: true,
  },
];
