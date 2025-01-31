//! Function to handle image conversion and data population
/*async function handleImageConversion(fileInput, existingImageSrc = "") {
        if (fileInput.files.length === 0) {
            return existingImageSrc; // Return existing image src if no file selected
        }

        try {
            const base64Image = await convertImageToBase64(fileInput.files[0]);
            return base64Image;
        } catch (error) {
            console.error("Error converting image:", error);
            return existingImageSrc; //return existing image src on error
        }
    }*/
//! updated handelImageConversion()
async function handleImageConversion(fileInput, existingImageSrc = "") {
    if (fileInput.files.length === 0) {
        return existingImageSrc;
    }

    try {
        const compressedBase64Image = await compressAndConvertToBase64(
            fileInput.files[0]
        );
        return compressedBase64Image;
    } catch (error) {
        console.error("Error converting or compressing image:", error);
        return existingImageSrc;
    }
}

//! converting image to base64
/*function convertImageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);

            reader.readAsDataURL(file);
        });
    }*/

//! updated convertedImageToBase64
function compressAndConvertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                // Set desired width and height (e.g., 100x100)
                const maxWidth = 100;
                const maxHeight = 100;
                const scale = Math.min(
                    maxWidth / img.width,
                    maxHeight / img.height
                );

                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Compress and convert to base64
                const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                resolve(compressedBase64);
            };

            img.onerror = () =>
                reject(new Error("Error loading image for compression"));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file); // Read file as base64
    });
}
