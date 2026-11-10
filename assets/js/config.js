/*
 * Supabase connection for the admin panel and live content.
 * Leave both empty and the site runs from the built-in catalog (assets/js/catalog.js).
 * The anon key is public by design: Row Level Security in supabase/schema.sql decides who can write.
 */
window.PG_CONFIG = {
  supabaseUrl: '',
  supabaseKey: ''
};
