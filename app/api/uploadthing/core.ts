import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload

      // Renaming the file by appending "محمد" before the file extension
      const fileNameParts = file.name.split(".");
      const fileExtension = fileNameParts.pop(); // Get file extension
      const newName = `Mohammad.${fileExtension}`; // New name with "محمد"

      console.log("Upload complete for userId:", metadata.userId);
      console.log("Old file url:", file.url);

      // Optionally, update file URL logic if you store files locally or use a custom storage
      const newFileUrl = file.url.replace(file.name, newName);

      console.log("New file name:", newName);
      console.log("New file url:", newFileUrl);

      // Return metadata with the new file name or URL
      return { uploadedBy: metadata.userId, newFileName: newName, newFileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
