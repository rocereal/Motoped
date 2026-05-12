'use client'

import { useState } from 'react'
import { fireTrackingEvent } from '@/lib/client-tracking'

const PRODUCT = process.env.NEXT_PUBLIC_PRODUCT_NAME ?? 'NIEVE Q-EN'

function isValidPhone(value: string): boolean {
  return /\d{10,}/.test(value.replace(/[\s\-().+]/g, ''))
}

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm() {
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [email,   setEmail]   = useState('')
  const [message, setMessage] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

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
    <section id="contact" className="contact-form-section" style={{ backgroundColor: '#f8f8f8', padding: '80px 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">

            <div className="heading-wrapper text-center" style={{ marginBottom: 36 }}>
              <h2 className="large-heading text-uppercase">
                <span>Solicită</span>Ofertă
              </h2>
              <p style={{ color: '#555', lineHeight: 1.7 }}>
                Completează formularul și te contactăm în cel mai scurt timp cu detalii
                despre disponibilitate, finanțare și test drive gratuit.
              </p>
            </div>

            {status === 'success' ? (
              <div style={{
                background: '#fff', borderRadius: 12, padding: '48px 32px',
                textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: '#dd0606', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                }}>
                  <i className="fas fa-check" style={{ color: '#fff', fontSize: 28 }} />
                </div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, marginBottom: 12 }}>
                  Mesaj trimis!
                </h3>
                <p style={{ color: '#555', marginBottom: 24 }}>
                  Te vom contacta în curând. Mulțumim pentru interes!
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{
                    background: 'transparent', border: '2px solid #dd0606',
                    color: '#dd0606', padding: '10px 28px', borderRadius: 6,
                    fontFamily: "'Poppins', sans-serif", fontWeight: 600,
                    cursor: 'pointer', fontSize: 14,
                  }}
                >
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  background: '#fff', borderRadius: 12, padding: '40px 36px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                }}
              >
                {/* Hidden product field */}
                <input type="hidden" name="product" value={PRODUCT} />

                <div className="row">
                  {/* Nume */}
                  <div className="col-md-6" style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>
                      Nume <span style={{ color: '#aaa', fontWeight: 400 }}>(opțional)</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ion Popescu"
                      style={inputStyle}
                    />
                  </div>

                  {/* Telefon */}
                  <div className="col-md-6" style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>
                      Telefon <span style={{ color: '#dd0606' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setPhoneError('') }}
                      placeholder="07xx xxx xxx"
                      required
                      style={{ ...inputStyle, ...(phoneError ? { borderColor: '#dd0606' } : {}) }}
                    />
                    {phoneError && (
                      <p style={{ color: '#dd0606', fontSize: 12, marginTop: 4, marginBottom: 0 }}>
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-12" style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>
                      Email <span style={{ color: '#aaa', fontWeight: 400 }}>(opțional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplu.ro"
                      style={inputStyle}
                    />
                  </div>

                  {/* Mesaj */}
                  <div className="col-12" style={{ marginBottom: 28 }}>
                    <label style={labelStyle}>
                      Mesaj <span style={{ color: '#aaa', fontWeight: 400 }}>(opțional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Doresc informații despre finanțare, culori disponibile, test drive..."
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', minHeight: 110 }}
                    />
                  </div>

                  {/* Submit */}
                  <div className="col-12">
                    {status === 'error' && (
                      <p style={{ color: '#dd0606', fontSize: 13, marginBottom: 12 }}>
                        A apărut o eroare. Încearcă din nou sau sună la{' '}
                        <a href="tel:+40376060045" style={{ color: '#dd0606' }}>+0376 060 045</a>.
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn btn-primary has-icon"
                      style={{ opacity: status === 'loading' ? 0.7 : 1 }}
                    >
                      {status === 'loading' ? (
                        <span>Se trimite...</span>
                      ) : (
                        <>
                          <span>Trimite cererea</span>
                          <i className="fas fa-arrow-right" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  )
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
  padding: '11px 14px',
  border: '1.5px solid #e0e0e0',
  borderRadius: 6,
  fontFamily: "'Poppins', sans-serif",
  fontSize: 14,
  color: '#333',
  outline: 'none',
  background: '#fafafa',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}
