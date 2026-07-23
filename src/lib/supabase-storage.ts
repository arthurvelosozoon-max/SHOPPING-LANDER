import { createClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGES_BUCKET = "product-images";

function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase Storage is not configured");
  return createClient(url, key);
}

/**
 * Creates a short-lived signed URL the browser can upload directly to,
 * bypassing the Netlify function payload limit (~6MB) entirely — only this
 * small signed-URL request goes through our server.
 */
export async function createSignedUploadUrl(extension: string) {
  const supabase = getServiceClient();
  const path = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .createSignedUploadUrl(path);

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(path);

  return { token: data.token, path, publicUrl: publicUrlData.publicUrl };
}
