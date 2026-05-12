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

export const OfflineConversionSchema = z.object({
  contactId: z.string(),
  status:    z.enum([
    'NewLead', 'Contacted', 'QualifiedLead',
    'TestDriveScheduled', 'Purchase', 'Lost',
  ]),
  customer: z.object({
    phone: z.string().optional(),
    email: z.string().optional(),
  }),
  tracking:        TrackingSchema.optional(),
  eventTime:       z.number().optional(),
  productInterest: z.string().optional(),
  value:           z.number().optional(),
  currency:        z.string().optional(),
})

export type TrackingData      = z.infer<typeof TrackingSchema>
export type ContactPayload    = z.infer<typeof ContactPayloadSchema>
export type OfflineConversion = z.infer<typeof OfflineConversionSchema>
