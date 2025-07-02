import { useNotification } from "../../../context/NotificationContext.jsx";
import { useMutation } from "@tanstack/react-query";
import { posaljiRezultate } from "../../../lib/api.js";

export const usePosaljiRezultate = () => {
  const { openNotification } = useNotification();

  const { mutate, ...rest } = useMutation({
    mutationFn: posaljiRezultate,
    onSuccess: (data, variables) => {
      console.log("Uspješno poslani rezultati", data);
      console.log("Varijable", variables);
      openNotification(
        data?.status_code === "200" ? "success" : "error",
        "Obavještenje",
        data?.parsirani_podaci?.message || "Rezultati posalti"
      );
    },
    onError: (error) => {
      openNotification(
        "error",
        `Obavještenje`,
        error.response.data.poruka || "Greška pri slanju rezultata"
      );
    },
  });

  return { posaljiRezultate: mutate, ...rest };
};
