const BASE_URL = "https://file-scanner-8u8e.onrender.com/api";

export const callScanApi = async ({ targetDir, repoUrl }) => {
    try {
        const response = await fetch(`${BASE_URL}/scan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                targetDir,
                repoUrl
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.error || "Scan request failed"
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error Scanning Project", error);
        throw error;
    }
};

export const uploadProject = async (files) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file, file.webkitRelativePath || file.name);
    });

    try {
        const response = await fetch(`${BASE_URL}/scan/upload`, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(
                errorData.error || "Upload scan request failed"
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error Uploading Project", error);
        throw error;
    }
};