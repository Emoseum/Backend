// uploadImage.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function uploadImageToSupabase(buffer, fileName) {
  const { data, error } = await supabase.storage
    .from('emoseum-images')
    .upload(`generated/${fileName}`, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (error) {
    console.error('Upload failed:', error.message);
    return null;
  }

  const { data: urlData } = supabase
    .storage
    .from('emoseum-images')
    .getPublicUrl(`generated/${fileName}`);

  return urlData.publicUrl;
}
