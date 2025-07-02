import { useState } from "react";

const useSlanjeBionet = () => {
  const [isLoading, setIsLoading] = useState(false);

  const slanjeBionet = async (data) => {
    setIsLoading(true);
    const payload = new URLSearchParams();
    payload.append("data", JSON.stringify(data));

    try {
      const response = await fetch(
        "../rpc/laboratorija.cfc?method=slanje_bionet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: payload,
        }
      );
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return { slanjeBionet, isLoading };
};

export default useSlanjeBionet;
