export interface TrackingSession {
  session_id:  string
  created_at:  string
  updated_at:  string

  utm_source?:   string
  utm_medium?:   string
  utm_campaign?: string
  utm_content?:  string
  utm_term?:     string

  fbclid?: string
  fbp?:    string
  fbc?:    string

  campaign_id?:   string
  campaign_name?: string
  adset_id?:      string
  adset_name?:    string
  ad_id?:         string
  ad_name?:       string

  landing_page_url?: string
  referrer?:         string

  ip_address?: string
  user_agent?: string
}

export interface PhoneClick {
  id:                   string  // UUID — doubles as Meta event_id
  session_id:           string
  clicked_phone_number: string
  clicked_at:           string

  campaign_name?:    string
  adset_name?:       string
  ad_name?:          string
  campaign_id?:      string
  adset_id?:         string
  ad_id?:            string
  fbclid?:           string
  fbp?:              string
  fbc?:              string
  landing_page_url?: string

  ip_address?: string
  user_agent?: string
}

export interface CallAttribution {
  phone_click_id:          string
  session_id:              string
  campaign_name?:          string
  adset_name?:             string
  ad_name?:                string
  campaign_id?:            string
  adset_id?:               string
  ad_id?:                  string
  fbclid?:                 string
  fbp?:                    string
  fbc?:                    string
  landing_page_url?:       string
  click_to_call_delta_ms?: number
}

export interface StoredCall {
  activity_id:     string
  activity_type?:  string
  activity_action?: string
  caller_number?:  string
  called_number?:  string
  started_at?:     string
  ended_at?:       string
  direction?:      string
  duration?:       number
  user?:           string
  queue?:          string

  attribution?:    CallAttribution
  processed_at:    string
}
