import { db } from "@/lib/db";

interface UpdateEventData {
  name?: string;
  StartDate?: string;
  EndDate?: string;
}

export const updateEvent = async (id: string, data: UpdateEventData) => {
  console.log('Attempting to update event with ID:', id);
  console.log('Update Data:', data);

  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Invalid ID provided");
  }

  if (!data || Object.keys(data).length === 0) {
    throw new Error("No data provided for update");
  }

  try {
    const eventExists = await db.event.findUnique({ where: { id } });
    if (!eventExists) {
      throw new Error("Event with the provided ID does not exist.");
    }

    const updatedData = {
      ...data,
      StartDate: data.StartDate ? new Date(data.StartDate).toISOString() : undefined,
      EndDate: data.EndDate ? new Date(data.EndDate).toISOString() : undefined,
    };

    const updatedEvent = await db.event.update({
      where: { id },
      data: updatedData,
    });

    return updatedEvent;
  } catch (error: any) {
    console.error("Error updating event:", error.message || error);
    throw new Error(`Error updating event: ${error.message || error}`);
  }
};
