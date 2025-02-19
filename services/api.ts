import { Secrets } from "@/Secrets";

export const documentApi = {
  analyseDocument: async (uri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    const response = await fetch(`${Secrets.tarmedAPIURI}/api/process`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": Secrets.tarmedAPIKEY,
      },
    });

    if (!response.ok) {
      console.log(response.status);
      console.log("Error", response);
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
};
