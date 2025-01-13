import { Secrets } from "@/Secrets";

export const documentApi = {
  uploadImage: async (uri: string) => {
    const formData = new FormData();
    formData.append("image", {
      uri: uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);

    const response = await fetch(
      "https://tarmed-backend.pages.dev/api/process",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": Secrets.tarmedAPIKEY,
        },
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error("Network response was not ok");
    }

    return response.json();
  },
};
