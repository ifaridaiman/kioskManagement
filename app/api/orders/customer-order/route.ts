import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Define request body type
interface EmailRequest {
    email: string;
    orderNumber: string;
    phoneNumber: string;
    address: string;
}

// Type-safe API handler
export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { email, orderNumber, phoneNumber, address }: EmailRequest = await req.json();

        if (!email || !orderNumber || !phoneNumber || !address) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // WhatsApp Number to send message to
        const whatsappNumber = "601121081902"; // Your business WhatsApp number

        // Generate WhatsApp Link
        const orderLink = `https://lemangtul.naisu.my/order/${phoneNumber}/${orderNumber}`;
        const message = `Terima kasih kerana membeli lemangtul, sila hantar di alamat ${address}. Order saya adalah ${orderLink}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // Configure SMTP transporter
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // use TLS
            auth: {
                user: process.env.BREVO_EMAIL as string, // Use environment variables
                pass: process.env.BREVO_PASSWORD as string,
            },
        });

        // Email options with WhatsApp link included
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"LemangTul" <thisisaedali@gmail.com>`,
            to: email,
            subject: "Your Order is Ready for Pickup",
            html: `
                <p>Dear Customer,</p>
                <p>Your order <strong>${orderNumber}</strong> is ready for pickup.</p>
                <p>You can pick it up at our stall, or you can request delivery.</p>
                <p><strong>Delivery Address:</strong> ${address}</p>
                <p>To confirm delivery via WhatsApp, click the button below:</p>
                <a href="${whatsappLink}" target="_blank" style="display: inline-block; padding: 10px 15px; background-color: #25D366; color: #fff; text-decoration: none; border-radius: 5px;">
                    Confirm via WhatsApp
                </a>
                <br><br>
                <p>Best regards,<br>LemangTul - Lemang yang betul</p>
                <br>
                <a href="https://your-unsubscribe-link.com">Click here to unsubscribe</a>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: "Email sending failed!" }, { status: 500 });
    }
}
