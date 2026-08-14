const BASE_URL = "http://localhost:5000/api"

export const callScanApi = async (targetDir) => {
    try {
        const response = await fetch(`${BASE_URL}/scan`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetDir })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            throw new Error(errorData.error || "Scan request failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Error Scanning Project", error)
        throw error
    }
}
