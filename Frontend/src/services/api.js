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