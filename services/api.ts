import { Explanation, Positions } from "~/models/ApiResponse";

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorBody = {};
    try {
      errorBody = await response.json();
    } catch (_) {
      // fallback if response body is not JSON
    }

    const error: ApiError = {
      status: response.status,
      message:
        (errorBody as any)?.message ||
        `Request failed with status ${response.status}`,
      details: errorBody,
    };

    throw error;
  }

  return response.json();
};

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

    return handleResponse(response);
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

    const data = await handleResponse(response);
    return data.explanation as Explanation;
  },
};
