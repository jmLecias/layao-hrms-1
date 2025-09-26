import emailjs from 'emailjs-com'

interface RoomData {
  roomName: string
  quantity: number
  rate: number
  capacity?: string
  totalCost: number
  checkInDate: string
  checkOutDate: string
  dates?: string[]
}

interface ReservationData {
  firstname: string
  lastname: string
  email: string
  phone: string
  guests: string
  bookedRooms: RoomData[]
  notes?: string
  total: number
  addOnTotal?: number
  additionalJoiner: number
  encryptedData?: string
}

export function useEmail() {
  const sendReservationAcknowledgement = async (data: ReservationData, template: string) => {
    try {
      // Build HTML table for booked rooms
      // Mobile-friendly "card" layout per product (no tables)
      const roomsTable = (() => {
        const currency = (n: number) => `₱${Number(n || 0).toLocaleString()}`

        const cards = data.bookedRooms
          .map((room) => {
            const checkIn = new Date(room.checkInDate)
            const checkOut = new Date(room.checkOutDate)
            const nights = Math.max(0, Math.round((+checkOut - +checkIn) / (1000 * 60 * 60 * 24)))
            const rateSuffix = room.roomName === 'Barkadahan' ? ' / Pax' : ''
            const rate = currency(room.rate) + rateSuffix
            const total = currency(room.totalCost)
            const cap = room.capacity || 'N/A'
            const ci = isNaN(checkIn.getTime()) ? '-' : checkIn.toLocaleDateString()
            const co = isNaN(checkOut.getTime()) ? '-' : checkOut.toLocaleDateString()

            return `
        <div style="
          margin:0 0 12px 0;
          padding:12px;
          border:1px solid #e6e6e6;
          border-radius:10px;
          background:#ffffff;
          font-family: Arial, Helvetica, sans-serif;
          font-size:14px;
          line-height:1.45;
          color:#222;
        ">
          <!-- Top line: Room name + Total -->
          <div style="display:block; margin:0 0 6px 0;">
            <span style="font-weight:700;">${room.roomName}</span>
            <span style="float:right; font-weight:700;">${total}</span>
          </div>

          <!-- Chips row: wraps naturally on mobile -->
          <div style="display:block; clear:both;">
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Qty:</span> ${room.quantity}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Rate:</span> ${rate}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Cap:</span> ${cap}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Check-In:</span> ${ci}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Check-Out:</span> ${co}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Nights:</span> ${nights}
            </span>
          </div>
        </div>
      `
          })
          .join('')

        // Optional: Additional Joiner “card”
        const aj = (data as any).additionalJoiner ?? 0
        const ajRate = 999
        const ajTotal = (data as any).additionalJoinerTotal ?? aj * ajRate
        const joinerCard =
          aj && aj > 0
            ? `
        <div style="
          margin:0 0 12px 0;
          padding:12px;
          border:1px solid #e6e6e6;
          border-radius:10px;
          background:#fcfcfc;
          font-family: Arial, Helvetica, sans-serif;
          font-size:14px;
          line-height:1.45;
          color:#222;
        ">
          <div style="display:block; margin:0 0 6px 0;">
            <span style="font-weight:700;">Additional Joiner</span>
            <span style="float:right; font-weight:700;">${currency(ajTotal)}</span>
          </div>
          <div style="display:block; clear:both;">
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Qty:</span> ${aj}
            </span>
            <span style="display:inline-block; margin:4px 6px 0 0; padding:6px 8px; border:1px solid #eee; border-radius:999px; background:#fafafa;">
              <span style="color:#666;">Rate:</span> ${currency(ajRate)}
            </span>
          </div>
        </div>
      `
            : ''

        // Optional: Grand total summary bar
        const roomsTotal = (data.bookedRooms || []).reduce(
          (sum: number, r: any) => sum + Number(r.totalCost || 0),
          0,
        )
        const grandTotal = roomsTotal + (aj ? ajTotal : 0)

        return `
    <div style="width:100%; max-width:640px; margin:0 auto;">
      ${cards}
      ${joinerCard}
    </div>
  `
      })()

      // Send the email
      const result = await emailjs.send(
        'service_jq6m8ee', // EmailJS Service ID
        template,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          phone: data.phone,
          guests: data.guests,
          roomsTable, // pass HTML table
          notes: data.notes || 'None',
          total: `₱${Number(data.total).toLocaleString()}`,
          addOnTotal: data.addOnTotal ? `₱${Number(data.addOnTotal).toLocaleString()}` : '₱0',
          contactInfo: `If you have any questions or concerns, please contact UWS.`,
          additionalJoiner: data.additionalJoiner,
          encryptedData: data.encryptedData || '',
        },
        'xsvi8L3B4ff5HoCd_', // EmailJS Public Key
      )

      console.log('📧 Acknowledgement email sent!', result.text)
    } catch (error) {
      console.error('❌ Failed to send email:', error)
    }
  }

  return { sendReservationAcknowledgement }
}
