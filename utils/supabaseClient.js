// utils/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 키 불러오기 (.env에 설정 필요)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// Supabase 인스턴스 생성
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
