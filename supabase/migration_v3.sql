-- =========================================================
-- MIGRACIÓN V3 — Documentos por cliente
-- =========================================================
-- PASO MANUAL PRIMERO (no se puede por SQL):
-- 1. Supabase → Storage → New bucket
-- 2. Nombre: documentos-clientes
-- 3. Dejalo como "Private" (NO marques "Public bucket")
-- 4. Create bucket
--
-- Después de crear el bucket, corré este script:
-- =========================================================

create policy "documentos_select" on storage.objects for select using (
  bucket_id = 'documentos-clientes'
  and (
    public.fn_rol() = 'admin'
    or (storage.foldername(name))[1]::uuid in (select id from public.clientes where owner_id = auth.uid())
  )
);

create policy "documentos_insert" on storage.objects for insert with check (
  bucket_id = 'documentos-clientes'
  and (storage.foldername(name))[1]::uuid in (select id from public.clientes where owner_id = auth.uid())
);

create policy "documentos_delete" on storage.objects for delete using (
  bucket_id = 'documentos-clientes'
  and (
    public.fn_rol() = 'admin'
    or (storage.foldername(name))[1]::uuid in (select id from public.clientes where owner_id = auth.uid())
  )
);
