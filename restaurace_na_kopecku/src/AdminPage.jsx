import { useEffect, useState, useMemo } from 'react'
import { supabase } from './supabaseClient.js'
import { useAuth } from './hooks/useAuth'
import heic2any from 'heic2any'

const EMPTY_HOURS = {
  monday: { open: null, close: null },
  tuesday: { open: '12:00', close: '22:00' },
  wednesday: { open: '12:00', close: '22:00' },
  thursday: { open: '12:00', close: '22:00' },
  friday: { open: '12:00', close: '23:00' },
  saturday: { open: '12:00', close: '23:00' },
  sunday: { open: '12:00', close: '20:00' },
}

const DAY_LABELS = {
  monday: 'Pondělí',
  tuesday: 'Úterý',
  wednesday: 'Středa',
  thursday: 'Čtvrtek',
  friday: 'Pátek',
  saturday: 'Sobota',
  sunday: 'Neděle',
}

export default function AdminPage() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [menuItems, setMenuItems] = useState([])
  const [openingHours, setOpeningHours] = useState(EMPTY_HOURS)
  const [popup, setPopup] = useState({ active: false, title: '', message: '' })
  const [removedIds, setRemovedIds] = useState([])
  const [initialData, setInitialData] = useState(null)

  // Helper to normalize data for comparison (handling price strings vs numbers)
  const normalizeData = (items, hours, pop) => {
    return JSON.stringify({
      menuItems: items.map((i) => ({
        ...i,
        price: i.price === '' || i.price === null ? null : Number(i.price),
      })),
      openingHours: hours,
      popup: pop,
    })
  }

  const hasUnsavedChanges = useMemo(() => {
    if (!initialData) return false
    if (removedIds.length > 0) return true

    const currentSnapshot = normalizeData(menuItems, openingHours, popup)
    return currentSnapshot !== initialData
  }, [initialData, menuItems, openingHours, popup, removedIds])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (!supabase) {
      setError('Supabase není nakonfigurovaný. Zkontrolujte .env proměnné.')
      setLoading(false)
      return
    }

    const loadAll = async () => {
      setLoading(true)
      setError('')
      try {
        const [{ data: items, error: itemsError }, { data: settings, error: settingsError }] =
          await Promise.all([
            supabase.from('menu_items').select('*').order('id'),
            supabase.from('settings').select('*'),
          ])

        if (itemsError) throw itemsError
        if (settingsError) throw settingsError

        setMenuItems(items ?? [])

        const popupSetting = settings?.find((s) => s.key === 'popup')
        const hoursSetting = settings?.find((s) => s.key === 'opening_hours')

        if (popupSetting?.value) {
          setPopup({
            active: !!popupSetting.value.active,
            title: popupSetting.value.title ?? '',
            message: popupSetting.value.message ?? '',
          })
        }

        // Prepare local variables for snapshot
        const loadedPopup = popupSetting?.value ? {
          active: !!popupSetting.value.active,
          title: popupSetting.value.title ?? '',
          message: popupSetting.value.message ?? '',
        } : { active: false, title: '', message: '' }

        let loadedHours = { ...EMPTY_HOURS }

        if (hoursSetting?.value) {
          const hours = { ...EMPTY_HOURS, ...hoursSetting.value }
          setOpeningHours(hours)
          loadedHours = hours
        } else {
          loadedHours = { ...EMPTY_HOURS }
          setOpeningHours(loadedHours)
        }

        // Save initial snapshot
        setInitialData(normalizeData(items ?? [], loadedHours, loadedPopup))
      } catch (err) {
        setError(err.message ?? 'Chyba při načítání dat')
      } finally {
        setLoading(false)
      }
    }

    loadAll()
  }, [])

  const updateMenuItemField = (index, field, value) => {
    setMenuItems((prev) => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [field]: value }
      return copy
    })
  }

  const addMenuItem = () => {
    setMenuItems((prev) => [
      ...prev,
      { name: '', description: '', price: '', image_url: '', is_visible: true },
    ])
  }

  const removeMenuItem = (index) => {
    setMenuItems((prev) => {
      const toRemove = prev[index]
      if (toRemove?.id) {
        setRemovedIds((ids) =>
          ids.includes(toRemove.id) ? ids : [...ids, toRemove.id],
        )
      }
      return prev.filter((_, i) => i !== index)
    })
  }

  const updateHours = (dayKey, field, value) => {
    setOpeningHours((prev) => ({
      ...prev,
      [dayKey]: { ...prev[dayKey], [field]: value || null },
    }))
  }

  const saveAll = async () => {
    setSaving(true)
    setError('')
    try {
      const cleanedMenu = menuItems
        .filter((item) => item.name.trim() !== '')
        .map((item) => ({
          ...item,
          price: item.price === '' ? null : Number(item.price),
        }))

      const newItems = cleanedMenu.filter((item) => !item.id)
      const existingItems = cleanedMenu.filter((item) => item.id)

      if (existingItems.length > 0) {
        // Using distinct updates because 'upsert' with an ID fails on GENERATED ALWAYS columns
        const updates = existingItems.map((item) => {
          const { id, ...rest } = item
          return supabase.from('menu_items').update(rest).eq('id', id)
        })

        const results = await Promise.all(updates)
        const firstError = results.find((r) => r.error)?.error
        if (firstError) throw firstError
      }

      if (newItems.length > 0) {
        const { error: insertErr } = await supabase
          .from('menu_items')
          .insert(newItems)
        if (insertErr) throw insertErr
      }

      if (removedIds.length > 0) {
        const { error: delErr } = await supabase
          .from('menu_items')
          .delete()
          .in('id', removedIds)
        if (delErr) throw delErr
      }

      const { error: settingsErr } = await supabase.from('settings').upsert(
        [
          { key: 'popup', value: popup },
          { key: 'opening_hours', value: openingHours },
        ],
        {
          onConflict: 'key',
        },
      )

      if (settingsErr) throw settingsErr

      setRemovedIds([])
      // Update snapshot to current state
      setInitialData(normalizeData(menuItems, openingHours, popup))
    } catch (err) {
      setError(err.message ?? 'Chyba při ukládání')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <span className="text-sm tracking-[0.3em] uppercase text-gray-400">
          Načítání administrace…
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-1">
              Admin panel
            </p>
            <h1 className="text-2xl md:text-3xl font-serif">
              Restaurace Na Kopečku
            </h1>
          </div>
          <button
            onClick={logout}
            className="text-xs uppercase tracking-[0.25em] px-3 py-2 border border-white/20 hover:border-accent transition"
          >
            Odhlásit
          </button>
        </header>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/40 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* MENU SECTION */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-serif">Menu</h2>
            <button
              type="button"
              onClick={addMenuItem}
              className="text-xs uppercase tracking-[0.25em] px-3 py-2 border border-white/20 hover:border-accent"
            >
              Přidat položku
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Spravujte jídla v části MENU (název, popis, cena, obrázek).
          </p>

          <div className="space-y-4">
            {menuItems.map((item, index) => (
              <div
                key={item.id ?? index}
                className="border border-white/10 p-4 grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_3fr_auto] gap-3 items-start"
              >
                <input
                  className="bg-black border border-white/20 px-2 py-1 text-sm"
                  placeholder="Název"
                  value={item.name ?? ''}
                  onChange={(e) =>
                    updateMenuItemField(index, 'name', e.target.value)
                  }
                />
                <input
                  className="bg-black border border-white/20 px-2 py-1 text-sm"
                  placeholder="Popis"
                  value={item.description ?? ''}
                  onChange={(e) =>
                    updateMenuItemField(index, 'description', e.target.value)
                  }
                />
                <input
                  className="bg-black border border-white/20 px-2 py-1 text-sm"
                  placeholder="Cena"
                  type="number"
                  min="0"
                  value={item.price ?? ''}
                  onChange={(e) =>
                    updateMenuItemField(index, 'price', e.target.value)
                  }
                />
                <div className="flex flex-col gap-2">
                  <input
                    className="bg-black border border-white/20 px-2 py-1 text-sm w-full"
                    placeholder="URL obrázku"
                    value={item.image_url ?? ''}
                    onChange={(e) =>
                      updateMenuItemField(index, 'image_url', e.target.value)
                    }
                  />
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer bg-white/10 hover:bg-white/20 text-[10px] uppercase tracking-wider text-center py-1 border border-white/10 transition">
                      <span>Nahrát foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          let file = e.target.files?.[0]
                          if (!file) return

                          // Conversion for iPhone HEIC/HEIF
                          try {
                            if (file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')) {
                              const convertedBlob = await heic2any({
                                blob: file,
                                toType: "image/jpeg",
                                quality: 0.8
                              });
                              // Handle array or single blob
                              const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                              file = new File([finalBlob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: "image/jpeg" });
                            }

                            const fileExt = file.name.split('.').pop()
                            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
                            const { data, error } = await supabase.storage
                              .from('menu-images')
                              .upload(fileName, file)

                            if (error) throw error

                            const { data: { publicUrl } } = supabase.storage
                              .from('menu-images')
                              .getPublicUrl(fileName)

                            updateMenuItemField(index, 'image_url', publicUrl)
                          } catch (err) {
                            alert('Chyba při nahrávání: ' + err.message)
                          }
                        }}
                      />
                    </label>
                    {item.image_url && (
                      <button
                        type="button"
                        onClick={() => updateMenuItemField(index, 'image_url', '')}
                        className="px-2 bg-red-500/10 hover:bg-red-500/30 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-wider transition"
                        title="Odstranit fotku"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3">
                  <label className="flex items-center gap-1 text-xs">
                    <input
                      type="checkbox"
                      checked={item.is_visible ?? true}
                      onChange={(e) =>
                        updateMenuItemField(index, 'is_visible', e.target.checked)
                      }
                    />
                    <span>Zobrazit</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeMenuItem(index)}
                    className="text-xs text-gray-400 hover:text-red-400"
                  >
                    Odebrat
                  </button>
                </div>
              </div>
            ))}
            {menuItems.length === 0 && (
              <p className="text-xs text-gray-500">
                Zatím žádné položky. Přidejte první jídlo.
              </p>
            )}
          </div>
        </section>

        {/* OPENING HOURS */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-xl md:text-2xl font-serif">Otevírací doba</h2>
          <p className="text-xs text-gray-400">
            Tyto časy můžete pak použít i na veřejné stránce místo natvrdo
            napsaných hodin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(DAY_LABELS).map(([key, label]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-3 border border-white/10 px-3 py-2 text-sm"
              >
                <span className="w-24">{label}</span>
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <input
                    type="time"
                    className="bg-black border border-white/20 px-2 py-1 text-xs w-20 md:w-24 text-center"
                    value={openingHours[key].open ?? ''}
                    onChange={(e) => updateHours(key, 'open', e.target.value)}
                  />
                  <span>—</span>
                  <input
                    type="time"
                    className="bg-black border border-white/20 px-2 py-1 text-xs w-20 md:w-24 text-center"
                    value={openingHours[key].close ?? ''}
                    onChange={(e) => updateHours(key, 'close', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      updateHours(key, 'open', null)
                      updateHours(key, 'close', null)
                    }}
                    className="ml-2 px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] uppercase tracking-wider border border-red-500/20 transition"
                  >
                    Zavřeno
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POPUP */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h2 className="text-xl md:text-2xl font-serif">Popup / novinka</h2>
          <p className="text-xs text-gray-400">
            Text, který se může zobrazit návštěvníkům jako upozornění na novou
            nabídku nebo akci.
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={popup.active}
                onChange={(e) =>
                  setPopup((prev) => ({ ...prev, active: e.target.checked }))
                }
              />
              <span>Popup aktivní</span>
            </label>
            <input
              className="bg-black border border-white/20 px-3 py-2 text-sm w-full"
              placeholder="Titulek (např. Nové Pho týdne)"
              value={popup.title}
              onChange={(e) =>
                setPopup((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <textarea
              className="bg-black border border-white/20 px-3 py-2 text-sm w-full h-24"
              placeholder="Text popupu..."
              value={popup.message}
              onChange={(e) =>
                setPopup((prev) => ({ ...prev, message: e.target.value }))
              }
            />
          </div>
        </section>

        <footer className="flex items-center justify-end gap-4 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving}
            className="bg-accent hover:bg-orange-600 transition-colors px-5 py-2 text-xs uppercase tracking-[0.3em] disabled:opacity-60"
          >
            {saving ? 'Ukládám…' : 'Uložit změny'}
          </button>
        </footer>
      </div>

      {/* Unsaved Changes Warning Banner */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 animate-slide-up">
          <div className="bg-red-900/90 backdrop-blur-md border border-red-500/50 text-white px-4 py-2 md:px-6 md:py-3 rounded-full shadow-2xl flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="font-bold text-[10px] md:text-xs uppercase tracking-wider">Neuloženo</span>
            </div>
            <button
              onClick={saveAll}
              disabled={saving}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition"
            >
              {saving ? '...' : 'Uložit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

