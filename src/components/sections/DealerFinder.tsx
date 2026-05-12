'use client'

import { useState } from 'react'
import PhoneLink from '@/components/ui/PhoneLink'
import { fireTrackingEvent } from '@/lib/client-tracking'

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

function isValidPhone(value: string): boolean {
  return /\d{10,}/.test(value.replace(/[\s\-().+]/g, ''))
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const iconStyle: React.CSSProperties = {
  width: 40, height: 40, borderRadius: '50%',
  background: '#dd0606',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  fontSize: 13,
  color: '#333',
  marginBottom: 6,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 13px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 6,
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  color: '#333',
  outline: 'none',
  background: '#fafafa',
  boxSizing: 'border-box',
}

export default function DealerFinder() {
  const [name,       setName]       = useState('')
  const [phone,      setPhone]      = useState('')
  const [email,      setEmail]      = useState('')
  const [message,    setMessage]    = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [status,     setStatus]     = useState<Status>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneError('')
    if (!isValidPhone(phone)) {
      setPhoneError('Introdu un număr de telefon valid (minim 10 cifre).')
      return
    }
    setStatus('loading')
    try {
      await fireTrackingEvent(
        'LeadFormSubmitted',
        { name: name.trim() || undefined, phone: phone.trim(), email: email.trim() || undefined },
        { product: PRODUCT, message: message.trim() || undefined },
      )
      setStatus('success')
      setName(''); setPhone(''); setEmail(''); setMessage('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="dealer" className="dealer-section light-gray-bg">
      <div className="container">

        {/* Section heading */}
        <div className="heading-wrapper" style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.9rem', marginBottom: 8 }}>
            Dealer Autorizat NIEVE
          </h2>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 0 }}>
            Vizitați showroom-urile noastre sau completați formularul și vă contactăm noi.
          </p>
        </div>

        {/* 2-column layout */}
        <div className="row">

          {/* Left: contact info */}
          <div className="col-lg-5 col-md-12" style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={iconStyle}>
                  <i className="fas fa-map-marker-alt" style={{ color: '#fff', fontSize: 16 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Adresă</p>
                  <p style={{ margin: 0, color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                    Nod Rutier Vestem, Șoseaua Sibiului 296, Sibiu<br />
                    <span style={{ color: '#888' }}>Lângă benzinăria MOL</span>
                  </p>
                  <p style={{ margin: '10px 0 0', color: '#555', fontSize: 14, lineHeight: 1.6 }}>
                    Strada Principală, DN7, Lunguletu<br />
                    <span style={{ color: '#888' }}>Vizavi de Piață</span>
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={iconStyle}>
                  <i className="fas fa-phone" style={{ color: '#fff', fontSize: 16 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Telefon</p>
                  <PhoneLink href="tel:+40377104279" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>
                    0377 104 279
                  </PhoneLink>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={iconStyle}>
                  <i className="fas fa-envelope-open" style={{ color: '#fff', fontSize: 16 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontFamily: "'Poppins', sans-serif", fontSize: 15 }}>Email</p>
                  <a href="mailto:contact@motoped.ro" style={{ color: '#555', fontSize: 14, textDecoration: 'none' }}>
                    contact@motoped.ro
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right: lead form */}
          <div className="col-lg-7 col-md-12">
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
            {status === 'success' ? (
              <div style={{
                padding: '36px 28px',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#dd0606',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
                }}>
                  <i className="fas fa-check" style={{ color: '#fff', fontSize: 24 }} />
                </div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.1rem', marginBottom: 10 }}>
                  Mesaj trimis!
                </h3>
                <p style={{ color: '#555', marginBottom: 20, fontSize: 14 }}>
                  Te vom contacta în curând. Mulțumim pentru interes!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{
                    background: 'transparent', border: '2px solid #dd0606', color: '#dd0606',
                    padding: '8px 24px', borderRadius: 6, fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600, cursor: 'pointer', fontSize: 13,
                  }}
                >
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{ padding: '28px 0 24px' }}
              >
                <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: '#333', marginBottom: 18, textAlign: 'center' }}>
                  Solicită o ofertă — te contactăm în cel mai scurt timp.
                </p>

                <input type="hidden" name="product" value={PRODUCT} />

                <div className="row g-3">
                  <div className="col-md-6">
                    <label style={labelStyle}>Nume</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Ion Popescu" style={inputStyle} />
                  </div>
                  <div className="col-md-6">
                    <label style={labelStyle}>Telefon <span style={{ color: '#dd0606' }}>*</span></label>
                    <input type="tel" value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError('') }}
                      placeholder="07xx xxx xxx" required
                      style={{ ...inputStyle, ...(phoneError ? { borderColor: '#dd0606' } : {}) }} />
                    {phoneError && (
                      <p style={{ color: '#dd0606', fontSize: 12, marginTop: 4, marginBottom: 0 }}>{phoneError}</p>
                    )}
                  </div>
                  <div className="col-12">
                    <label style={labelStyle}>Email <span style={{ color: '#aaa', fontWeight: 400 }}>(opțional)</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplu.ro" style={inputStyle} />
                  </div>
                  <div className="col-12">
                    <label style={labelStyle}>Mesaj <span style={{ color: '#aaa', fontWeight: 400 }}>(opțional)</span></label>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Test drive, culori disponibile, finanțare..."
                      rows={3} style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} />
                  </div>
                  <div className="col-12" style={{ textAlign: 'center' }}>
                    {status === 'error' && (
                      <p style={{ color: '#dd0606', fontSize: 13, marginBottom: 10 }}>
                        A apărut o eroare. Încearcă din nou sau sună la{' '}
                        <a href="tel:+40377104279" style={{ color: '#dd0606' }}>0377 104 279</a>.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn btn-primary has-icon"
                      style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                    >
                      {status === 'loading'
                        ? <span>Se trimite...</span>
                        : <><span>Trimite cererea</span><i className="fas fa-arrow-right" /></>
                      }
                    </button>
                  </div>
                </div>
              </form>
            )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
