// // File: app/components/CamelRegistrationForm.tsx

// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "../ui/form"; 
// import { Select } from "../ui/select"; 
// import { Button } from "../ui/button"; 
// import { useRouter } from "next/router";
// import { registerCamelInLoop } from "@/Actions/camelRegister";

// interface Event {
//   id: string;
//   name: string;
//   loops: Loop[];
// }

// interface Loop {
//   id: string;
//   name: string;
//   age: number;
//   sex: string;
//   capacity: number;
// }

// interface Camel {
//   sex: string;
//   id: string;
//   age: number;
//   camelID: string;
//   name: string;
// }

// interface CamelRegistrationFormProps {
//   userId: string;
//   token: string;
//   eventId: string;
// }

// const CamelRegistrationForm: React.FC<CamelRegistrationFormProps> = ({
//   userId,
//   token,
//   eventId,
// }) => {
//   const [camels, setCamels] = useState<Camel[]>([]);
//   const [events, setEvents] = useState<Event[]>([]);
//   const [selectedCamels, setSelectedCamels] = useState<{ [loopId: string]: number[] }>({});
//   const [message, setMessage] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const { handleSubmit } = useForm();

//   useEffect(() => {
//     const fetchCamels = async () => {
//       try {
//         const response = await fetch(`/api/camels/${userId}/route`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           setMessage(errorData.error || "Failed to fetch camels.");
//           return;
//         }

//         const data = await response.json();
//         setCamels(data.camels);
//       } catch (error) {
//         console.error("Error fetching camels:", error);
//         setMessage("An error occurred while fetching camels.");
//       }
//     };

//     fetchCamels();
//   }, [userId, token]);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const response = await fetch(`/api/events/${eventId}/getLoops/route.ts`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           setMessage(errorData.error || "Failed to fetch events and loops.");
//           return;
//         }

//         const data = await response.json();
//         setEvents(data.events);
//       } catch (error) {
//         console.error("Error fetching events and loops:", error);
//         setMessage("An error occurred while fetching events and loops.");
//       }
//     };

//     fetchEvents();
//   }, [eventId, token]);

//   const handleCamelSelection = (loopId: string, camelId: number) => {
//     setSelectedCamels((prev) => {
//       const selected = prev[loopId] || [];
//       if (selected.includes(camelId)) {
//         return {
//           ...prev,
//           [loopId]: selected.filter((id) => id !== camelId),
//         };
//       } else {
//         return {
//           ...prev,
//           [loopId]: [...selected, camelId],
//         };
//       }
//     });
//   };

//   // Submit registration
//   const onSubmit = async () => {
//     setLoading(true);
//     setMessage("");

//     try {
//       const registrationPromises = [];

//       for (const loopId in selectedCamels) {
//         for (const camelId of selectedCamels[loopId]) {
//           registrationPromises.push(
//             registerCamelInLoop({
//               camelId,
//               loopId,
//             })
//           );
//         }
//       }

//       const results = await Promise.all(registrationPromises);

//       const errors = results.filter((result) => result.error);
//       if (errors.length > 0) {
//         setMessage("Some camels failed to register. Please check the logs.");
//         console.error("Registration errors:", errors);
//       } else {
//         setMessage("Camels registered successfully!");
//         router.reload();
//       }
//     } catch (error) {
//       console.error("Error registering camels:", error);
//       setMessage("An error occurred while registering camels.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-md">
//       <h2 className="text-2xl mb-4">Register Camels for Loops</h2>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         {events.length > 0 && camels.length > 0 ? (
//           events.map((event) => (
//             <div key={event.id} className="mb-6">
//               <h3 className="text-xl font-semibold mb-2">Event: {event.name}</h3>
//               {event.loops.map((loop) => (
//                 <div key={loop.id} className="mb-4 pl-4 border-l-2 border-gray-300">
//                   <h4 className="text-lg font-medium mb-1">Loop: {loop.name}</h4>
//                   <p className="text-sm mb-2">
//                     Criteria: Age = {loop.age}, Sex = {loop.sex} | Capacity: {loop.capacity}
//                   </p>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
//                     {camels
//                       .filter(
//                         (camel) =>
//                           camel.age === loop.age 
//                          && camel.sex === loop.sex
//                       )
//                       .map((camel) => (
//                         <label key={camel.id} className="flex items-center space-x-2">
//                           <input
//                             type="checkbox"
//                             className="form-checkbox h-4 w-4 text-blue-600"
//                             checked={selectedCamels[loop.id]?.includes(camel.id) || false}
//                             onChange={() => handleCamelSelection(loop.id, camel.id)}
//                           />
//                           <span>
//                             {camel.name} (ID: {camel.camelID}, Age: {camel.age})
//                           </span>
//                         </label>
//                       ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))
//         ) : (
//           <p>Loading events and camels...</p>
//         )}
//         {message && <p className="mt-4 text-red-500">{message}</p>}
//         <Button type="submit" disabled={loading} className="mt-4">
//           {loading ? "Registering..." : "Register Camels"}
//         </Button>
//       </Form>
//     </div>
//   );
// };

// export default CamelRegistrationForm;
