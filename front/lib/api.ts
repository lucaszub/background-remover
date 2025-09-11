const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function removeBackground(file: File): Promise<Blob> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/remove-bg`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return response.blob();
}

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_URL}/health`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Erreur API: ${response.status}`);
  }

  return response.json();
}
