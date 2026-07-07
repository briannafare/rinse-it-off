"use server";

const GHL_API_KEY = process.env.GHL_API_KEY ?? "";
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID ?? "UiIMlTlrvkxfxHx5ErG2";
const GHL_API_BASE = "https://services.leadconnectorhq.com";

export interface AssessmentFormData {
  propertyType: string;
  services: string[];
  name: string;
  phone: string;
  email: string;
  address: string;
  message: string;
  appointmentDate?: string;
  appointmentTime?: string;
}

export async function submitAssessmentForm(data: AssessmentFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const nameParts = data.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const notesLines: string[] = [
      `Property Type: ${data.propertyType}`,
      `Services Requested: ${data.services.join(", ") || "Not specified"}`,
    ];
    if (data.address) notesLines.push(`Property Address: ${data.address}`);
    if (data.appointmentDate && data.appointmentTime) {
      notesLines.push(`Requested Assessment: ${data.appointmentDate} at ${data.appointmentTime}`);
    }
    if (data.message) notesLines.push(`Notes: ${data.message}`);

    const payload: Record<string, unknown> = {
      locationId: GHL_LOCATION_ID,
      firstName,
      lastName,
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      address1: data.address || undefined,
      source: "Flyer QR Code",
      tags: ["flyer-lead", "assessment-request", data.propertyType.toLowerCase()],
      customFields: [],
    };

    // Create the contact
    const contactRes = await fetch(`${GHL_API_BASE}/contacts/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GHL_API_KEY}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!contactRes.ok) {
      const errBody = await contactRes.text();
      console.error("GHL contact creation failed:", contactRes.status, errBody);
      return { success: false, error: "Failed to save your request. Please call us directly at (503) 704-3755." };
    }

    const contactData = await contactRes.json();
    const contactId = contactData?.contact?.id;

    // Add a note with the full details
    if (contactId && notesLines.length > 0) {
      await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GHL_API_KEY}`,
          "Version": "2021-07-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: contactId,
          body: notesLines.join("\n"),
        }),
      });
    }

    return { success: true };
  } catch (err) {
    console.error("Assessment form submission error:", err);
    return { success: false, error: "Something went wrong. Please call us at (503) 704-3755." };
  }
}
