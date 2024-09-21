import { db } from "@/lib/db";

// Ensure id is a string or number depending on your event model
export const deleteEvent = async (id: string) => {
  console.log('Attempting to delete event with ID:', id);

  try {
    // Check if the event exists
    const eventExists = await db.event.findUnique({ where: { id } });
    if (!eventExists) {
      throw new Error("Event not found");
    }

    // Delete the event
    const result = await db.event.delete({
      where: { id },
    });

    return result;
  } catch (error: any) {
    console.error("Error deleting event:", error.message || error);
    throw new Error("Error deleting event");
  }
};
