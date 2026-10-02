// Single source of truth for every "get in touch" link on the site.
export const CONTACT = {
  phoneDisplay: '+91 95358 62541',
  phoneHref: 'tel:+919535862541',
  altPhoneDisplay: '+91 97140 00169',
  altPhoneHref: 'tel:+919714000169',
  whatsappNumber: '919535862541',
  email: 'hello@bitsandstudios.com',
  address: '204, Alpha Business Park, Judges Bungalow Road, Bodakdev, Ahmedabad',
};

export function whatsappLink(message = "Hi Bits & Studios! I'd like to book a studio visit for my child.") {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
