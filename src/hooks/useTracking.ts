'use client'

import { useEffect } from 'react'
import { TRACKING_KEY } from '@/lib/client-tracking'

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

    // UTM params — overwrite on every ad click
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
      const v = params.get(k)
      if (v) stored[k] = v
    })

    // Facebook campaign params
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

    // fbclid → compute fbc and store
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

    // fbp: read existing cookie or generate a new one
    let fbp = getCookie('_fbp')
    if (!fbp) {
      fbp = `fb.1.${Date.now()}.${Math.floor(Math.random() * 1e10)}`
      setCookie('_fbp', fbp, 90)
    }
    stored.fbp = fbp

    // First-visit metadata
    if (!stored.first_seen_at) {
      stored.first_seen_at    = new Date().toISOString()
      stored.landing_page_url = window.location.href
      stored.referrer         = document.referrer ?? ''
    }
    stored.last_seen_at = new Date().toISOString()

    setStorage(stored)
  }, [])
}
