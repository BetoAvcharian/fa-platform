-- =========================================================
-- MIGRACIÓN V19 — arregla el borrado de documentos
-- (faltaba contemplar a los Manager, y se reafirma por las
-- dudas de que no haya quedado bien aplicada la política)
-- =========================================================
drop policy if exists "documentos_select" on storage.objects;
drop policy if exists "documentos_insert" on storage.objects;
drop policy if exists "documentos_delete" on storage.objects;

create policy "documentos_select" on storage.objects for select using (
  bucket_id = 'documentos-clientes'
  and (
    public.fn_rol() = 'admin'
    or (storage.foldername(name))[1]::uuid in (
      select id from public.clientes
      where owner_id = auth.uid()
         or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
    )
  )
);

create policy "documentos_insert" on storage.objects for insert with check (
  bucket_id = 'documentos-clientes'
  and (storage.foldername(name))[1]::uuid in (
    select id from public.clientes
    where owner_id = auth.uid()
       or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
       or public.fn_rol() = 'admin'
  )
);

create policy "documentos_delete" on storage.objects for delete using (
  bucket_id = 'documentos-clientes'
  and (
    public.fn_rol() = 'admin'
    or (storage.foldername(name))[1]::uuid in (
      select id from public.clientes
      where owner_id = auth.uid()
         or (public.fn_rol() = 'manager' and owner_id in (select public.fn_equipo(auth.uid())))
    )
  )
);
