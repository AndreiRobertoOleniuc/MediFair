import { Explanation, Positions } from "~/models/ApiResponse";

export const documentApi = {
  analyseDocument: async (uri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/process`,
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      console.log(response.status);
      console.log("Error", response);
      throw new Error("Network response was not ok");
    }

    return response.json();
  },

  fetchExplainPosition: async (position: Positions): Promise<Explanation> => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/explain`,
      {
        method: "POST",
        headers: {
          "x-api-key": process.env.EXPO_PUBLIC_API_KEY || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          extractionResult: [
            {
              beschreibung: position.beschreibung,
              betrag: position.betrag,
              datum: position.datum,
              tarifziffer: position.tarifziffer,
              bezugsziffer: position.bezugsziffer || "",
              anzahl: position.anzahl,
              tarif: position.tarif,
              titel: position.titel,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      console.log(response.status);
      console.log("Error", response);
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    // Extract the nested explanation object
    return data.explanation as Explanation;
  },
};
