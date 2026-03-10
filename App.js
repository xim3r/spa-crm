import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabase'

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, className = '' }) => {
  const icons = {
    dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    agenda: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
    clients: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    inventory: 'M20 7H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-9 9H9v2H7v-2H5v-2h2v-2h2v2h2v2zm6.5 1c-.83 0-1.5-.67-1.5-1.5S16.67 14 17.5 14s1.5.67 1.5 1.5S18.33 17 17.5 17zm3-4c-.83 0-1.5-.67-1.5-1.5S19.67 10 20.5 10s1.5.67 1.5 1.5S21.33 13 20.5 13zM4 3h16v2H4z',
    services: 'M19.8 18.4L14 10.67V6.5l1.35-1.69c.26-.33.03-.81-.39-.81H9.04c-.42 0-.65.48-.39.81L10 6.5v4.17L4.2 18.4c-.49.65-.01 1.6.8 1.6h14c.81 0 1.29-.95.8-1.6z',
    pos: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.1 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z',
    tickets: 'M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-5-6l1.5 1.5-6 6L9 12l6-6z',
    credits: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z',
    staff: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    promos: 'M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z',
    campaigns: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z',
    reports: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
    users: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
    plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
    close: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
    search: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    menu: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    check: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
    trash: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    chevronLeft: 'M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z',
    chevronRight: 'M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.59z',
    logout: 'M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z',
    eye: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
    dollar: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d={icons[name] || icons.dashboard} />
    </svg>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = n => `$${Number(n || 0).toLocaleString('es-MX')}`
const today = () => new Date().toISOString().split('T')[0]

// ─── MODAL ───────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="modal-overlay" onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
    <div className={`modal-box ${wide ? 'modal-wide' : ''}`}>
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button className="modal-close" onClick={onClose}><Icon name="close" size={20} /></button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
)

const FI = ({ label, required, children }) => (
  <div className="form-item">
    <label className="form-label">{label}{required && <span style={{ color: '#c9a87c' }}>*</span>}</label>
    {children}
  </div>
)

const Badge = ({ status }) => {
  const map = { Confirmada: '#2d9e6b', Pendiente: '#e89c20', Cancelada: '#e05252', Completada: '#5b8dee' }
  return <span className="badge" style={{ background: (map[status] || '#999') + '22', color: map[status] || '#999' }}>{status}</span>
}

const StatCard = ({ label, value, sub, icon, color = '#c9a87c', trend }) => (
  <div className="stat-card">
    <div className="stat-card-header">
      <div className="stat-icon" style={{ background: color + '22', color }}><Icon name={icon} size={20} /></div>
      {trend && <span className="stat-trend">↑ {trend}</span>}
    </div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
)

const Spinner = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
    <div className="spinner" />
  </div>
)

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN SCREEN
// ═══════════════════════════════════════════════════════════════════════════
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Email o contraseña incorrectos')
    setLoading(false)
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">
          <h1 className="login-brand">Étienne</h1>
          <p className="login-sub">Beauty & Spa · Medical</p>
        </div>
        <form onSubmit={handleLogin}>
          <FI label="Email">
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required />
          </FI>
          <FI label="Contraseña">
            <div style={{ position: 'relative' }}>
              <input className="input" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required style={{ paddingRight: 40 }} />
              <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a7d6b' }}>
                <Icon name="eye" size={18} />
              </button>
            </div>
          </FI>
          {error && <div className="error-msg">{error}</div>}
          <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 8, padding: 12, fontSize: '0.95rem' }} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const [stats, setStats] = useState({ ingresos: 0, citas: 0, clientes: 0, stockBajo: 0 })
  const [citasHoy, setCitasHoy] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('Mes')

  useEffect(() => {
    const load = async () => {
      const [{ data: tickets }, { count: clientes }, { data: productos }, { data: citas }] = await Promise.all([
        supabase.from('tickets').select('total'),
        supabase.from('clients').select('*', { count: 'exact', head: true }).eq('activo', true),
        supabase.from('productos').select('stock, stock_min'),
        supabase.from('citas').select('*, clients(nombre), servicios(nombre)').eq('fecha', today()),
      ])
      setStats({
        ingresos: tickets?.reduce((s, t) => s + (t.total || 0), 0) || 0,
        citas: citas?.length || 0,
        clientes: clientes || 0,
        stockBajo: productos?.filter(p => p.stock <= p.stock_min).length || 0,
      })
      setCitasHoy(citas || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Buenos días ✨</h1>
          <p className="page-sub">{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="btn-group">
          {['Hoy', 'Semana', 'Mes'].map(p => (
            <button key={p} className={`btn-period ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon="dollar" label="Ingresos Totales" value={fmt(stats.ingresos)} color="#2d9e6b" trend="12%" />
        <StatCard icon="agenda" label="Citas Hoy" value={stats.citas} sub={`${citasHoy.filter(c => c.estado === 'Confirmada').length} confirmadas`} color="#5b8dee" />
        <StatCard icon="clients" label="Clientes Activos" value={stats.clientes} color="#c9a87c" />
        <StatCard icon="warning" label="Alerta Stock" value={stats.stockBajo} sub="productos bajos" color="#e05252" />
      </div>
      <div className="info-card" style={{ marginTop: 0 }}>
        <h4 className="info-card-title">Citas de Hoy</h4>
        {citasHoy.length === 0
          ? <p className="empty-text">Sin citas para hoy</p>
          : citasHoy.map(c => (
            <div key={c.id} className="cita-mini">
              <div className="cita-hora">{c.inicio?.slice(0, 5)}</div>
              <div>
                <div className="cita-nombre">{c.clients?.nombre}</div>
                <div className="cita-servicio">{c.servicios?.nombre}</div>
              </div>
              <Badge status={c.estado} />
            </div>
          ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// AGENDA
// ═══════════════════════════════════════════════════════════════════════════
const Agenda = () => {
  const [selDate, setSelDate] = useState(today())
  const [citas, setCitas] = useState([])
  const [clients, setClients] = useState([])
  const [servicios, setServicios] = useState([])
  const [staff, setStaff] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ cliente_id: '', servicio_id: '', especialista_id: '', cabina: 'Sin cabina', fecha: today(), inicio: '', fin: '', estado: 'Pendiente', precio: 0, notas: '' })

  const load = useCallback(async () => {
    const [{ data: c }, { data: cl }, { data: sv }, { data: st }] = await Promise.all([
      supabase.from('citas').select('*, clients(nombre), servicios(nombre), staff(nombre)').eq('fecha', selDate).order('inicio'),
      supabase.from('clients').select('id,nombre').eq('activo', true),
      supabase.from('servicios').select('id,nombre,precio'),
      supabase.from('staff').select('id,nombre').eq('activo', true),
    ])
    setCitas(c || [])
    setClients(cl || [])
    setServicios(sv || [])
    setStaff(st || [])
  }, [selDate])

  useEffect(() => { load() }, [load])

  const saveCita = async () => {
    if (!form.cliente_id || !form.servicio_id) return
    setSaving(true)
    await supabase.from('citas').insert([form])
    setSaving(false)
    setShowModal(false)
    setForm({ cliente_id: '', servicio_id: '', especialista_id: '', cabina: 'Sin cabina', fecha: today(), inicio: '', fin: '', estado: 'Pendiente', precio: 0, notas: '' })
    load()
  }

  const deleteCita = async id => {
    await supabase.from('citas').delete().eq('id', id)
    load()
  }

  const hours = Array.from({ length: 13 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda</h1>
          <p className="page-sub">{new Date(selDate + 'T12:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn-icon" onClick={() => { const d = new Date(selDate + 'T12:00'); d.setDate(d.getDate() - 1); setSelDate(d.toISOString().split('T')[0]) }}><Icon name="chevronLeft" size={18} /></button>
          <input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} className="input" style={{ width: 160 }} />
          <button className="btn-icon" onClick={() => { const d = new Date(selDate + 'T12:00'); d.setDate(d.getDate() + 1); setSelDate(d.toISOString().split('T')[0]) }}><Icon name="chevronRight" size={18} /></button>
          <button className="btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={16} />Nueva Cita</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="cal-header-row">
          <div className="cal-time-gutter" />
          <div className="cal-day-col-header">{new Date(selDate + 'T12:00').toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }).toUpperCase()}</div>
        </div>
        {hours.map(h => {
          const hourCitas = citas.filter(c => c.inicio?.startsWith(h.substring(0, 2)))
          return (
            <div key={h} className="cal-row">
              <div className="cal-time">{h}</div>
              <div className="cal-cell">
                {hourCitas.map(c => (
                  <div key={c.id} className="cal-event" style={{ borderColor: c.estado === 'Confirmada' ? '#2d9e6b' : '#e89c20' }}>
                    <div className="cal-event-time">{c.inicio?.slice(0,5)}–{c.fin?.slice(0,5)}</div>
                    <div className="cal-event-name">{c.clients?.nombre}</div>
                    <div className="cal-event-service">{c.servicios?.nombre} · {c.staff?.nombre}</div>
                    <div className="cal-event-footer">
                      <Badge status={c.estado} />
                      <button className="btn-ghost-sm" onClick={() => deleteCita(c.id)}><Icon name="trash" size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && (
        <Modal title="Nueva Cita" onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <FI label="Cliente" required>
              <select className="input" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))}>
                <option value="">Seleccionar cliente...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </FI>
            <FI label="Servicio" required>
              <select className="input" value={form.servicio_id} onChange={e => { const sv = servicios.find(s => s.id === e.target.value); setForm(f => ({ ...f, servicio_id: e.target.value, precio: sv?.precio || 0 })) }}>
                <option value="">Seleccionar servicio...</option>
                {servicios.map(s => <option key={s.id} value={s.id}>{s.nombre} – {fmt(s.precio)}</option>)}
              </select>
            </FI>
            <FI label="Especialista">
              <select className="input" value={form.especialista_id} onChange={e => setForm(f => ({ ...f, especialista_id: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {staff.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </FI>
            <FI label="Cabina">
              <select className="input" value={form.cabina} onChange={e => setForm(f => ({ ...f, cabina: e.target.value }))}>
                {['Sin cabina', 'Cabina 1', 'Cabina 2', 'Cabina 3', 'Quirófano'].map(c => <option key={c}>{c}</option>)}
              </select>
            </FI>
            <FI label="Fecha" required><input type="date" className="input" value={form.fecha} onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} /></FI>
            <FI label="Inicio"><input type="time" className="input" value={form.inicio} onChange={e => setForm(f => ({ ...f, inicio: e.target.value }))} /></FI>
            <FI label="Fin"><input type="time" className="input" value={form.fin} onChange={e => setForm(f => ({ ...f, fin: e.target.value }))} /></FI>
            <FI label="Estado">
              <select className="input" value={form.estado} onChange={e => setForm(f => ({ ...f, estado: e.target.value }))}>
                {['Pendiente', 'Confirmada', 'Completada', 'Cancelada'].map(s => <option key={s}>{s}</option>)}
              </select>
            </FI>
            <FI label="Precio Total"><input type="number" className="input" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: +e.target.value }))} /></FI>
          </div>
          <FI label="Notas"><textarea className="input" rows={3} value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} /></FI>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={saveCita} disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cita'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CLIENTES
// ═══════════════════════════════════════════════════════════════════════════
const Clientes = () => {
  const [clients, setClients] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState(0)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const blankForm = { nombre: '', telefono: '+52 55 ', email: '', fecha_nac: '', tipo_piel: '', alergias: '', antecedentes: '', diagnostico: '', consentimiento: false, requiere_factura: false, rfc: '', razon_social: '', direccion_fiscal: '', uso_cfdi: '', email_factura: '', activo: true }
  const [form, setForm] = useState(blankForm)

  const load = async () => {
    const { data } = await supabase.from('clients').select('*').order('nombre')
    setClients(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = clients.filter(c =>
    c.nombre?.toLowerCase().includes(q.toLowerCase()) ||
    c.telefono?.includes(q) || c.id?.includes(q.toUpperCase())
  )

  const save = async () => {
    if (!form.nombre) return
    setSaving(true)
    if (selected) {
      await supabase.from('clients').update(form).eq('id', selected.id)
    } else {
      await supabase.from('clients').insert([form])
    }
    setSaving(false)
    setShowModal(false)
    setSelected(null)
    load()
  }

  const openEdit = c => { setSelected(c); setForm({ ...c }); setTab(0); setShowModal(true) }
  const openNew = () => { setSelected(null); setForm(blankForm); setTab(0); setShowModal(true) }

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Expedientes</h1>
          <p className="page-sub">{clients.length} clientes registradas</p>
        </div>
        <button className="btn-primary" onClick={openNew}><Icon name="plus" size={16} />Nueva Cliente</button>
      </div>
      <div className="search-bar">
        <Icon name="search" size={16} className="search-icon" />
        <input className="search-input" placeholder="Buscar por nombre, ID, teléfono..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Tipo Piel</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="table-row">
                <td className="table-id">{c.id}</td>
                <td className="fw-bold">{c.nombre}</td>
                <td>{c.telefono}</td>
                <td>{c.email}</td>
                <td>{c.tipo_piel}</td>
                <td><span className="badge" style={{ background: c.activo ? '#2d9e6b22' : '#99999922', color: c.activo ? '#2d9e6b' : '#999' }}>{c.activo ? 'Activa' : 'Inactiva'}</span></td>
                <td><button className="btn-ghost-sm" onClick={() => openEdit(c)}><Icon name="edit" size={15} /></button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="empty-cell">Sin clientes encontradas</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={selected ? 'Editar Cliente' : 'Nueva Cliente'} onClose={() => { setShowModal(false); setSelected(null) }} wide>
          <div className="modal-tabs">
            {['Datos Personales', 'Ficha Clínica', 'Facturación'].map((t, i) => (
              <button key={t} className={`modal-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
            ))}
          </div>
          {tab === 0 && (
            <div className="form-grid">
              <FI label="Nombre Completo" required><input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></FI>
              <FI label="Teléfono" required><input className="input" value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} /></FI>
              <FI label="Email"><input className="input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></FI>
              <FI label="Fecha de Nacimiento"><input className="input" type="date" value={form.fecha_nac || ''} onChange={e => setForm(f => ({ ...f, fecha_nac: e.target.value }))} /></FI>
              <FI label="Tipo de Piel">
                <select className="input" value={form.tipo_piel || ''} onChange={e => setForm(f => ({ ...f, tipo_piel: e.target.value }))}>
                  <option value="">Seleccionar...</option>
                  {['Normal', 'Seca', 'Grasa', 'Mixta', 'Sensible', 'Madura'].map(t => <option key={t}>{t}</option>)}
                </select>
              </FI>
              <FI label="Estado">
                <select className="input" value={form.activo ? 'Activa' : 'Inactiva'} onChange={e => setForm(f => ({ ...f, activo: e.target.value === 'Activa' }))}>
                  <option>Activa</option><option>Inactiva</option>
                </select>
              </FI>
            </div>
          )}
          {tab === 1 && (
            <div>
              <FI label="Alergias Conocidas"><input className="input" value={form.alergias || ''} onChange={e => setForm(f => ({ ...f, alergias: e.target.value }))} placeholder="Retinol, fragancia, látex..." /></FI>
              <FI label="Antecedentes Médicos / Tratamientos Previos"><textarea className="input" rows={3} value={form.antecedentes || ''} onChange={e => setForm(f => ({ ...f, antecedentes: e.target.value }))} placeholder="Cirugías, medicamentos, condiciones crónicas..." /></FI>
              <FI label="Diagnóstico / Observaciones Clínicas"><textarea className="input" rows={3} value={form.diagnostico || ''} onChange={e => setForm(f => ({ ...f, diagnostico: e.target.value }))} placeholder="Observaciones del especialista..." /></FI>
              <label className="checkbox-row">
                <input type="checkbox" checked={form.consentimiento || false} onChange={e => setForm(f => ({ ...f, consentimiento: e.target.checked }))} />
                <span>Consentimiento informado firmado</span>
              </label>
            </div>
          )}
          {tab === 2 && (
            <div>
              <label className="checkbox-row" style={{ marginBottom: 16 }}>
                <input type="checkbox" checked={form.requiere_factura || false} onChange={e => setForm(f => ({ ...f, requiere_factura: e.target.checked }))} />
                <span><strong>Cliente requiere factura</strong></span>
              </label>
              {form.requiere_factura && (
                <div className="form-grid">
                  <FI label="Razón Social"><input className="input" value={form.razon_social || ''} onChange={e => setForm(f => ({ ...f, razon_social: e.target.value }))} /></FI>
                  <FI label="RFC"><input className="input" value={form.rfc || ''} onChange={e => setForm(f => ({ ...f, rfc: e.target.value }))} /></FI>
                  <FI label="Dirección Fiscal"><input className="input" value={form.direccion_fiscal || ''} onChange={e => setForm(f => ({ ...f, direccion_fiscal: e.target.value }))} /></FI>
                  <FI label="Uso de CFDI">
                    <select className="input" value={form.uso_cfdi || ''} onChange={e => setForm(f => ({ ...f, uso_cfdi: e.target.value }))}>
                      <option value="">Seleccionar...</option>
                      {['G01 - Adquisición de mercancias', 'G03 - Gastos en general', 'S01 - Sin efectos fiscales'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </FI>
                  <FI label="Email para facturas"><input className="input" type="email" value={form.email_factura || ''} onChange={e => setForm(f => ({ ...f, email_factura: e.target.value }))} /></FI>
                </div>
              )}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => { setShowModal(false); setSelected(null) }}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// INVENTARIO
// ═══════════════════════════════════════════════════════════════════════════
const Inventario = () => {
  const [productos, setProductos] = useState([])
  const [tipo, setTipo] = useState('kbeauty')
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('Todos')
  const [stockFilter, setStockFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const blank = { nombre: '', marca: '', sku: '', categoria: '', precio: 0, stock: 0, stock_min: 3, caducidad: '', tipo: 'kbeauty' }
  const [form, setForm] = useState(blank)

  const load = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre')
    setProductos(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const filtered = productos
    .filter(p => p.tipo === tipo)
    .filter(p => catFilter === 'Todos' || p.categoria === catFilter)
    .filter(p => !q || p.nombre?.toLowerCase().includes(q.toLowerCase()) || p.marca?.toLowerCase().includes(q.toLowerCase()))
    .filter(p => {
      if (stockFilter === 'bajo') return p.stock <= p.stock_min
      if (stockFilter === 'vencer') return new Date(p.caducidad) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      return true
    })

  const save = async () => {
    if (!form.nombre) return
    if (edit) { await supabase.from('productos').update(form).eq('id', edit.id) }
    else { await supabase.from('productos').insert([form]) }
    setShowModal(false); setEdit(null); load()
  }

  const del = async id => { await supabase.from('productos').delete().eq('id', id); load() }

  const cats = tipo === 'kbeauty'
    ? ['Todos', 'Esencias & Sueros', 'Protección Solar', 'Mascarillas', 'Cuidado Íntimo', 'Cuerpo & Cabello']
    : ['Todos', 'Insumos médicos', 'Consumibles']

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventario</h1>
          <p className="page-sub">{productos.filter(p => p.tipo === 'kbeauty').length} productos · {productos.filter(p => p.tipo === 'insumo').length} insumos</p>
        </div>
        <button className="btn-primary" onClick={() => { setEdit(null); setForm({ ...blank, tipo }); setShowModal(true) }}><Icon name="plus" size={16} />Nuevo Producto</button>
      </div>
      <div className="tabs-row">
        {[['kbeauty', 'K-Beauty'], ['insumo', 'Insumos']].map(([v, l]) => (
          <button key={v} className={`tab-btn ${tipo === v ? 'active' : ''}`} onClick={() => { setTipo(v); setCatFilter('Todos') }}>{l} ({productos.filter(p => p.tipo === v).length})</button>
        ))}
      </div>
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <Icon name="search" size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        {cats.map(c => <button key={c} className={`chip ${catFilter === c ? 'active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>)}
        <button className={`chip chip-warn ${stockFilter === 'bajo' ? 'active' : ''}`} onClick={() => setStockFilter(s => s === 'bajo' ? '' : 'bajo')}>⚠ Stock bajo</button>
        <button className={`chip chip-danger ${stockFilter === 'vencer' ? 'active' : ''}`} onClick={() => setStockFilter(s => s === 'vencer' ? '' : 'vencer')}>🕐 Por vencer</button>
      </div>
      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="table">
          <thead><tr><th>Producto</th><th>Marca</th><th>SKU</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Caducidad</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(p => {
              const low = p.stock <= p.stock_min
              const exp = p.caducidad && new Date(p.caducidad) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              return (
                <tr key={p.id} className="table-row">
                  <td className="fw-bold">{p.nombre}</td>
                  <td>{p.marca}</td>
                  <td className="table-id">{p.sku}</td>
                  <td>{p.categoria}</td>
                  <td>{fmt(p.precio)}</td>
                  <td><span style={{ color: low ? '#e05252' : 'inherit', fontWeight: low ? 700 : 400 }}>{p.stock} uds {low && '⚠'}</span></td>
                  <td><span style={{ color: exp ? '#e89c20' : 'inherit' }}>{p.caducidad} {exp && '🕐'}</span></td>
                  <td>
                    <button className="btn-ghost-sm" onClick={() => { setEdit(p); setForm({ ...p }); setShowModal(true) }}><Icon name="edit" size={15} /></button>
                    <button className="btn-ghost-sm" onClick={() => del(p.id)}><Icon name="trash" size={15} /></button>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan={8} className="empty-cell">Sin productos</td></tr>}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title={edit ? 'Editar Producto' : 'Nuevo Producto'} onClose={() => { setShowModal(false); setEdit(null) }}>
          <div className="form-grid">
            <FI label="Nombre" required><input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></FI>
            <FI label="Marca"><input className="input" value={form.marca || ''} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} /></FI>
            <FI label="SKU"><input className="input" value={form.sku || ''} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} /></FI>
            <FI label="Categoría"><input className="input" value={form.categoria || ''} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} /></FI>
            <FI label="Precio"><input type="number" className="input" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: +e.target.value }))} /></FI>
            <FI label="Stock"><input type="number" className="input" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} /></FI>
            <FI label="Stock mínimo"><input type="number" className="input" value={form.stock_min} onChange={e => setForm(f => ({ ...f, stock_min: +e.target.value }))} /></FI>
            <FI label="Caducidad"><input type="date" className="input" value={form.caducidad || ''} onChange={e => setForm(f => ({ ...f, caducidad: e.target.value }))} /></FI>
            <FI label="Tipo">
              <select className="input" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="kbeauty">K-Beauty</option>
                <option value="insumo">Insumo médico</option>
              </select>
            </FI>
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => { setShowModal(false); setEdit(null) }}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICIOS
// ═══════════════════════════════════════════════════════════════════════════
const Servicios = () => {
  const [servicios, setServicios] = useState([])
  const [cat, setCat] = useState('Todos')
  const [showModal, setShowModal] = useState(false)
  const blank = { nombre: '', categoria: 'Facial', precio: 0, duracion: 60, descripcion: '' }
  const [form, setForm] = useState(blank)

  const load = async () => { const { data } = await supabase.from('servicios').select('*').order('nombre'); setServicios(data || []) }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.nombre) return
    await supabase.from('servicios').insert([form])
    setShowModal(false); load()
  }
  const del = async id => { await supabase.from('servicios').delete().eq('id', id); load() }

  const cats = ['Todos', 'Facial', 'Corporal', 'Capilar', 'Masaje', 'Aparatología', 'Tratamiento Médico']
  const filtered = servicios.filter(s => cat === 'Todos' || s.categoria === cat)

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Catálogo de Servicios</h1><p className="page-sub">{servicios.length} servicios</p></div>
        <button className="btn-primary" onClick={() => { setForm(blank); setShowModal(true) }}><Icon name="plus" size={16} />Nuevo Servicio</button>
      </div>
      <div className="filter-row">{cats.map(c => <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>)}</div>
      <div className="cards-grid">
        {filtered.map(s => (
          <div key={s.id} className="service-card">
            <div className="service-card-header">
              <span className="service-cat-badge">{s.categoria}</span>
              <div className="service-price">{fmt(s.precio)}</div>
            </div>
            <h3 className="service-name">{s.nombre}</h3>
            <p className="service-desc">{s.descripcion}</p>
            <div className="service-footer">
              <span className="service-duration">⏱ {s.duracion} min</span>
              <button className="btn-ghost-sm" onClick={() => del(s.id)}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <Modal title="Nuevo Servicio" onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <FI label="Nombre" required><input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></FI>
            <FI label="Categoría">
              <select className="input" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
                {['Facial', 'Corporal', 'Capilar', 'Masaje', 'Aparatología', 'Tratamiento Médico'].map(c => <option key={c}>{c}</option>)}
              </select>
            </FI>
            <FI label="Precio"><input type="number" className="input" value={form.precio} onChange={e => setForm(f => ({ ...f, precio: +e.target.value }))} /></FI>
            <FI label="Duración (min)"><input type="number" className="input" value={form.duracion} onChange={e => setForm(f => ({ ...f, duracion: +e.target.value }))} /></FI>
          </div>
          <FI label="Descripción"><textarea className="input" rows={3} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} /></FI>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar Servicio</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PUNTO DE VENTA
// ═══════════════════════════════════════════════════════════════════════════
const POS = () => {
  const [posTab, setPosTab] = useState('kbeauty')
  const [productos, setProductos] = useState([])
  const [servicios, setServicios] = useState([])
  const [clients, setClients] = useState([])
  const [staff, setStaff] = useState([])
  const [promos, setPromos] = useState([])
  const [q, setQ] = useState('')
  const [orden, setOrden] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [especialistaId, setEspecialistaId] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [promoApply, setPromoApply] = useState(null)
  const [descuento, setDescuento] = useState(0)
  const [metodo, setMetodo] = useState('Efectivo')
  const [folio, setFolio] = useState('')
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      const [{ data: p }, { data: s }, { data: c }, { data: st }, { data: pr }] = await Promise.all([
        supabase.from('productos').select('*').eq('tipo', 'kbeauty').gt('stock', 0),
        supabase.from('servicios').select('*'),
        supabase.from('clients').select('id,nombre').eq('activo', true),
        supabase.from('staff').select('id,nombre').eq('activo', true),
        supabase.from('promos').select('*').eq('activo', true),
      ])
      setProductos(p || []); setServicios(s || []); setClients(c || []); setStaff(st || []); setPromos(pr || [])
    }
    load()
  }, [])

  const items = posTab === 'kbeauty'
    ? productos.filter(p => !q || p.nombre?.toLowerCase().includes(q.toLowerCase()))
    : servicios.filter(s => !q || s.nombre?.toLowerCase().includes(q.toLowerCase()))

  const addItem = item => {
    const tipo = posTab === 'kbeauty' ? 'producto' : 'servicio'
    setOrden(o => {
      const ex = o.find(x => x.id === item.id && x.tipo === tipo)
      if (ex) return o.map(x => x.id === item.id && x.tipo === tipo ? { ...x, qty: x.qty + 1 } : x)
      return [...o, { id: item.id, nombre: item.nombre, precio: item.precio, tipo, qty: 1 }]
    })
  }

  const subtotal = orden.reduce((s, i) => s + i.precio * i.qty, 0)
  const promoDesc = promoApply ? (promoApply.tipo === 'porcentaje' ? subtotal * promoApply.valor / 100 : promoApply.valor) : 0
  const total = Math.max(0, subtotal - promoDesc - descuento)

  const applyPromo = () => {
    const p = promos.find(x => x.codigo === promoCode.toUpperCase())
    if (p) setPromoApply(p)
    else alert('Código no válido o inactivo')
  }

  const finalizar = async () => {
    if (orden.length === 0 || saving) return
    setSaving(true)
    const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true })
    const folioNum = 'F-' + String((count || 0) + 1).padStart(4, '0')
    const { data: ticket } = await supabase.from('tickets').insert([{
      folio: folioNum, cliente_id: clienteId || null, especialista_id: especialistaId || null,
      metodo_pago: metodo, descuento: promoDesc + descuento, total, fecha: today(), folio_tarjeta: folio
    }]).select().single()
    if (ticket) {
      await supabase.from('ticket_items').insert(orden.map(i => ({ ticket_id: ticket.id, tipo: i.tipo, ref_id: i.id, nombre: i.nombre, precio: i.precio, qty: i.qty })))
      // Actualizar stock
      for (const item of orden.filter(i => i.tipo === 'producto')) {
        const prod = productos.find(p => p.id === item.id)
        if (prod) await supabase.from('productos').update({ stock: prod.stock - item.qty }).eq('id', item.id)
      }
    }
    setSaving(false)
    setOrden([]); setClienteId(''); setPromoCode(''); setPromoApply(null); setDescuento(0); setFolio('')
    setSuccess(true); setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="pos-layout">
      <div className="pos-left">
        <div className="page-header" style={{ paddingBottom: 16 }}><h1 className="page-title">Punto de Venta</h1></div>
        <div className="tabs-row">
          {[['kbeauty', 'K-Beauty'], ['servicio', 'Servicios']].map(([v, l]) => (
            <button key={v} className={`tab-btn ${posTab === v ? 'active' : ''}`} onClick={() => { setPosTab(v); setQ('') }}>{l}</button>
          ))}
        </div>
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <Icon name="search" size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <div className="pos-grid">
          {items.map(item => (
            <div key={item.id} className="pos-item" onClick={() => addItem(item)}>
              <div className="pos-item-name">{item.nombre}</div>
              {item.marca && <div className="pos-item-brand">{item.marca}</div>}
              <div className="pos-item-price">{fmt(item.precio)}</div>
              {item.stock !== undefined && <div className="pos-item-stock">{item.stock} en stock</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="pos-right">
        <div className="pos-order-header">
          <span className="pos-order-title">Orden</span>
          <span className="pos-order-count">{orden.reduce((s, i) => s + i.qty, 0)} items</span>
        </div>
        <select className="input" value={clienteId} onChange={e => setClienteId(e.target.value)}>
          <option value="">Cliente (opcional)...</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <select className="input" value={especialistaId} onChange={e => setEspecialistaId(e.target.value)}>
          <option value="">Especialista (opcional)</option>
          {staff.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
        </select>
        <div className="pos-items-list">
          {orden.length === 0 && <p className="empty-text" style={{ textAlign: 'center', padding: '20px 0' }}>Selecciona productos o servicios</p>}
          {orden.map((item, i) => (
            <div key={i} className="pos-order-item">
              <div className="pos-order-item-info">
                <div className="pos-order-item-name">{item.nombre}</div>
                <div className="pos-order-item-price">{fmt(item.precio)}</div>
              </div>
              <div className="pos-order-item-controls">
                <button className="qty-btn" onClick={() => setOrden(o => o.map((x, j) => j === i ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>−</button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => setOrden(o => o.map((x, j) => j === i ? { ...x, qty: x.qty + 1 } : x))}>+</button>
                <button className="qty-btn" style={{ color: '#e05252' }} onClick={() => setOrden(o => o.filter((_, j) => j !== i))}>×</button>
              </div>
            </div>
          ))}
        </div>
        <div className="pos-promo-row">
          <input className="input" style={{ flex: 1 }} placeholder="Código promo..." value={promoCode} onChange={e => setPromoCode(e.target.value)} />
          <button className="btn-secondary" onClick={applyPromo}>Aplicar</button>
        </div>
        {promoApply && <div className="promo-badge">✓ {promoApply.codigo} − {promoApply.tipo === 'porcentaje' ? `${promoApply.valor}%` : fmt(promoApply.valor)}</div>}
        <div className="pos-discount-row">
          <label className="form-label">Descuento directo ($)</label>
          <input type="number" className="input" value={descuento} onChange={e => setDescuento(+e.target.value)} />
        </div>
        <div className="pos-total-row"><span>Total</span><span className="pos-total-amount">{fmt(total)}</span></div>
        <select className="input" value={metodo} onChange={e => setMetodo(e.target.value)}>
          {['Efectivo', 'Tarjeta', 'Transferencia', 'Crédito', 'Mixto'].map(m => <option key={m}>{m}</option>)}
        </select>
        {metodo === 'Tarjeta' && <input className="input" placeholder="Folio tarjeta..." value={folio} onChange={e => setFolio(e.target.value)} />}
        {success && <div className="success-banner">✓ Venta registrada</div>}
        <button className="btn-primary" style={{ width: '100%', padding: 14, fontSize: '1rem' }} onClick={finalizar} disabled={saving}>
          {saving ? 'Procesando...' : 'Finalizar Venta'}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// TICKETS
// ═══════════════════════════════════════════════════════════════════════════
const Tickets = () => {
  const [tickets, setTickets] = useState([])
  const [metodo, setMetodo] = useState('Todos')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('tickets').select('*, clients(nombre), ticket_items(*)').order('created_at', { ascending: false })
      setTickets(data || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = tickets.filter(t => {
    if (metodo !== 'Todos' && t.metodo_pago !== metodo) return false
    if (q && !t.folio?.includes(q) && !t.clients?.nombre?.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Tickets de Venta</h1><p className="page-sub">{filtered.length} tickets · Total: {fmt(filtered.reduce((s, t) => s + t.total, 0))}</p></div>
      </div>
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <Icon name="search" size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar folio o cliente..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        {['Todos', 'Efectivo', 'Tarjeta', 'Transferencia', 'Crédito', 'Mixto'].map(m => (
          <button key={m} className={`chip ${metodo === m ? 'active' : ''}`} onClick={() => setMetodo(m)}>{m}</button>
        ))}
      </div>
      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="table">
          <thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Items</th><th>Método</th><th>Total</th></tr></thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} className="table-row">
                <td className="table-id">{t.folio}</td>
                <td>{t.fecha}</td>
                <td>{t.clients?.nombre || '—'}</td>
                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.ticket_items?.map(i => i.nombre).join(', ')}</td>
                <td><span className="badge" style={{ background: '#c9a87c22', color: '#c9a87c' }}>{t.metodo_pago}</span></td>
                <td className="fw-bold">{fmt(t.total)}</td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="empty-cell">Sin tickets</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// STAFF MÉDICO
// ═══════════════════════════════════════════════════════════════════════════
const Staff = () => {
  const [staff, setStaff] = useState([])
  const [staffTab, setStaffTab] = useState('especialistas')
  const [showModal, setShowModal] = useState(false)
  const blank = { nombre: '', especialidad: '', comision: 20, activo: true }
  const [form, setForm] = useState(blank)

  const load = async () => { const { data } = await supabase.from('staff').select('*').order('nombre'); setStaff(data || []) }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.nombre) return
    await supabase.from('staff').insert([form])
    setShowModal(false); load()
  }
  const del = async id => { await supabase.from('staff').delete().eq('id', id); load() }

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Área Médica & Staff</h1><p className="page-sub">{staff.length} especialistas</p></div>
        <button className="btn-primary" onClick={() => { setForm(blank); setShowModal(true) }}><Icon name="plus" size={16} />Nuevo Especialista</button>
      </div>
      <div className="tabs-row">
        {[['especialistas', 'Especialistas'], ['comisiones', 'Comisiones']].map(([v, l]) => (
          <button key={v} className={`tab-btn ${staffTab === v ? 'active' : ''}`} onClick={() => setStaffTab(v)}>{l}</button>
        ))}
      </div>
      {staffTab === 'especialistas' && (
        <div className="cards-grid">
          {staff.map(e => (
            <div key={e.id} className="staff-card">
              <div className="staff-avatar">{e.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
              <h3 className="staff-name">{e.nombre}</h3>
              <p className="staff-role">{e.especialidad}</p>
              <div className="staff-comision">Comisión: <strong>{e.comision}%</strong></div>
              <button className="btn-ghost-sm" onClick={() => del(e.id)}><Icon name="trash" size={14} /></button>
            </div>
          ))}
        </div>
      )}
      {staffTab === 'comisiones' && (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Especialista</th><th>Especialidad</th><th>Comisión %</th></tr></thead>
            <tbody>
              {staff.map(e => <tr key={e.id} className="table-row"><td className="fw-bold">{e.nombre}</td><td>{e.especialidad}</td><td>{e.comision}%</td></tr>)}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <Modal title="Nuevo Especialista" onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <FI label="Nombre" required><input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></FI>
            <FI label="Especialidad">
              <select className="input" value={form.especialidad} onChange={e => setForm(f => ({ ...f, especialidad: e.target.value }))}>
                <option value="">Seleccionar...</option>
                {['Médico Estético', 'Dermatólogo', 'Esteticista', 'Enfermera', 'Técnico en Láser', 'Masajista'].map(s => <option key={s}>{s}</option>)}
              </select>
            </FI>
            <FI label="Comisión (%)"><input type="number" className="input" value={form.comision} onChange={e => setForm(f => ({ ...f, comision: +e.target.value }))} /></FI>
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CRÉDITOS
// ═══════════════════════════════════════════════════════════════════════════
const Creditos = () => {
  const [clients, setClients] = useState([])
  const [filter, setFilter] = useState('Todos')
  const [q, setQ] = useState('')

  const load = async () => { const { data } = await supabase.from('clients').select('*').order('nombre'); setClients(data || []) }
  useEffect(() => { load() }, [])

  const update = async (id, field, val) => {
    await supabase.from('clients').update({ [field]: +val }).eq('id', id)
    setClients(cs => cs.map(c => c.id === id ? { ...c, [field]: +val } : c))
  }

  const filtered = clients.filter(c => {
    if (!c.nombre?.toLowerCase().includes(q.toLowerCase())) return false
    if (filter === 'Con deuda') return c.deuda > 0
    if (filter === 'Con crédito') return c.credito > 0
    if (filter === 'Al corriente') return c.deuda === 0
    return true
  })

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Créditos de Clientes</h1><p className="page-sub">{clients.filter(c => c.deuda > 0).length} con adeudo</p></div>
      </div>
      <div className="stats-grid" style={{ gridTemplateColumns: '1fr 1fr', maxWidth: 500 }}>
        <StatCard icon="dollar" label="Total en deuda" value={fmt(clients.reduce((s, c) => s + (c.deuda || 0), 0))} color="#e05252" />
        <StatCard icon="credits" label="Clientes con adeudo" value={clients.filter(c => c.deuda > 0).length} color="#e89c20" />
      </div>
      <div className="filter-row">
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <Icon name="search" size={16} className="search-icon" />
          <input className="search-input" placeholder="Buscar cliente..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
        {['Con deuda', 'Con crédito', 'Al corriente', 'Todos'].map(f => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="table-wrap" style={{ marginTop: 16 }}>
        <table className="table">
          <thead><tr><th>Cliente</th><th>Teléfono</th><th>Límite Crédito ($)</th><th>Deuda ($)</th><th>Estado</th><th>Acción</th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="table-row">
                <td className="fw-bold">{c.nombre}</td>
                <td>{c.telefono}</td>
                <td><input type="number" className="input" style={{ width: 100, padding: '4px 8px' }} defaultValue={c.credito || 0} onBlur={e => update(c.id, 'credito', e.target.value)} /></td>
                <td><input type="number" className="input" style={{ width: 100, padding: '4px 8px', color: (c.deuda || 0) > 0 ? '#e05252' : 'inherit' }} defaultValue={c.deuda || 0} onBlur={e => update(c.id, 'deuda', e.target.value)} /></td>
                <td><span className="badge" style={{ background: c.deuda > 0 ? '#e0525222' : '#2d9e6b22', color: c.deuda > 0 ? '#e05252' : '#2d9e6b' }}>{c.deuda > 0 ? 'Con deuda' : 'Al corriente'}</span></td>
                <td><button className="btn-ghost-sm" title="Saldar" onClick={() => update(c.id, 'deuda', 0)}><Icon name="check" size={15} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// PROMOCIONES
// ═══════════════════════════════════════════════════════════════════════════
const Promociones = () => {
  const [promos, setPromos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const blank = { codigo: '', tipo: 'porcentaje', valor: 10, activo: true, expira: '', descripcion: '' }
  const [form, setForm] = useState(blank)

  const load = async () => { const { data } = await supabase.from('promos').select('*').order('created_at', { ascending: false }); setPromos(data || []) }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.codigo) return
    await supabase.from('promos').insert([{ ...form, codigo: form.codigo.toUpperCase(), usos: 0 }])
    setShowModal(false); load()
  }
  const toggle = async (id, val) => { await supabase.from('promos').update({ activo: !val }).eq('id', id); load() }
  const del = async id => { await supabase.from('promos').delete().eq('id', id); load() }

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Códigos Promocionales</h1><p className="page-sub">{promos.filter(p => p.activo).length} activos</p></div>
        <button className="btn-primary" onClick={() => { setForm(blank); setShowModal(true) }}><Icon name="plus" size={16} />Nueva Promoción</button>
      </div>
      <div className="cards-grid">
        {promos.map(p => (
          <div key={p.id} className={`promo-card ${!p.activo ? 'inactive' : ''}`}>
            <div className="promo-card-header">
              <span className="promo-code">{p.codigo}</span>
              <span className="promo-value">{p.tipo === 'porcentaje' ? `${p.valor}%` : fmt(p.valor)}</span>
            </div>
            <p className="promo-desc">{p.descripcion}</p>
            <div className="promo-footer">
              <span>Vence: {p.expira || 'Sin fecha'}</span>
              <button className={`chip ${p.activo ? 'active' : ''}`} onClick={() => toggle(p.id, p.activo)}>{p.activo ? 'Activo' : 'Inactivo'}</button>
              <button className="btn-ghost-sm" onClick={() => del(p.id)}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
        {promos.length === 0 && <div className="empty-state"><p>No hay promociones creadas</p></div>}
      </div>
      {showModal && (
        <Modal title="Nueva Promoción" onClose={() => setShowModal(false)}>
          <div className="form-grid">
            <FI label="Código" required><input className="input" value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value.toUpperCase() }))} placeholder="BIENVENIDA20" /></FI>
            <FI label="Tipo">
              <select className="input" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}>
                <option value="porcentaje">Porcentaje (%)</option>
                <option value="monto">Monto fijo ($)</option>
              </select>
            </FI>
            <FI label="Valor"><input type="number" className="input" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: +e.target.value }))} /></FI>
            <FI label="Expira"><input type="date" className="input" value={form.expira} onChange={e => setForm(f => ({ ...f, expira: e.target.value }))} /></FI>
          </div>
          <FI label="Descripción"><input className="input" value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} /></FI>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CAMPAÑAS
// ═══════════════════════════════════════════════════════════════════════════
const Campanas = () => {
  const [campanas, setCampanas] = useState([])
  const [clients, setClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [sendModal, setSendModal] = useState(null)
  const [selClients, setSelClients] = useState([])
  const blank = { nombre: '', plantilla: '' }
  const [form, setForm] = useState(blank)

  useEffect(() => {
    const load = async () => {
      const [{ data: c }, { data: cl }] = await Promise.all([
        supabase.from('campanas').select('*').order('created_at', { ascending: false }),
        supabase.from('clients').select('id,nombre,telefono').eq('activo', true),
      ])
      setCampanas(c || []); setClients(cl || [])
    }
    load()
  }, [])

  const save = async () => {
    if (!form.nombre || !form.plantilla) return
    const vars = (form.plantilla.match(/\{[^}]+\}/g) || [])
    await supabase.from('campanas').insert([{ ...form, variables: vars }])
    setShowModal(false)
    const { data } = await supabase.from('campanas').select('*').order('created_at', { ascending: false })
    setCampanas(data || [])
  }

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Plantillas de Campaña</h1><p className="page-sub">{campanas.length} plantillas</p></div>
        <button className="btn-primary" onClick={() => { setForm(blank); setShowModal(true) }}><Icon name="plus" size={16} />Nueva Plantilla</button>
      </div>
      <div className="info-card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: '0.85rem', color: '#888' }}>💡 Usa variables como <code style={{ background: '#f5f0e8', padding: '1px 6px', borderRadius: 4 }}>{'{nombre}'}</code>, <code style={{ background: '#f5f0e8', padding: '1px 6px', borderRadius: 4 }}>{'{fecha}'}</code>, <code style={{ background: '#f5f0e8', padding: '1px 6px', borderRadius: 4 }}>{'{servicio}'}</code> que se reemplazan automáticamente al enviar.</p>
      </div>
      <div className="cards-grid">
        {campanas.map(c => (
          <div key={c.id} className="campana-card">
            <h3 className="campana-nombre">{c.nombre}</h3>
            <p className="campana-plantilla">{c.plantilla}</p>
            <div className="campana-vars">{c.variables?.map(v => <span key={v} className="var-tag">{v}</span>)}</div>
            <div className="campana-actions">
              <button className="btn-secondary" onClick={() => { setSendModal(c); setSelClients([]) }}>📤 Enviar</button>
              <button className="btn-ghost-sm" onClick={async () => { await supabase.from('campanas').delete().eq('id', c.id); setCampanas(cs => cs.filter(x => x.id !== c.id)) }}><Icon name="trash" size={14} /></button>
            </div>
          </div>
        ))}
        {campanas.length === 0 && <div className="empty-state"><p>Crea tu primera plantilla</p></div>}
      </div>
      {showModal && (
        <Modal title="Nueva Plantilla" onClose={() => setShowModal(false)} wide>
          <FI label="Nombre" required><input className="input" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></FI>
          <FI label="Mensaje (usa {nombre}, {fecha}, {hora}, {servicio})">
            <textarea className="input" rows={5} value={form.plantilla} onChange={e => setForm(f => ({ ...f, plantilla: e.target.value }))} placeholder="Hola {nombre}, te esperamos el {fecha}..." />
          </FI>
          {form.plantilla && (
            <div className="preview-box">
              <strong>Preview:</strong>
              <p>{form.plantilla.replace(/\{nombre\}/g, 'María').replace(/\{fecha\}/g, '15/03/2026').replace(/\{hora\}/g, '10:00').replace(/\{servicio\}/g, 'Hydrafacial')}</p>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={save}>Guardar</button>
          </div>
        </Modal>
      )}
      {sendModal && (
        <Modal title={`Enviar: ${sendModal.nombre}`} onClose={() => setSendModal(null)} wide>
          <p style={{ marginBottom: 12, color: '#888', fontSize: '0.85rem' }}>Selecciona las clientes que recibirán este mensaje:</p>
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {clients.map(c => (
              <label key={c.id} className="checkbox-row">
                <input type="checkbox" checked={selClients.includes(c.id)} onChange={() => setSelClients(s => s.includes(c.id) ? s.filter(x => x !== c.id) : [...s, c.id])} />
                <span>{c.nombre} — {c.telefono}</span>
              </label>
            ))}
          </div>
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setSendModal(null)}>Cancelar</button>
            <button className="btn-primary" onClick={() => { alert(`✓ Enviado a ${selClients.length} cliente(s)`); setSendModal(null) }}>Enviar a {selClients.length}</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// REPORTES
// ═══════════════════════════════════════════════════════════════════════════
const Reportes = () => {
  const [tickets, setTickets] = useState([])
  const [staff, setStaff] = useState([])
  const [period, setPeriod] = useState('Mes')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [{ data: t }, { data: s }] = await Promise.all([
        supabase.from('tickets').select('*, ticket_items(*)'),
        supabase.from('staff').select('*'),
      ])
      setTickets(t || [])
      setStaff(s || [])
      setLoading(false)
    }
    load()
  }, [])

  const totalIngresos = tickets.reduce((s, t) => s + (t.total || 0), 0)
  const ticketProm = tickets.length ? totalIngresos / tickets.length : 0
  const ingrServs = tickets.reduce((s, t) => s + (t.ticket_items?.filter(i => i.tipo === 'servicio').reduce((a, b) => a + b.precio * b.qty, 0) || 0), 0)
  const ingrProds = tickets.reduce((s, t) => s + (t.ticket_items?.filter(i => i.tipo === 'producto').reduce((a, b) => a + b.precio * b.qty, 0) || 0), 0)

  const comisiones = staff.map(e => {
    const ventas = tickets.filter(t => t.especialista_id === e.id).reduce((s, t) => s + (t.total || 0), 0)
    return { ...e, ventas, comision: ventas * (e.comision / 100) }
  })
  const maxVentas = Math.max(...comisiones.map(e => e.ventas), 1)

  if (loading) return <div className="page"><Spinner /></div>

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Reportes</h1><p className="page-sub">Análisis de negocio</p></div>
        <div className="btn-group">
          {['Hoy', 'Semana', 'Mes', 'Trimestre'].map(p => (
            <button key={p} className={`btn-period ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>
      <div className="stats-grid">
        <StatCard icon="dollar" label="Ingresos Totales" value={fmt(totalIngresos)} color="#2d9e6b" />
        <StatCard icon="tickets" label="Ticket Promedio" value={fmt(ticketProm)} sub={`${tickets.length} ventas`} color="#5b8dee" />
        <StatCard icon="services" label="Servicios" value={fmt(ingrServs)} sub={`${totalIngresos ? Math.round(ingrServs / totalIngresos * 100) : 0}% del total`} color="#c9a87c" />
        <StatCard icon="inventory" label="K-Beauty" value={fmt(ingrProds)} sub={`${totalIngresos ? Math.round(ingrProds / totalIngresos * 100) : 0}% del total`} color="#9b59b6" />
      </div>
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Comisiones por Especialista</h3>
          <span style={{ fontSize: '0.8rem', color: '#2d9e6b', fontWeight: 600 }}>Total: {fmt(comisiones.reduce((s, e) => s + e.comision, 0))}</span>
        </div>
        {comisiones.length === 0
          ? <p className="empty-text">Sin datos</p>
          : comisiones.map(e => (
            <div key={e.id} className="comision-row">
              <span className="comision-name">{e.nombre}</span>
              <div className="comision-bar-wrap"><div className="comision-bar" style={{ width: `${(e.ventas / maxVentas) * 100}%` }} /></div>
              <span className="comision-val">{fmt(e.comision)}</span>
            </div>
          ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// GESTIÓN DE USUARIOS (solo admin)
// ═══════════════════════════════════════════════════════════════════════════
const Usuarios = ({ profile }) => {
  const [users, setUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', nombre: '', rol: 'recepcionista' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const load = async () => { const { data } = await supabase.from('profiles').select('*').order('nombre'); setUsers(data || []) }
  useEffect(() => { load() }, [])

  const createUser = async () => {
    if (!form.email || !form.password) return
    setSaving(true)
    setMsg('')
    const { data, error } = await supabase.auth.admin?.createUser
      ? await supabase.auth.admin.createUser({ email: form.email, password: form.password, email_confirm: true })
      : { data: null, error: { message: 'Necesitas crear usuarios desde el panel de Supabase → Authentication → Users' } }
    if (error) { setMsg('ℹ️ Para crear usuarios ve a Supabase → Authentication → Add user') }
    else { setMsg('✓ Usuario creado') }
    setSaving(false)
  }

  const updateRol = async (id, rol) => {
    await supabase.from('profiles').update({ rol }).eq('id', id)
    load()
  }

  if (profile?.rol !== 'admin') return (
    <div className="page"><div className="info-card"><p>Solo los administradores pueden gestionar usuarios.</p></div></div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Gestión de Usuarios</h1><p className="page-sub">{users.length} usuarios registrados</p></div>
        <button className="btn-primary" onClick={() => setShowModal(true)}><Icon name="plus" size={16} />Nuevo Usuario</button>
      </div>
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Email</th><th>Nombre</th><th>Rol</th><th>Estado</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="table-row">
                <td>{u.email}</td>
                <td className="fw-bold">{u.nombre}</td>
                <td>
                  <select className="input" style={{ padding: '4px 8px', width: 'auto' }} value={u.rol || 'recepcionista'} onChange={e => updateRol(u.id, e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="recepcionista">Recepcionista</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </td>
                <td><span className="badge" style={{ background: '#2d9e6b22', color: '#2d9e6b' }}>Activo</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <Modal title="Nuevo Usuario" onClose={() => setShowModal(false)}>
          <div className="info-card" style={{ background: '#5b8dee11', border: '1px solid #5b8dee33', marginBottom: 16 }}>
            <p style={{ fontSize: '0.82rem', color: '#5b8dee' }}>
              <strong>📌 Para crear usuarios:</strong><br />
              Ve a tu panel de Supabase → Authentication → Users → Add User<br />
              Después aquí puedes cambiarles el rol.
            </p>
          </div>
          <FI label="Rol">
            <select className="input" value={form.rol} onChange={e => setForm(f => ({ ...f, rol: e.target.value }))}>
              <option value="admin">Admin (acceso total)</option>
              <option value="recepcionista">Recepcionista (agenda, clientes, POS)</option>
              <option value="especialista">Especialista (solo su agenda)</option>
            </select>
          </FI>
          {msg && <div className={`${msg.startsWith('✓') ? 'success-banner' : 'error-msg'}`}>{msg}</div>}
          <div className="modal-actions">
            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('Dashboard')
  const [sideOpen, setSideOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) loadProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })
    return () => subscription.unsubscribe()
  }, [])

  const loadProfile = async (uid) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
    setProfile(data)
    setLoading(false)
  }

  const logout = () => supabase.auth.signOut()

  // Menú según rol
  const allNav = [
    { id: 'Dashboard', icon: 'dashboard', roles: ['admin', 'recepcionista', 'especialista'] },
    { id: 'Agenda', icon: 'agenda', roles: ['admin', 'recepcionista', 'especialista'] },
    { id: 'Clientes', icon: 'clients', roles: ['admin', 'recepcionista'] },
    { id: 'Inventario', icon: 'inventory', roles: ['admin', 'recepcionista'] },
    { id: 'Servicios', icon: 'services', roles: ['admin', 'recepcionista'] },
    { id: 'Punto de Venta', icon: 'pos', roles: ['admin', 'recepcionista'] },
    { id: 'Tickets', icon: 'tickets', roles: ['admin', 'recepcionista'] },
    { id: 'Créditos', icon: 'credits', roles: ['admin'] },
    { id: 'Staff Médico', icon: 'staff', roles: ['admin'] },
    { id: 'Promociones', icon: 'promos', roles: ['admin'] },
    { id: 'Campañas', icon: 'campaigns', roles: ['admin'] },
    { id: 'Reportes', icon: 'reports', roles: ['admin'] },
    { id: 'Usuarios', icon: 'users', roles: ['admin'] },
  ]

  const nav = allNav.filter(n => n.roles.includes(profile?.rol || 'recepcionista'))

  const pages = {
    Dashboard, Agenda, Clientes, Inventario, Servicios,
    'Punto de Venta': POS, Tickets, Créditos: Creditos,
    'Staff Médico': Staff, Promociones, Campañas: Campanas,
    Reportes, Usuarios: () => <Usuarios profile={profile} />
  }
  const PageComp = pages[page] || Dashboard

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f7f4ef' }}>
      <div className="spinner" />
    </div>
  )

  if (!session) return <LoginScreen />

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #f7f4ef; --sidebar-bg: #1a1612; --card: #ffffff; --border: #e8e2d8;
          --text: #2a2118; --text-muted: #8a7d6b; --accent: #c9a87c; --accent-dark: #a8895e;
          --green: #2d9e6b; --blue: #5b8dee; --red: #e05252; --yellow: #e89c20;
          --radius: 12px; --shadow: 0 2px 12px rgba(0,0,0,0.06); --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
        }
        body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; }
        .app { display: flex; height: 100vh; overflow: hidden; }

        /* LOGIN */
        .login-screen { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg); padding: 20px; }
        .login-card { background: var(--card); border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: var(--shadow-lg); border: 1px solid var(--border); }
        .login-logo { text-align: center; margin-bottom: 32px; }
        .login-brand { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 500; color: var(--text); }
        .login-sub { font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-top: 4px; }
        .error-msg { background: #e0525218; color: var(--red); border: 1px solid #e0525230; border-radius: 8px; padding: 10px 14px; font-size: 0.85rem; margin-top: 10px; }

        /* SIDEBAR */
        .sidebar { width: ${sideOpen ? '230px' : '64px'}; background: var(--sidebar-bg); display: flex; flex-direction: column; transition: width 0.25s ease; overflow: hidden; flex-shrink: 0; }
        .sidebar-logo { padding: 20px 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .logo-text { color: #f0e8d8; font-family: 'Cormorant Garamond', serif; font-size: 1.35rem; font-weight: 500; white-space: nowrap; opacity: ${sideOpen ? 1 : 0}; transition: opacity 0.2s; }
        .logo-sub { color: #c8b99a; font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; display: block; white-space: nowrap; opacity: ${sideOpen ? 1 : 0}; transition: opacity 0.2s; }
        .sidebar-toggle { margin-left: auto; background: none; border: none; cursor: pointer; color: #c8b99a; padding: 4px; border-radius: 6px; display: flex; flex-shrink: 0; }
        .sidebar-toggle:hover { color: #fff; }
        .sidebar-nav { padding: 10px 8px; flex: 1; overflow-y: auto; }
        .nav-item { display: flex; align-items: center; gap: 12px; padding: 8px 12px; border-radius: 8px; cursor: pointer; color: #c8b99a; transition: all 0.15s; margin-bottom: 1px; border: none; background: none; width: 100%; text-align: left; font-family: 'DM Sans'; font-size: 0.855rem; white-space: nowrap; }
        .nav-item:hover { background: rgba(255,255,255,0.06); color: #f0e8d8; }
        .nav-item.active { background: rgba(201,168,124,0.15); color: var(--accent); font-weight: 500; }
        .nav-label { opacity: ${sideOpen ? 1 : 0}; transition: opacity 0.2s; }
        .sidebar-user { padding: 12px 12px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; gap: 10px; }
        .user-info { flex: 1; min-width: 0; opacity: ${sideOpen ? 1 : 0}; transition: opacity 0.2s; }
        .user-name { color: #f0e8d8; font-size: 0.8rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .user-role { color: #c8b99a; font-size: 0.68rem; text-transform: capitalize; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--accent); color: #fff; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .logout-btn { background: none; border: none; cursor: pointer; color: #c8b99a; padding: 4px; border-radius: 6px; display: flex; flex-shrink: 0; }
        .logout-btn:hover { color: var(--red); }

        /* MAIN */
        .main { flex: 1; overflow-y: auto; background: var(--bg); }
        .main::-webkit-scrollbar { width: 6px; }
        .main::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

        /* POS */
        .pos-layout { display: flex; height: 100%; }
        .pos-left { flex: 1; overflow-y: auto; padding: 28px; }
        .pos-right { width: 340px; background: var(--card); border-left: 1px solid var(--border); padding: 20px; display: flex; flex-direction: column; gap: 8px; overflow-y: auto; }

        /* PAGE */
        .page { padding: 28px 32px; max-width: 1400px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
        .page-title { font-family: 'Cormorant Garamond', serif; font-size: 2rem; font-weight: 500; line-height: 1.2; }
        .page-sub { color: var(--text-muted); font-size: 0.85rem; margin-top: 2px; }

        /* STATS */
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .stat-card { background: var(--card); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); }
        .stat-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .stat-trend { font-size: 0.75rem; color: var(--green); font-weight: 600; background: #2d9e6b18; padding: 2px 8px; border-radius: 20px; }
        .stat-value { font-size: 1.8rem; font-weight: 600; line-height: 1; }
        .stat-label { font-size: 0.8rem; color: var(--text-muted); margin-top: 4px; }
        .stat-sub { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

        /* CARDS */
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
        .info-card { background: var(--card); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); }
        .info-card-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 12px; }
        .chart-card { background: var(--card); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); margin-bottom: 20px; }
        .chart-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 16px; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }

        /* CALENDAR */
        .calendar-grid { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
        .cal-header-row { display: flex; border-bottom: 1px solid var(--border); background: var(--bg); }
        .cal-time-gutter { width: 64px; flex-shrink: 0; }
        .cal-day-col-header { flex: 1; padding: 10px 16px; font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em; color: var(--text-muted); }
        .cal-row { display: flex; border-bottom: 1px solid var(--border); min-height: 64px; }
        .cal-row:last-child { border-bottom: none; }
        .cal-time { width: 64px; flex-shrink: 0; padding: 10px 12px 10px 10px; font-size: 0.72rem; color: var(--text-muted); text-align: right; }
        .cal-cell { flex: 1; border-left: 1px solid var(--border); padding: 4px; display: flex; flex-direction: column; gap: 4px; }
        .cal-event { background: var(--bg); border-left: 3px solid var(--accent); padding: 8px 10px; border-radius: 0 8px 8px 0; font-size: 0.8rem; }
        .cal-event-time { font-size: 0.7rem; color: var(--text-muted); margin-bottom: 2px; }
        .cal-event-name { font-weight: 600; }
        .cal-event-service { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 6px; }
        .cal-event-footer { display: flex; justify-content: space-between; align-items: center; }

        /* CITA MINI */
        .cita-mini { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid var(--border); }
        .cita-hora { font-size: 0.8rem; font-weight: 700; color: var(--accent); width: 40px; flex-shrink: 0; }
        .cita-nombre { font-size: 0.85rem; font-weight: 600; }
        .cita-servicio { font-size: 0.75rem; color: var(--text-muted); }

        /* COMISIONES */
        .comision-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; }
        .comision-name { font-size: 0.82rem; width: 160px; flex-shrink: 0; }
        .comision-bar-wrap { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
        .comision-bar { height: 100%; background: var(--accent); border-radius: 4px; }
        .comision-val { font-size: 0.82rem; font-weight: 600; color: var(--green); width: 80px; text-align: right; }

        /* SERVICE CARDS */
        .service-card { background: var(--card); border-radius: var(--radius); padding: 18px; border: 1px solid var(--border); }
        .service-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .service-cat-badge { font-size: 0.7rem; background: #c9a87c22; color: var(--accent); padding: 2px 10px; border-radius: 20px; font-weight: 500; }
        .service-price { font-weight: 700; font-size: 1.1rem; color: var(--accent); }
        .service-name { font-weight: 600; margin-bottom: 6px; }
        .service-desc { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
        .service-footer { display: flex; justify-content: space-between; align-items: center; }
        .service-duration { font-size: 0.78rem; color: var(--text-muted); }

        /* STAFF CARDS */
        .staff-card { background: var(--card); border-radius: var(--radius); padding: 20px; border: 1px solid var(--border); text-align: center; }
        .staff-avatar { width: 52px; height: 52px; border-radius: 50%; background: var(--accent); color: white; font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .staff-name { font-weight: 600; margin-bottom: 4px; }
        .staff-role { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px; }
        .staff-comision { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 10px; }

        /* PROMO CARDS */
        .promo-card { background: var(--card); border-radius: var(--radius); padding: 18px; border: 1px solid var(--border); }
        .promo-card.inactive { opacity: 0.6; }
        .promo-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .promo-code { font-family: monospace; font-weight: 700; font-size: 1rem; letter-spacing: 0.05em; }
        .promo-value { font-size: 1.3rem; font-weight: 700; color: var(--accent); }
        .promo-desc { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 12px; }
        .promo-footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 0.75rem; color: var(--text-muted); }
        .promo-badge { font-size: 0.78rem; background: #2d9e6b22; color: var(--green); padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 4px; }

        /* CAMPANA CARDS */
        .campana-card { background: var(--card); border-radius: var(--radius); padding: 18px; border: 1px solid var(--border); }
        .campana-nombre { font-weight: 600; margin-bottom: 8px; }
        .campana-plantilla { font-size: 0.82rem; color: var(--text-muted); margin-bottom: 12px; line-height: 1.5; }
        .campana-vars { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .var-tag { font-size: 0.72rem; background: #5b8dee22; color: var(--blue); padding: 2px 8px; border-radius: 10px; font-family: monospace; }
        .campana-actions { display: flex; gap: 8px; }
        .preview-box { background: var(--bg); border-left: 3px solid var(--accent); padding: 12px 16px; border-radius: 0 8px 8px 0; margin-top: 12px; font-size: 0.85rem; }
        .preview-box strong { display: block; margin-bottom: 4px; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); }

        /* POS */
        .pos-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(155px, 1fr)); gap: 12px; }
        .pos-item { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; cursor: pointer; transition: all 0.15s; }
        .pos-item:hover { border-color: var(--accent); transform: translateY(-1px); }
        .pos-item-name { font-weight: 600; font-size: 0.875rem; margin-bottom: 4px; }
        .pos-item-brand { font-size: 0.75rem; color: var(--text-muted); }
        .pos-item-price { font-size: 1rem; font-weight: 700; color: var(--accent); margin-top: 8px; }
        .pos-item-stock { font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; }
        .pos-order-header { display: flex; align-items: center; gap: 8px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .pos-order-title { font-weight: 600; flex: 1; }
        .pos-order-count { font-size: 0.78rem; background: var(--bg); padding: 2px 10px; border-radius: 20px; color: var(--text-muted); }
        .pos-items-list { flex: 1; overflow-y: auto; }
        .pos-order-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); gap: 8px; }
        .pos-order-item-info { flex: 1; min-width: 0; }
        .pos-order-item-name { font-size: 0.82rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pos-order-item-price { font-size: 0.78rem; color: var(--text-muted); }
        .pos-order-item-controls { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .qty-btn { width: 26px; height: 26px; border: 1px solid var(--border); background: var(--bg); border-radius: 6px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; }
        .qty-val { font-size: 0.875rem; font-weight: 600; width: 24px; text-align: center; }
        .pos-promo-row { display: flex; gap: 8px; }
        .pos-discount-row { display: flex; flex-direction: column; gap: 4px; }
        .pos-total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--border); font-weight: 600; }
        .pos-total-amount { font-size: 1.5rem; font-weight: 700; color: var(--accent); }
        .success-banner { background: #2d9e6b22; color: var(--green); border: 1px solid #2d9e6b44; border-radius: 8px; padding: 10px 16px; font-size: 0.875rem; font-weight: 500; text-align: center; }

        /* BUTTONS */
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--text); color: #fff; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans'; font-size: 0.875rem; font-weight: 500; transition: all 0.15s; white-space: nowrap; }
        .btn-primary:hover:not(:disabled) { background: #3d3128; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-secondary { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--text); border: 1px solid var(--border); padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans'; font-size: 0.875rem; font-weight: 500; transition: all 0.15s; }
        .btn-secondary:hover { background: var(--bg); }
        .btn-ghost-sm { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 5px; display: inline-flex; transition: all 0.15s; }
        .btn-ghost-sm:hover { background: var(--bg); color: var(--text); }
        .btn-icon { background: var(--card); border: 1px solid var(--border); color: var(--text-muted); padding: 8px; border-radius: 8px; cursor: pointer; display: inline-flex; }
        .btn-icon:hover { background: var(--bg); }
        .btn-group { display: flex; background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 3px; gap: 2px; }
        .btn-period { background: none; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.82rem; color: var(--text-muted); font-family: 'DM Sans'; transition: all 0.15s; }
        .btn-period.active { background: var(--text); color: #fff; font-weight: 500; }

        /* TABLES */
        .table-wrap { background: var(--card); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; }
        .table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .table thead tr { background: var(--bg); border-bottom: 1px solid var(--border); }
        .table th { padding: 11px 16px; text-align: left; font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--text-muted); }
        .table-row { border-bottom: 1px solid var(--border); transition: background 0.1s; }
        .table-row:last-child { border-bottom: none; }
        .table-row:hover { background: var(--bg); }
        .table td { padding: 12px 16px; vertical-align: middle; }
        .table-id { font-size: 0.75rem; color: var(--text-muted); font-family: monospace; }
        .empty-cell { text-align: center; color: var(--text-muted); padding: 40px !important; }
        .fw-bold { font-weight: 600; }

        /* SEARCH */
        .search-bar { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 9px; padding: 0 14px; margin-bottom: 16px; }
        .search-icon { color: var(--text-muted); flex-shrink: 0; }
        .search-input { border: none; background: none; padding: 10px 0; flex: 1; font-family: 'DM Sans'; font-size: 0.875rem; color: var(--text); outline: none; min-width: 0; }
        .search-input::placeholder { color: var(--text-muted); }

        /* CHIPS */
        .filter-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
        .chip { background: var(--card); border: 1px solid var(--border); padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; cursor: pointer; color: var(--text-muted); transition: all 0.15s; white-space: nowrap; font-family: 'DM Sans'; }
        .chip:hover { border-color: var(--accent); color: var(--accent); }
        .chip.active { background: var(--text); border-color: var(--text); color: #fff; }
        .chip-warn.active { background: var(--yellow); border-color: var(--yellow); }
        .chip-danger.active { background: var(--red); border-color: var(--red); }

        /* TABS */
        .tabs-row { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .tab-btn { background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 18px; cursor: pointer; font-family: 'DM Sans'; font-size: 0.875rem; color: var(--text-muted); transition: all 0.15s; margin-bottom: -1px; }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-box { background: var(--card); border-radius: 16px; width: 100%; max-width: 520px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); }
        .modal-wide { max-width: 700px; }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px 0; }
        .modal-title { font-family: 'Cormorant Garamond', serif; font-size: 1.4rem; font-weight: 500; }
        .modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; display: flex; }
        .modal-close:hover { background: var(--bg); }
        .modal-body { padding: 16px 24px 24px; }
        .modal-tabs { display: flex; border-bottom: 1px solid var(--border); margin: 0 -24px 20px; padding: 0 24px; }
        .modal-tab { background: none; border: none; border-bottom: 2px solid transparent; padding: 10px 16px; cursor: pointer; font-family: 'DM Sans'; font-size: 0.85rem; color: var(--text-muted); margin-bottom: -1px; transition: all 0.15s; }
        .modal-tab.active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 500; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }

        /* FORM */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .form-item { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .form-label { font-size: 0.78rem; font-weight: 500; color: var(--text-muted); }
        .input { border: 1px solid var(--border); border-radius: 8px; padding: 9px 12px; font-family: 'DM Sans'; font-size: 0.875rem; color: var(--text); background: var(--bg); width: 100%; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: var(--accent); background: #fff; }
        .input::placeholder { color: var(--text-muted); }
        select.input { cursor: pointer; }
        textarea.input { resize: vertical; }
        .checkbox-row { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; font-size: 0.875rem; padding: 10px; background: var(--bg); border-radius: 8px; margin-bottom: 8px; }
        .checkbox-row input { margin-top: 2px; accent-color: var(--accent); }

        /* BADGE */
        .badge { font-size: 0.72rem; padding: 3px 9px; border-radius: 20px; font-weight: 600; white-space: nowrap; }

        /* SPINNER */
        .spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* EMPTY */
        .empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted); }
        .empty-text { color: var(--text-muted); font-size: 0.875rem; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .pos-layout { flex-direction: column; }
          .pos-right { width: 100%; border-left: none; border-top: 1px solid var(--border); }
          .page { padding: 16px; }
          .sidebar { position: fixed; z-index: 200; height: 100vh; }
        }
      `}</style>

      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            {sideOpen && (
              <div>
                <span className="logo-text">Étienne</span>
                <span className="logo-sub">Beauty & Spa</span>
              </div>
            )}
            <button className="sidebar-toggle" onClick={() => setSideOpen(s => !s)}>
              <Icon name="menu" size={18} />
            </button>
          </div>

          <nav className="sidebar-nav">
            {nav.map(n => (
              <button key={n.id} className={`nav-item ${page === n.id ? 'active' : ''}`} onClick={() => setPage(n.id)}>
                <Icon name={n.icon} size={18} />
                <span className="nav-label">{n.id}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-user">
            <div className="user-avatar">{(profile?.nombre || profile?.email || 'U')[0].toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{profile?.nombre || profile?.email}</div>
              <div className="user-role">{profile?.rol || 'usuario'}</div>
            </div>
            <button className="logout-btn" onClick={logout} title="Cerrar sesión"><Icon name="logout" size={16} /></button>
          </div>
        </aside>

        <main className="main">
          <PageComp />
        </main>
      </div>
    </>
  )
}
