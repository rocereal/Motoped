'use client'

import { useEffect } from 'react'
import { TRACKING_KEY, getOrCreateSessionId } from '@/lib/client-tracking'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`
}

function getStorage(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(TRACKING_KEY) ?? '{}') } catch { return {} }
}

function setStorage(data: Record<string, string>) {
  try { localStorage.setItem(TRACKING_KEY, JSON.stringify(data)) } catch {}
}

export function useTracking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const stored = getStorage()

    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
      const v = params.get(k)
      if (v) stored[k] = v
    })

    const fbParamMap: Record<string, string> = {
      utm_id: 'campaign_id', campaign_id: 'campaign_id',
      adset_id: 'adset_id', ad_id: 'ad_id',
      campaign_name: 'campaign_name', adset_name: 'adset_name',
      ad_name: 'ad_name', placement: 'placement',
    }
    Object.entries(fbParamMap).forEach(([param, key]) => {
      const v = params.get(param)
      if (v) stored[key] = v
    })

    const fbclid = params.get('fbclid')
    if (fbclid) {
      stored.fbclid = fbclid
      const fbc = `fb.1.${Date.now()}.${fbclid}`
      stored.fbc = fbc
      setCookie('_fbc', fbc, 90)
    } else {
      const fbcCookie = getCookie('_fbc')
      if (fbcCookie && !stored.fbc) stored.fbc = fbcCookie
    }

    let fbp = getCookie('_fbp')
    if (!fbp) {
      fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e10)}`
      setCookie('_fbp', fbp, 90)
    }
    stored.fbp = fbp

    if (!stored.first_seen_at) {
      stored.first_seen_at    = new Date().toISOString()
      stored.landing_page_url = window.location.href
      stored.referrer         = document.referrer ?? ''
    }
    stored.last_seen_at = new Date().toISOString()

    setStorage(stored)

    // Persist session server-side for call attribution
    const sessionId = getOrCreateSessionId()
    const sessionPayload = {
      session_id:       sessionId,
      utm_source:       stored.utm_source,
      utm_medium:       stored.utm_medium,
      utm_campaign:     stored.utm_campaign,
      utm_content:      stored.utm_content,
      utm_term:         stored.utm_term,
      fbclid:           stored.fbclid,
      fbp:              stored.fbp,
      fbc:              stored.fbc,
      campaign_id:      stored.campaign_id,
      campaign_name:    stored.campaign_name,
      adset_id:         stored.adset_id,
      adset_name:       stored.adset_name,
      ad_id:            stored.ad_id,
      ad_name:          stored.ad_name,
      landing_page_url: stored.landing_page_url,
      referrer:         stored.referrer,
    }

    fetch('/api/tracking/session', {
      method:    'POST',
      headers:   { 'Content-Type': 'application/json' },
      keepalive: true,
      body:      JSON.stringify(sessionPayload),
    }).catch(() => {/* silently ignore — non-critical */})
  }, [])
}
