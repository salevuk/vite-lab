import { useMutation } from "@tanstack/react-query";
import { useNotification } from "../../../context/NotificationContext.jsx";
import { azurirajStatus } from "../../../lib/api";

export const useAzurirajStatus = () => {
  const { openNotification } = useNotification();

  const { mutate, ...rest } = useMutation({
    mutationFn: azurirajStatus,
    onSuccess: (data, variables) => {
      console.log("Uspješno ažuriran status uputnice", data);
      console.log("Varijable", variables);
      openNotification(
        data?.status_code === "200" ? "success" : "error",
        "Obavještenje",
        data?.parsirani_podaci?.message ||
          "Uspješno ste ažurirali status uputnice"
      );
    },
    onError: (error) => {
      openNotification(
        "error",
        `Obavještenje`,
        error.response.data.poruka || "Greška pri ažuriranju statusa uputnice"
      );
    },
  });

  return { azurirajStatus: mutate, ...rest };
};
