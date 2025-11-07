import { API_URLS } from "../constants/apiConstants";

class CertificationService {
    /**
     * Delete multiple certifications by their IDs
     * @param certificationIds Array of certification IDs to delete
     * @returns Promise<void>
     */
    async deleteCertifications(certificationIds: string[]): Promise<void> {
        if (!certificationIds || certificationIds.length === 0) {
            throw new Error("No certification IDs provided");
        }

        const response = await fetch(
            `${API_URLS.API_BASE}/Certification/delete`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(certificationIds),
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete certifications");
        }
    }
}

export const certificationService = new CertificationService();
