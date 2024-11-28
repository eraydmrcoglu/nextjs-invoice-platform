import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Eray Demircioğlu",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "c.eray@hotmail.com" }],
      template_uuid: "03c0c5ec-3f09-42ab-92c3-9f338f31fe2c",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "Invoice",
        company_info_address: "123 Lane",
        company_info_city: "Istanbul",
        company_info_zip_code: "34000",
        company_info_country: "Turkiye",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
