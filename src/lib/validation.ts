import { z } from 'zod'

export const TrackingSchema = z.object({
  utm_source:       z.string().optional(),
  utm_medium:       z.string().optional(),
  utm_campaign:     z.string().optional(),
  utm_content:      z.string().optional(),
  utm_term:         z.string().optional(),
  fbclid:           z.string().optional(),
  fbp:              z.string().optional(),
  fbc:              z.string().optional(),
  campaign_id:      z.string().optional(),
  campaign_name:    z.string().optional(),
  adset_id:         z.string().optional(),
  adset_name:       z.string().optional(),
  ad_id:            z.string().optional(),
  ad_name:          z.string().optional(),
  placement:        z.string().optional(),
  landing_page_url: z.string().optional(),
  referrer:         z.string().optional(),
  first_seen_at:    z.string().optional(),
  last_seen_at:     z.string().optional(),
})

export const ContactPayloadSchema = z.object({
  eventName: z.enum([
    'LeadFormSubmitted',
    'PhoneCallClicked',
    'WhatsAppClicked',
    'ContactRequested',
    'VehicleInterestSubmitted',
  ]),
  eventId:  z.string().uuid(),
  customer: z.object({
    name:  z.string().optional(),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email().optional().or(z.literal('')),
  }),
  interest: z.object({
    product: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
  tracking:  TrackingSchema.optional(),
  sourceUrl: z.string().optional(),
})

// /api/tracking/session
export const TrackingSessionPayloadSchema = z.object({
  session_id:       z.string().uuid(),
  utm_source:       z.string().optional(),
  utm_medium:       z.string().optional(),
  utm_campaign:     z.string().optional(),
  utm_content:      z.string().optional(),
  utm_term:         z.string().optional(),
  fbclid:           z.string().optional(),
  fbp:              z.string().optional(),
  fbc:              z.string().optional(),
  campaign_id:      z.string().optional(),
  campaign_name:    z.string().optional(),
  adset_id:         z.string().optional(),
  adset_name:       z.string().optional(),
  ad_id:            z.string().optional(),
  ad_name:          z.string().optional(),
  landing_page_url: z.string().optional(),
  referrer:         z.string().optional(),
})

// /api/tracking/phone-click
export const PhoneClickPayloadSchema = z.object({
  event_id:             z.string().uuid(),
  session_id:           z.string().uuid(),
  clicked_phone_number: z.string().min(1),
  tracking:             TrackingSchema.optional(),
})

// /api/daktela/call-webhook
export const DaktelaCallWebhookSchema = z.object({
  activity_id:     z.string().min(1),
  activity_type:   z.string().optional(),
  activity_action: z.string().optional(),
  caller_number:   z.string().optional().or(z.null()).transform(v => v ?? undefined),
  called_number:   z.string().optional().or(z.null()).transform(v => v ?? undefined),
  direction:       z.string().optional(),
  duration:        z.union([z.string(), z.number()]).optional().transform(v => v !== undefined ? Number(v) : undefined),
  started_at:      z.string().optional().or(z.null()).transform(v => v ?? undefined),
  ended_at:        z.string().optional().or(z.null()).transform(v => v ?? undefined),
  queue:           z.string().optional().or(z.null()).transform(v => v ?? undefined),
  user:            z.string().optional().or(z.null()).transform(v => v ?? undefined),
})

// /api/meta/offline-conversion
export const OfflineConversionSchema = z.object({
  contactId:       z.string().min(1),
  status:          z.enum(['NewLead', 'Contacted', 'QualifiedLead', 'TestDriveScheduled', 'Purchase', 'Sold', 'Lost']),
  customer: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  tracking:        TrackingSchema.optional(),
  eventTime:       z.number().optional(),
  productInterest: z.string().optional(),
  value:           z.union([z.string(), z.number()]).optional().transform(v =>
    v !== undefined && v !== '' ? Number(v) : undefined,
  ),
  currency:        z.string().optional(),
  agentName:       z.string().optional(),
  note:            z.string().optional(),
})

export type TrackingData              = z.infer<typeof TrackingSchema>
export type ContactPayload            = z.infer<typeof ContactPayloadSchema>
export type OfflineConversion         = z.infer<typeof OfflineConversionSchema>
export type TrackingSessionPayload    = z.infer<typeof TrackingSessionPayloadSchema>
export type PhoneClickPayload         = z.infer<typeof PhoneClickPayloadSchema>
export type DaktelaCallWebhookPayload = z.infer<typeof DaktelaCallWebhookSchema>
