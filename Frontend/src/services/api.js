const BASE_URL = import.meta.env.VITE_API_URL;

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